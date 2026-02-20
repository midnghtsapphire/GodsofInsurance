import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return createUserContext({ id: 99, role: "admin", openId: "admin-user-123", email: "admin@example.com", name: "Admin" });
}

// --- Auth Tests --------------------------------------------------------------

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user data for authenticated users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@example.com");
    expect(result?.name).toBe("Test User");
    expect(result?.role).toBe("user");
  });
});

// --- Quote Submission Validation Tests ---------------------------------------

describe("quotes.submit", () => {
  it("rejects submission without consent", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.quotes.submit({
        vertical: "sr22_fr44",
        state: "CA",
        fullName: "John Doe",
        email: "john@example.com",
        consent: false,
      })
    ).rejects.toThrow("Consent is required");
  });

  it("rejects invalid email format", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.quotes.submit({
        vertical: "sr22_fr44",
        state: "CA",
        fullName: "John Doe",
        email: "not-an-email",
        consent: true,
      })
    ).rejects.toThrow();
  });

  it("rejects invalid state code (too long)", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.quotes.submit({
        vertical: "sr22_fr44",
        state: "CALIFORNIA",
        fullName: "John Doe",
        email: "john@example.com",
        consent: true,
      })
    ).rejects.toThrow();
  });

  it("rejects invalid vertical", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.quotes.submit({
        vertical: "invalid_vertical" as any,
        state: "CA",
        fullName: "John Doe",
        email: "john@example.com",
        consent: true,
      })
    ).rejects.toThrow();
  });

  it("rejects empty fullName", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.quotes.submit({
        vertical: "sr22_fr44",
        state: "CA",
        fullName: "",
        email: "john@example.com",
        consent: true,
      })
    ).rejects.toThrow();
  });
});

// --- Admin Access Control Tests ----------------------------------------------

describe("admin access control", () => {
  it("denies non-admin users from listing leads", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.quotes.list()).rejects.toThrow();
  });

  it("denies unauthenticated users from listing leads", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.quotes.list()).rejects.toThrow();
  });

  it("denies non-admin users from updating lead status", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.quotes.updateStatus({ id: 1, status: "quoted" })
    ).rejects.toThrow();
  });

  it("denies non-admin users from viewing analytics summary", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.analytics.summary()).rejects.toThrow();
  });

  it("denies non-admin users from viewing leads by vertical", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.analytics.leadsByVertical()).rejects.toThrow();
  });

  it("denies non-admin users from viewing all users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.analytics.allUsers()).rejects.toThrow();
  });
});

// --- Protected Route Tests ---------------------------------------------------

describe("protected routes", () => {
  it("denies unauthenticated users from viewing submissions", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.quotes.mySubmissions()).rejects.toThrow();
  });

  it("denies unauthenticated users from getting subscription", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.billing.getSubscription()).rejects.toThrow();
  });

  it("denies unauthenticated users from getting token balance", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.billing.getTokenBalance()).rejects.toThrow();
  });

  it("denies unauthenticated users from using tokens", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.billing.useToken({ amount: 1, description: "test" })
    ).rejects.toThrow();
  });

  it("denies unauthenticated users from AI comparison", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.ai.compareQuotes({ vertical: "sr22_fr44", state: "CA", coverageType: "standard" })
    ).rejects.toThrow();
  });
});

// --- Billing Input Validation Tests ------------------------------------------

describe("billing.useToken validation", () => {
  it("rejects negative token amounts", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.billing.useToken({ amount: -1, description: "test" })
    ).rejects.toThrow();
  });

  it("rejects zero token amounts", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.billing.useToken({ amount: 0, description: "test" })
    ).rejects.toThrow();
  });
});

// --- Compliance Input Validation Tests ---------------------------------------

describe("compliance.getByState validation", () => {
  it("rejects invalid state code length", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.compliance.getByState({ stateCode: "CALIFORNIA" })
    ).rejects.toThrow();
  });
});

// --- Quote Update Status Validation ------------------------------------------

describe("quotes.updateStatus validation", () => {
  it("rejects invalid status values", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(
      caller.quotes.updateStatus({ id: 1, status: "invalid_status" as any })
    ).rejects.toThrow();
  });
});
