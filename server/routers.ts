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
} from "./db";
import { invokeLLM } from "./_core/llm";

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

  // ─── Quote Submissions ──────────────────────────────────────────────
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

  // ─── Subscriptions & Tokens ─────────────────────────────────────────
  billing: router({
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      const sub = await getUserSubscription(ctx.user.id);
      const balance = await getTokenBalance(ctx.user.id);
      return { subscription: sub, tokenBalance: balance };
    }),

    getTokenBalance: protectedProcedure.query(async ({ ctx }) => {
      return getTokenBalance(ctx.user.id);
    }),

    useToken: protectedProcedure
      .input(z.object({ amount: z.number().min(1), description: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const balance = await getTokenBalance(ctx.user.id);
        if (balance < input.amount) throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient tokens" });
        const newBalance = await addTokenTransaction(ctx.user.id, -input.amount, "debit", input.description);
        return { newBalance };
      }),
  }),

  // ─── State Compliance ───────────────────────────────────────────────
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

  // ─── AI Quote Comparison ────────────────────────────────────────────
  ai: router({
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

  // ─── Analytics (Admin) ──────────────────────────────────────────────
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
});

export type AppRouter = typeof appRouter;
