import { eq, desc, and, like, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  quoteSubmissions, InsertQuoteSubmission, QuoteSubmission,
  subscriptions, InsertSubscription,
  tokenLedger,
  stateCompliance,
  analyticsEvents,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User Helpers ────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }

    // Auto-admin for angelreporters@gmail.com
    if (user.email === 'angelreporters@gmail.com') { values.role = 'admin'; updateSet.role = 'admin'; }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ─── Quote Submission Helpers ────────────────────────────────────────
export async function createQuoteSubmission(data: InsertQuoteSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(quoteSubmissions).values(data);
  return result;
}

export async function getQuoteSubmissions(filters?: {
  status?: string; vertical?: string; state?: string; search?: string; limit?: number; offset?: number;
}) {
  const db = await getDb();
  if (!db) return { submissions: [], total: 0 };

  const conditions = [];
  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(quoteSubmissions.status, filters.status as any));
  }
  if (filters?.vertical && filters.vertical !== "all") {
    conditions.push(eq(quoteSubmissions.vertical, filters.vertical as any));
  }
  if (filters?.state) {
    conditions.push(eq(quoteSubmissions.state, filters.state));
  }
  if (filters?.search) {
    conditions.push(
      sql`(${quoteSubmissions.fullName} LIKE ${`%${filters.search}%`} OR ${quoteSubmissions.email} LIKE ${`%${filters.search}%`})`
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [submissions, totalResult] = await Promise.all([
    db.select().from(quoteSubmissions)
      .where(where)
      .orderBy(desc(quoteSubmissions.createdAt))
      .limit(filters?.limit ?? 50)
      .offset(filters?.offset ?? 0),
    db.select({ count: count() }).from(quoteSubmissions).where(where),
  ]);

  return { submissions, total: totalResult[0]?.count ?? 0 };
}

export async function updateQuoteStatus(id: number, status: string, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Record<string, unknown> = { status };
  if (notes) updateData.notes = notes;
  await db.update(quoteSubmissions).set(updateData).where(eq(quoteSubmissions.id, id));
}

export async function getUserQuoteSubmissions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quoteSubmissions).where(eq(quoteSubmissions.userId, userId)).orderBy(desc(quoteSubmissions.createdAt));
}

// ─── Subscription Helpers ────────────────────────────────────────────
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(subscriptions).values(data).onDuplicateKeyUpdate({
    set: { tier: data.tier, status: data.status, tokensIncluded: data.tokensIncluded },
  });
}

// ─── Token Helpers ───────────────────────────────────────────────────
export async function getTokenBalance(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select().from(tokenLedger)
    .where(eq(tokenLedger.userId, userId))
    .orderBy(desc(tokenLedger.createdAt))
    .limit(1);
  return result.length > 0 ? result[0].balanceAfter : 0;
}

export async function addTokenTransaction(userId: number, amount: number, type: "credit" | "debit" | "bonus" | "refund", description: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const currentBalance = await getTokenBalance(userId);
  const newBalance = currentBalance + amount;
  await db.insert(tokenLedger).values({
    userId, amount, type, description, balanceAfter: newBalance,
  });
  return newBalance;
}

// ─── State Compliance Helpers ────────────────────────────────────────
export async function getStateComplianceData(stateCode?: string) {
  const db = await getDb();
  if (!db) return [];
  if (stateCode) {
    return db.select().from(stateCompliance).where(eq(stateCompliance.stateCode, stateCode));
  }
  return db.select().from(stateCompliance);
}

// ─── Analytics Helpers ───────────────────────────────────────────────
export async function trackEvent(userId: number | null, eventType: string, eventData?: unknown, page?: string, vertical?: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(analyticsEvents).values({
    userId, eventType, eventData: eventData ?? null, page, vertical,
  });
}

export async function getAnalyticsSummary() {
  const db = await getDb();
  if (!db) return { totalLeads: 0, convertedLeads: 0, pendingLeads: 0, totalUsers: 0, revenueEstimate: 0 };

  const [leadStats, userStats] = await Promise.all([
    db.select({
      total: count(),
      converted: sql<number>`SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END)`,
      pending: sql<number>`SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`,
    }).from(quoteSubmissions),
    db.select({ total: count() }).from(users),
  ]);

  return {
    totalLeads: leadStats[0]?.total ?? 0,
    convertedLeads: Number(leadStats[0]?.converted ?? 0),
    pendingLeads: Number(leadStats[0]?.pending ?? 0),
    totalUsers: userStats[0]?.total ?? 0,
    revenueEstimate: Number(leadStats[0]?.converted ?? 0) * 85,
  };
}

export async function getLeadsByVertical() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    vertical: quoteSubmissions.vertical,
    count: count(),
  }).from(quoteSubmissions).groupBy(quoteSubmissions.vertical);
}

export async function getLeadsByState() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    state: quoteSubmissions.state,
    count: count(),
  }).from(quoteSubmissions).groupBy(quoteSubmissions.state);
}
