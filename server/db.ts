import { eq, desc, and, like, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  quoteSubmissions, InsertQuoteSubmission, QuoteSubmission,
  subscriptions, InsertSubscription,
  tokenLedger,
  stateCompliance,
  analyticsEvents,
  publicLeads, InsertPublicLead, PublicLead,
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

// --- User Helpers ----------------------------------------------------
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

// --- Quote Submission Helpers ----------------------------------------
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

// --- Subscription Helpers --------------------------------------------
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

// --- Token Helpers ---------------------------------------------------
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

// --- State Compliance Helpers ----------------------------------------
export async function getStateComplianceData(stateCode?: string) {
  const db = await getDb();
  if (!db) return [];
  if (stateCode) {
    return db.select().from(stateCompliance).where(eq(stateCompliance.stateCode, stateCode));
  }
  return db.select().from(stateCompliance);
}

// --- Analytics Helpers -----------------------------------------------
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

// --- Public Lead Generation Helpers ----------------------------------
export async function createPublicLead(data: InsertPublicLead): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(publicLeads).values(data);
}

export async function getPublicLeads(opts?: {
  status?: PublicLead["status"];
  sourceType?: PublicLead["sourceType"];
  sourceState?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.status) conditions.push(eq(publicLeads.status, opts.status));
  if (opts?.sourceType) conditions.push(eq(publicLeads.sourceType, opts.sourceType));
  if (opts?.sourceState) conditions.push(eq(publicLeads.sourceState, opts.sourceState));
  const q = db.select().from(publicLeads).orderBy(desc(publicLeads.createdAt)).limit(opts?.limit ?? 50).offset(opts?.offset ?? 0);
  return conditions.length > 0 ? q.where(and(...conditions)) : q;
}

export async function updatePublicLeadStatus(id: number, status: PublicLead["status"], notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Record<string, unknown> = { status };
  if (notes !== undefined) updateData.notes = notes;
  if (status === "contacted") updateData.contactedAt = new Date();
  await db.update(publicLeads).set(updateData).where(eq(publicLeads.id, id));
}

export async function getPublicLeadStats() {
  const db = await getDb();
  if (!db) return { total: 0, new: 0, contacted: 0, qualified: 0, converted: 0 };
  const result = await db.select({
    total: count(),
    newLeads: sql<number>`SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END)`,
    contacted: sql<number>`SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END)`,
    qualified: sql<number>`SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END)`,
    converted: sql<number>`SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END)`,
  }).from(publicLeads);
  return {
    total: result[0]?.total ?? 0,
    new: Number(result[0]?.newLeads ?? 0),
    contacted: Number(result[0]?.contacted ?? 0),
    qualified: Number(result[0]?.qualified ?? 0),
    converted: Number(result[0]?.converted ?? 0),
  };
}

// --- Support Tickets -------------------------------------------------
import {
  supportTickets, ticketReplies, InsertSupportTicket,
  agentGoals, agentCheckIns, InsertAgentGoal,
  scraperJobs, InsertScraperJob,
  phoneCallLogs,
} from "../drizzle/schema";

export async function createSupportTicket(data: InsertSupportTicket) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(supportTickets).values(data).$returningId();
  return result;
}

export async function getSupportTickets(opts?: { status?: string; userId?: number; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.status) conditions.push(eq(supportTickets.status, opts.status as "open" | "in_progress" | "waiting" | "resolved" | "closed"));
  if (opts?.userId) conditions.push(eq(supportTickets.userId, opts.userId));
  const q = db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt)).limit(opts?.limit ?? 50);
  return conditions.length > 0 ? q.where(and(...conditions)) : q;
}

export async function getTicketById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
  return ticket;
}

export async function updateTicketStatus(id: number, status: "open" | "in_progress" | "waiting" | "resolved" | "closed", adminId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(supportTickets).set({
    status,
    assignedAdminId: adminId,
    resolvedAt: status === "resolved" || status === "closed" ? new Date() : undefined,
  }).where(eq(supportTickets.id, id));
}

export async function addTicketReply(ticketId: number, userId: number | null, body: string, isAdmin: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(ticketReplies).values({ ticketId, userId, body, isAdmin });
}

export async function getTicketReplies(ticketId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ticketReplies).where(eq(ticketReplies.ticketId, ticketId)).orderBy(ticketReplies.createdAt);
}

// --- Agent Motivation ------------------------------------------------
export async function createAgentGoal(data: InsertAgentGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(agentGoals).values(data).$returningId();
  return result;
}

export async function getUserAgentGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agentGoals).where(eq(agentGoals.userId, userId)).orderBy(desc(agentGoals.createdAt));
}

export async function updateAgentGoalProgress(id: number, currentAmount: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(agentGoals).set({ currentAmount }).where(eq(agentGoals.id, id));
}

export async function createCheckIn(userId: number, mood: "great" | "good" | "okay" | "tough" | "burnout", wins?: string, challenges?: string, affirmationSeen?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(agentCheckIns).values({ userId, mood, wins, challenges, affirmationSeen });
}

export async function getUserCheckIns(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agentCheckIns).where(eq(agentCheckIns.userId, userId)).orderBy(desc(agentCheckIns.createdAt)).limit(limit);
}

// --- Scraper Jobs ----------------------------------------------------
export async function getScraperJobs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scraperJobs).orderBy(desc(scraperJobs.updatedAt));
}

export async function createScraperJob(data: InsertScraperJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(scraperJobs).values(data).$returningId();
  return result;
}

export async function updateScraperJobStatus(id: number, status: "pending" | "running" | "completed" | "failed" | "disabled", leadsFound?: number, errorLog?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(scraperJobs).set({
    status,
    leadsFound: leadsFound ?? 0,
    lastRunAt: new Date(),
    errorLog,
  }).where(eq(scraperJobs.id, id));
}

// --- Phone Call Logs -------------------------------------------------
export async function createPhoneCallLog(data: Partial<typeof phoneCallLogs.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(phoneCallLogs).values(data as typeof phoneCallLogs.$inferInsert);
}

export async function getPhoneCallLogs(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(phoneCallLogs).orderBy(desc(phoneCallLogs.createdAt)).limit(limit);
}
