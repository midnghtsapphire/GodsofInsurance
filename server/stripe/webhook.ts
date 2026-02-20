import Stripe from "stripe";
import type { Request, Response } from "express";
import { getDb } from "../db";
import { subscriptions, tokenLedger, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ error: "Missing stripe signature or webhook secret" });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  // CRITICAL: Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Event: ${event.type} | ID: ${event.id}`);

  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return res.status(500).json({ error: "Database unavailable" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = parseInt(session.metadata?.user_id || session.client_reference_id || "0");
        const tier = (session.metadata?.tier || "small") as "small" | "medium" | "large" | "enterprise";

        if (!userId) break;

        const tierTokenMap: Record<string, number> = {
          small: 100, medium: 300, large: 1000, enterprise: 9999,
        };

        await db.insert(subscriptions).values({
          userId,
          tier,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          status: "active",
          tokensIncluded: tierTokenMap[tier] || 100,
          tokensUsed: 0,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }).onDuplicateKeyUpdate({
          set: {
            tier,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            status: "active",
            tokensIncluded: tierTokenMap[tier] || 100,
          },
        });

        // Credit tokens to ledger
        await db.insert(tokenLedger).values({
          userId,
          amount: tierTokenMap[tier] || 100,
          type: "credit",
          description: `Subscription activated: ${tier} plan`,
          balanceAfter: tierTokenMap[tier] || 100,
        });

        console.log(`[Stripe] Subscription activated for user ${userId}, tier: ${tier}`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription & { current_period_start?: number; current_period_end?: number };
        const periodStart = sub.current_period_start ? new Date(sub.current_period_start * 1000) : undefined;
        const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : undefined;
        await db
          .update(subscriptions)
          .set({
            status: sub.status as "active" | "trialing" | "past_due" | "canceled" | "paused",
            ...(periodStart && { currentPeriodStart: periodStart }),
            ...(periodEnd && { currentPeriodEnd: periodEnd }),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await db
          .update(subscriptions)
          .set({ status: "canceled" })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
        const subId = invoice.subscription ?? (invoice as unknown as { parent?: { subscription_details?: { subscription?: string } } }).parent?.subscription_details?.subscription;
        if (subId) {
          await db
            .update(subscriptions)
            .set({ status: "past_due" })
            .where(eq(subscriptions.stripeSubscriptionId, subId));
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
        const subId = invoice.subscription ?? (invoice as unknown as { parent?: { subscription_details?: { subscription?: string } } }).parent?.subscription_details?.subscription;
        if (subId) {
          await db
            .update(subscriptions)
            .set({ status: "active" })
            .where(eq(subscriptions.stripeSubscriptionId, subId));
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("[Stripe Webhook] Processing error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
