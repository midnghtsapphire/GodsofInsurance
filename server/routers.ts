import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createQuoteSubmission, getQuoteSubmissions, updateQuoteStatus,
  getUserQuoteSubmissions, getUserSubscription, upsertSubscription,
  getTokenBalance, addTokenTransaction, getStateComplianceData,
  trackEvent, getAnalyticsSummary, getLeadsByVertical, getLeadsByState,
  getAllUsers,
  createPublicLead, getPublicLeads, updatePublicLeadStatus, getPublicLeadStats,
  createSupportTicket, getSupportTickets, getTicketById, updateTicketStatus, addTicketReply, getTicketReplies,
  createAgentGoal, getUserAgentGoals, updateAgentGoalProgress, createCheckIn, getUserCheckIns,
  getScraperJobs, createScraperJob, updateScraperJobStatus,
  getPhoneCallLogs, createPhoneCallLog,
} from "./db";
import Stripe from "stripe";
import { PLANS, TOKEN_PACK_PRICES } from "./stripe/products";
import { invokeLLM } from "./_core/llm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-01-28.clover" });

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // --- Quote Submissions ----------------------------------------------
  quotes: router({
    submit: publicProcedure
      .input(z.object({
        vertical: z.enum(["sr22_fr44", "burial", "tiny_home", "pet", "gig_economy"]),
        state: z.string().length(2),
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        violationType: z.string().optional(),
        coverageType: z.string().optional(),
        details: z.any().optional(),
        consent: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!input.consent) throw new TRPCError({ code: "BAD_REQUEST", message: "Consent is required" });
        await createQuoteSubmission({
          ...input,
          userId: ctx.user?.id ?? null,
          details: input.details ?? null,
        });
        await trackEvent(ctx.user?.id ?? null, "quote_submitted", { vertical: input.vertical, state: input.state }, "/quote", input.vertical);
        return { success: true, message: "Quote request submitted successfully" };
      }),

    mySubmissions: protectedProcedure.query(async ({ ctx }) => {
      return getUserQuoteSubmissions(ctx.user.id);
    }),

    // Admin: list all submissions
    list: adminProcedure
      .input(z.object({
        status: z.string().optional(),
        vertical: z.string().optional(),
        state: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return getQuoteSubmissions(input);
      }),

    // Admin: update status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "quoted", "contacted", "converted", "expired"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateQuoteStatus(input.id, input.status, input.notes);
        return { success: true };
      }),
  }),

    // --- Subscriptions & Tokens (merged into billing below) ---------------

  // --- State Compliance -----------------------------------------------
  compliance: router({
    getByState: publicProcedure
      .input(z.object({ stateCode: z.string().length(2) }))
      .query(async ({ input }) => {
        const data = await getStateComplianceData(input.stateCode);
        return data.length > 0 ? data[0] : null;
      }),

    getAllStates: publicProcedure.query(async () => {
      return getStateComplianceData();
    }),
  }),

  // --- AI Chat Assistant ------------------------------------------------
  ai: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        userMessage: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a helpful insurance assistant for Gods of Insurance (ReinstatePro). You help customers with:
- SR-22 and FR-44 filings
- Burial and final expense insurance
- Tiny home and mobile home coverage
- Pet insurance (including exotic, therapy, rescue, foster, breeder)
- Gig economy coverage for rideshare and delivery drivers
- State compliance requirements
- Quote comparisons

