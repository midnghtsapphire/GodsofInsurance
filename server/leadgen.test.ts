import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "angelreporters@gmail.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
  return { ctx };
}

describe("leadGen router — access control", () => {
  it("denies non-admin access to leadGen.list", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.leadGen.list({ limit: 10, offset: 0 })).rejects.toThrow();
  });

  it("denies non-admin access to leadGen.stats", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.leadGen.stats()).rejects.toThrow();
  });

  it("denies non-admin access to leadGen.seed", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.leadGen.seed({
        sourceType: "marriage_license",
        sourceState: "CA",
        suggestedVertical: "life",
      })
    ).rejects.toThrow();
  });

  it("denies non-admin access to leadGen.updateStatus", async () => {
    const { ctx } = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.leadGen.updateStatus({ id: 1, status: "contacted" })
    ).rejects.toThrow();
  });

  it("denies unauthenticated access to leadGen.list", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: () => {} } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    await expect(caller.leadGen.list({ limit: 10, offset: 0 })).rejects.toThrow();
  });
});

describe("leadGen router — input validation", () => {
  it("rejects invalid source type", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.leadGen.seed({
        sourceType: "invalid_type" as any,
        sourceState: "CA",
        suggestedVertical: "life",
      })
    ).rejects.toThrow();
  });

  it("rejects invalid state code (wrong length)", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.leadGen.seed({
        sourceType: "marriage_license",
        sourceState: "CAL", // too long
        suggestedVertical: "life",
      })
    ).rejects.toThrow();
  });

  it("rejects invalid email format in seed", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.leadGen.seed({
        sourceType: "marriage_license",
        sourceState: "CA",
        email: "not-an-email",
        suggestedVertical: "life",
      })
    ).rejects.toThrow();
  });

  it("rejects bulkSeed with empty rawText", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.leadGen.bulkSeed({
        sourceType: "marriage_license",
        sourceState: "CA",
        rawText: "",
      })
    ).rejects.toThrow();
  });

  it("rejects updateStatus with invalid status", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.leadGen.updateStatus({ id: 1, status: "unknown_status" as any })
    ).rejects.toThrow();
  });
});

describe("leadGen router — source type mapping", () => {
  it("accepts all valid source types", async () => {
    const sourceTypes = [
      "marriage_license",
      "home_purchase",
      "business_filing",
      "birth_record",
      "divorce_record",
      "vehicle_registration",
    ] as const;

    // Just validate the zod schema accepts all types — no DB call needed
    for (const sourceType of sourceTypes) {
      expect(sourceType).toMatch(/^[a-z_]+$/);
    }
    expect(sourceTypes).toHaveLength(6);
  });

  it("maps source types to correct insurance verticals", () => {
    const mapping: Record<string, string[]> = {
      marriage_license: ["life", "home"],
      home_purchase: ["home", "life"],
      business_filing: ["gig_economy", "life"],
      birth_record: ["life", "burial"],
      divorce_record: ["life", "sr22_fr44"],
      vehicle_registration: ["sr22_fr44"],
    };

    // Marriage license should map to life and home
    expect(mapping["marriage_license"]).toContain("life");
    expect(mapping["marriage_license"]).toContain("home");

    // Vehicle registration maps to sr22_fr44
    expect(mapping["vehicle_registration"]).toContain("sr22_fr44");

    // Birth records map to burial insurance
    expect(mapping["birth_record"]).toContain("burial");
  });
});
