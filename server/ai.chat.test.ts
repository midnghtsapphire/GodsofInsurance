import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "I can help you with SR-22 filings, burial insurance, pet coverage, and more. What type of insurance are you interested in?",
        },
      },
    ],
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("ai.chat", () => {
  it("should respond to a chat message about SR-22", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [
        {
          role: "user",
          content: "What is SR-22?",
        },
      ],
      userMessage: "I need SR-22 coverage in California",
    });

    expect(result.reply).toBeDefined();
    expect(typeof result.reply).toBe("string");
    expect(result.reply.length).toBeGreaterThan(0);
  });

  it("should handle multi-turn conversation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [
        {
          role: "user",
          content: "What is SR-22?",
        },
        {
          role: "assistant",
          content: "SR-22 is a form that proves you have liability insurance.",
        },
        {
          role: "user",
          content: "How long do I need it?",
        },
      ],
      userMessage: "How long do I need SR-22?",
    });

    expect(result.reply).toBeDefined();
    expect(typeof result.reply).toBe("string");
  });

  it("should handle pet insurance inquiry", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [],
      userMessage: "Do you offer pet insurance for exotic animals?",
    });

    expect(result.reply).toBeDefined();
    expect(typeof result.reply).toBe("string");
  });

  it("should handle burial insurance inquiry", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [],
      userMessage: "Tell me about burial insurance",
    });

    expect(result.reply).toBeDefined();
    expect(typeof result.reply).toBe("string");
  });

  it("should handle gig economy coverage inquiry", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [],
      userMessage: "I drive for Uber. What coverage do you offer?",
    });

    expect(result.reply).toBeDefined();
    expect(typeof result.reply).toBe("string");
  });

  it("should handle long conversation history", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const messages = Array.from({ length: 10 }, (_, i) => ({
      role: (i % 2 === 0 ? "user" : "assistant") as const,
      content: `Message ${i}`,
    }));

    const result = await caller.ai.chat({
      messages,
      userMessage: "What do you think?",
    });

    expect(result.reply).toBeDefined();
  });

  it("should be publicly accessible (no auth required)", async () => {
    const ctx = createPublicContext();
    expect(ctx.user).toBeNull();

    const caller = appRouter.createCaller(ctx);
    const result = await caller.ai.chat({
      messages: [],
      userMessage: "Hello, can you help me?",
    });

    expect(result.reply).toBeDefined();
  });

  it("should handle tiny home insurance inquiry", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.ai.chat({
      messages: [],
      userMessage: "I live in a tiny home. What coverage options do you have?",
    });

    expect(result.reply).toBeDefined();
    expect(typeof result.reply).toBe("string");
  });
});