Be friendly, professional, and concise. Always encourage users to get a free quote when appropriate. Provide accurate information about coverage options and filing processes.`,
            },
            ...input.messages.map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
            {
              role: "user",
              content: input.userMessage,
            },
          ],
        });

        const rawContent = response.choices?.[0]?.message?.content;
        const reply = typeof rawContent === 'string' ? rawContent : 'I apologize, I could not process your request. Please try again.';
        return { reply };
      }),

    compareQuotes: protectedProcedure
      .input(z.object({
        vertical: z.string(),
        state: z.string(),
        coverageType: z.string(),
        details: z.any().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const balance = await getTokenBalance(ctx.user.id);
        if (balance < 1) throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient tokens. Please add more tokens to use AI comparison." });

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are an insurance comparison expert. Generate a realistic comparison of 3-4 insurance carriers for the given coverage type. Return JSON with this structure: { "carriers": [{ "name": string, "monthlyPremium": number, "coverageLimits": string, "deductible": number, "rating": number (1-5), "highlights": string[], "drawbacks": string[] }], "recommendation": string, "disclaimer": string }`,
            },
            {
              role: "user",
              content: `Compare insurance options for: Vertical: ${input.vertical}, State: ${input.state}, Coverage: ${input.coverageType}. Details: ${JSON.stringify(input.details || {})}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "insurance_comparison",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  carriers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        monthlyPremium: { type: "number" },
                        coverageLimits: { type: "string" },
                        deductible: { type: "number" },
                        rating: { type: "number" },
                        highlights: { type: "array", items: { type: "string" } },
                        drawbacks: { type: "array", items: { type: "string" } },
                      },
                      required: ["name", "monthlyPremium", "coverageLimits", "deductible", "rating", "highlights", "drawbacks"],
                      additionalProperties: false,
                    },
                  },
                  recommendation: { type: "string" },
                  disclaimer: { type: "string" },
                },
                required: ["carriers", "recommendation", "disclaimer"],
                additionalProperties: false,
              },
            },
          },
        });

        await addTokenTransaction(ctx.user.id, -1, "debit", "AI quote comparison");
        await trackEvent(ctx.user.id, "ai_comparison", { vertical: input.vertical, state: input.state }, "/compare", input.vertical);

        const rawContent = response.choices?.[0]?.message?.content;
        const textContent = typeof rawContent === 'string' ? rawContent : '';
        try {
          return textContent ? JSON.parse(textContent) : { carriers: [], recommendation: "Unable to generate comparison", disclaimer: "For informational purposes only." };
        } catch {
          return { carriers: [], recommendation: "Unable to generate comparison", disclaimer: "For informational purposes only." };
        }
       }),
  }),

  // --- Lead Generation Engine (Public Records) -----------------------
  leadGen: router({
    // Seed a lead from public records (admin or system)
    seed: adminProcedure
      .input(z.object({
        sourceType: z.enum(["marriage_license", "home_purchase", "business_filing", "birth_record", "divorce_record", "vehicle_registration"]),
        sourceState: z.string().length(2),
        sourceCounty: z.string().optional(),
        recordDate: z.string().optional(),
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        suggestedVertical: z.enum(["sr22_fr44", "burial", "tiny_home", "pet", "gig_economy", "life", "home"]),
        rawData: z.any().optional(),
      }))
      .mutation(async ({ input }) => {
        await createPublicLead({
          ...input,
          recordDate: input.recordDate ? new Date(input.recordDate) : undefined,
        });
        return { success: true };
      }),

    // Bulk seed from AI-analyzed public data
    bulkSeed: adminProcedure
      .input(z.object({
        sourceType: z.enum(["marriage_license", "home_purchase", "business_filing", "birth_record", "divorce_record", "vehicle_registration"]),
        sourceState: z.string().length(2),
        rawText: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a lead extraction assistant for an insurance platform. Extract individual leads from public record data and return them as JSON. For each lead, determine the best insurance vertical based on the record type:\n- marriage_license -> life, home\n- home_purchase -> home, life\n- business_filing -> gig_economy, life\n- birth_record -> life, burial\n- divorce_record -> life, sr22_fr44\n- vehicle_registration -> sr22_fr44\n\nReturn JSON array: [{fullName, email, phone, address, suggestedVertical, notes}]`,
            },
            {
              role: "user",
              content: `Extract leads from this ${input.sourceType} data for ${input.sourceState}:\n\n${input.rawText}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "leads_extraction",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  leads: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        fullName: { type: "string" },
                        email: { type: "string" },
                        phone: { type: "string" },
                        address: { type: "string" },
                        suggestedVertical: { type: "string", enum: ["sr22_fr44", "burial", "tiny_home", "pet", "gig_economy", "life", "home"] },
                        notes: { type: "string" },
                      },
                      required: ["fullName", "suggestedVertical"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["leads"],
                additionalProperties: false,
              },
            },
          },
        });

        const rawContent = response.choices?.[0]?.message?.content;
        const parsed = typeof rawContent === "string" ? JSON.parse(rawContent) : { leads: [] };
        const leads = parsed.leads ?? [];

        for (const lead of leads) {
          await createPublicLead({
            sourceType: input.sourceType,
            sourceState: input.sourceState,
            fullName: lead.fullName,
            email: lead.email || undefined,
            phone: lead.phone || undefined,
            address: lead.address || undefined,
            suggestedVertical: lead.suggestedVertical,
            rawData: lead,
          });
        }

        return { seeded: leads.length };
      }),

    list: adminProcedure
      .input(z.object({
        status: z.enum(["new", "contacted", "qualified", "converted", "dead"]).optional(),
        sourceType: z.enum(["marriage_license", "home_purchase", "business_filing", "birth_record", "divorce_record", "vehicle_registration"]).optional(),
        sourceState: z.string().length(2).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input }) => {
        return getPublicLeads(input);
      }),

    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "converted", "dead"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updatePublicLeadStatus(input.id, input.status, input.notes);
        return { success: true };
      }),

    stats: adminProcedure.query(async () => {
      return getPublicLeadStats();
    }),
  }),

  // --- Analytics (Admin) ----------------------------------------------
  analytics: router({
    summary: adminProcedure.query(async () => {
      return getAnalyticsSummary();
    }),

    leadsByVertical: adminProcedure.query(async () => {
      return getLeadsByVertical();
    }),

    leadsByState: adminProcedure.query(async () => {
      return getLeadsByState();
    }),

    allUsers: adminProcedure.query(async () => {
      return getAllUsers();
    }),
  }),

  // --- Stripe Billing ------------------------------------------------
  billing: router({
    plans: publicProcedure.query(() => Object.values(PLANS)),
    mySubscription: protectedProcedure.query(async ({ ctx }) => {
      return getUserSubscription(ctx.user.id);
    }),
    createCheckout: protectedProcedure
      .input(z.object({
        tier: z.enum(["small", "medium", "large", "enterprise"]),
        interval: z.enum(["monthly", "yearly"]).default("monthly"),
        origin: z.string().url(),
      }))
      .mutation(async ({ input, ctx }) => {
        const plan = PLANS[input.tier];
        if (!plan) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid plan" });
        const priceCents = input.interval === "yearly" ? plan.yearlyPriceCents : plan.monthlyPriceCents;
        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          customer_email: ctx.user.email ?? undefined,
          allow_promotion_codes: true,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email ?? "",
            customer_name: ctx.user.name ?? "",
            tier: input.tier,
          },
          line_items: [{
            price_data: {
              currency: "usd",
              recurring: { interval: input.interval === "yearly" ? "year" : "month" },
              unit_amount: priceCents,
              product_data: {
                name: `Gods of Insurance — ${plan.name} Plan`,
                description: plan.description,
              },
            },
            quantity: 1,
          }],
          success_url: `${input.origin}/dashboard?billing=success`,
          cancel_url: `${input.origin}/pricing?billing=canceled`,
        });
        return { url: session.url };
      }),
    buyTokens: protectedProcedure
      .input(z.object({
        pack: z.enum(["pack_50", "pack_200", "pack_500"]),
        origin: z.string().url(),
      }))
      .mutation(async ({ input, ctx }) => {
        const pack = TOKEN_PACK_PRICES[input.pack];
        if (!pack) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid token pack" });
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          customer_email: ctx.user.email ?? undefined,
          allow_promotion_codes: true,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            type: "token_purchase",
            tokens: pack.tokens.toString(),
            pack: input.pack,
          },
          line_items: [{
            price_data: {
              currency: "usd",
              unit_amount: pack.priceCents,
              product_data: { name: `${pack.tokens} AI Tokens — Gods of Insurance` },
            },
            quantity: 1,
          }],
          success_url: `${input.origin}/dashboard?tokens=purchased`,
          cancel_url: `${input.origin}/pricing?tokens=canceled`,
        });
        return { url: session.url };
      }),
    tokenBalance: protectedProcedure.query(async ({ ctx }) => {
      const balance = await getTokenBalance(ctx.user.id);
      return { balance };
    }),
  }),

  // --- Support Tickets ------------------------------------------------
  support: router({
    create: publicProcedure
      .input(z.object({
        subject: z.string().min(5).max(500),
        body: z.string().min(10),
        category: z.enum(["billing", "quote", "technical", "compliance", "general"]).default("general"),
        priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
        guestEmail: z.string().email().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await createSupportTicket({
          ...input,
          userId: ctx.user?.id ?? null,
          guestEmail: input.guestEmail ?? null,
        });
        return { id };
      }),
    myTickets: protectedProcedure.query(async ({ ctx }) => {
      return getSupportTickets({ userId: ctx.user.id });
    }),
    getTicket: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const ticket = await getTicketById(input.id);
        if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
        if (ticket.userId !== ctx.user.id && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const replies = await getTicketReplies(input.id);
        return { ticket, replies };
      }),
    reply: protectedProcedure
      .input(z.object({ ticketId: z.number(), body: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const ticket = await getTicketById(input.ticketId);
        if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
        if (ticket.userId !== ctx.user.id && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await addTicketReply(input.ticketId, ctx.user.id, input.body, ctx.user.role === "admin");
        return { success: true };
      }),
    // Admin
    allTickets: adminProcedure.query(async () => getSupportTickets()),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["open", "in_progress", "waiting", "resolved", "closed"]),
      }))
      .mutation(async ({ input, ctx }) => {
        await updateTicketStatus(input.id, input.status, ctx.user.id);
        return { success: true };
      }),
  }),

  // --- Agent Motivation -----------------------------------------------
  agent: router({
    getAffirmation: protectedProcedure.query(async ({ ctx }) => {
      const affirmations = [
        "Every rejection is one step closer to a yes. Zeus himself faced battles before victory.",
        "You are not selling insurance — you are giving families the gift of peace of mind.",
        "The gods of Olympus did not build empires in a day. Your pipeline is growing.",
        "Every 'no' you hear today is protecting someone else's 'yes' tomorrow.",
        "Insurance agents are the unsung heroes — you protect what people love most.",
        "Your persistence today is someone's financial security tomorrow.",
        "The best agents aren't born — they're forged through every difficult call.",
        "You have the power of Zeus behind you. Your protection is divine.",
        "Rejection is redirection. The right client is always just ahead.",
        "Your work matters more than you know. Families sleep better because of you.",
        "Like Hermes, you carry messages of protection to those who need them most.",
        "Athena's wisdom guides you. Every client conversation makes you stronger.",
        "The storm always breaks. Your best month is always ahead of you.",
        "You are building a legacy, not just a commission. Keep going.",
        "Every policy you write is a shield for a family. That is divine work.",
      ];
      const today = new Date().toDateString();
      const idx = (ctx.user.id + today.length) % affirmations.length;
      return { affirmation: affirmations[idx], date: today };
    }),
    getAIAffirmation: protectedProcedure
      .input(z.object({ mood: z.enum(["great", "good", "okay", "tough", "burnout"]) }))
      .mutation(async ({ input, ctx }) => {
        const balance = await getTokenBalance(ctx.user.id);
        if (balance < 1) throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient tokens" });
        const moodContext = {
          great: "They are having an amazing day and crushing their goals.",
          good: "They are doing well but want to keep momentum.",
          okay: "They are having an average day and need a gentle boost.",
          tough: "They are struggling with rejections and need real encouragement.",
          burnout: "They are experiencing burnout and need compassionate, grounding support.",
        };
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are the Oracle of Olympus — a wise, warm, powerful voice that speaks directly to insurance agents. You blend Greek mythology metaphors with practical, grounded encouragement. Keep responses to 2-3 sentences. Never be generic. Always be specific to the insurance industry." },
            { role: "user", content: `Generate a personalized affirmation for an insurance agent. Mood context: ${moodContext[input.mood]} Name: ${ctx.user.name || "Agent"}.` },
          ],
        });
        const affirmation = (response.choices[0]?.message?.content as string) || "You are doing divine work. Keep going.";
        await addTokenTransaction(ctx.user.id, -1, "debit", "AI affirmation generated");
        return { affirmation };
      }),
    myGoals: protectedProcedure.query(async ({ ctx }) => getUserAgentGoals(ctx.user.id)),
    createGoal: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        targetAmount: z.string().optional(),
        targetDate: z.string().optional(),
        vertical: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await createAgentGoal({
          userId: ctx.user.id,
          title: input.title,
          targetAmount: input.targetAmount ?? null,
          targetDate: input.targetDate ? new Date(input.targetDate) : null,
          vertical: input.vertical ?? null,
        });
        return { id };
      }),
    updateProgress: protectedProcedure
      .input(z.object({ id: z.number(), currentAmount: z.string() }))
      .mutation(async ({ input }) => {
        await updateAgentGoalProgress(input.id, input.currentAmount);
        return { success: true };
      }),
    checkIn: protectedProcedure
      .input(z.object({
        mood: z.enum(["great", "good", "okay", "tough", "burnout"]),
        wins: z.string().optional(),
        challenges: z.string().optional(),
        affirmationSeen: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await createCheckIn(ctx.user.id, input.mood, input.wins, input.challenges, input.affirmationSeen);
        return { success: true };
      }),
    myCheckIns: protectedProcedure.query(async ({ ctx }) => getUserCheckIns(ctx.user.id)),
  }),

  // --- Scraper Jobs (Admin) -------------------------------------------
  scraper: router({
    jobs: adminProcedure.query(async () => getScraperJobs()),
    create: adminProcedure
      .input(z.object({
        jobType: z.string(),
        sourceState: z.string().length(2),
        sourceCounty: z.string().optional(),
        targetUrl: z.string().url().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createScraperJob({
          jobType: input.jobType,
          sourceState: input.sourceState,
          sourceCounty: input.sourceCounty ?? null,
          targetUrl: input.targetUrl ?? null,
          nextRunAt: new Date(Date.now() + 60 * 1000),
        });
        return { id };
      }),
    toggle: adminProcedure
      .input(z.object({ id: z.number(), enabled: z.boolean() }))
      .mutation(async ({ input }) => {
        await updateScraperJobStatus(input.id, input.enabled ? "pending" : "disabled");
        return { success: true };
      }),
  }),

  // --- Phone Logs (Admin) ---------------------------------------------
  phone: router({
    logs: adminProcedure.query(async () => getPhoneCallLogs()),
    logCall: publicProcedure
      .input(z.object({
        callSid: z.string().optional(),
        callerNumber: z.string().optional(),
        detectedVertical: z.string().optional(),
        transcription: z.string().optional(),
        summary: z.string().optional(),
        outcome: z.enum(["quoted", "transferred", "callback_scheduled", "no_action", "voicemail"]).optional(),
        durationSeconds: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await createPhoneCallLog(input);
        return { success: true };
      }),
  }),
});
export type AppRouter = typeof appRouter;
