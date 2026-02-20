import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal } from "drizzle-orm/mysql-core";

// --- Users -----------------------------------------------------------
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  phone: varchar("phone", { length: 32 }),
  avatarUrl: text("avatarUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// --- Quote Submissions (Lead Gen Core) -------------------------------
export const quoteSubmissions = mysqlTable("quote_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  vertical: mysqlEnum("vertical", [
    "sr22_fr44", "burial", "tiny_home", "pet", "gig_economy"
  ]).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  violationType: varchar("violationType", { length: 100 }),
  coverageType: varchar("coverageType", { length: 100 }),
  details: json("details"),
  status: mysqlEnum("status", [
    "pending", "quoted", "contacted", "converted", "expired"
  ]).default("pending").notNull(),
  consent: boolean("consent").default(false).notNull(),
  estimatedPremium: decimal("estimatedPremium", { precision: 10, scale: 2 }),
  assignedAgent: varchar("assignedAgent", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuoteSubmission = typeof quoteSubmissions.$inferSelect;
export type InsertQuoteSubmission = typeof quoteSubmissions.$inferInsert;

// --- Subscriptions ---------------------------------------------------
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tier: mysqlEnum("tier", ["free", "small", "medium", "large", "enterprise"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  status: mysqlEnum("status", ["active", "trialing", "past_due", "canceled", "paused"]).default("trialing").notNull(),
  tokensIncluded: int("tokensIncluded").default(10).notNull(),
  tokensUsed: int("tokensUsed").default(0).notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// --- Token Ledger ----------------------------------------------------
export const tokenLedger = mysqlTable("token_ledger", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(),
  type: mysqlEnum("type", ["credit", "debit", "bonus", "refund"]).notNull(),
  description: varchar("description", { length: 500 }),
  balanceAfter: int("balanceAfter").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TokenLedgerEntry = typeof tokenLedger.$inferSelect;

// --- State Compliance Data -------------------------------------------
export const stateCompliance = mysqlTable("state_compliance", {
  id: int("id").autoincrement().primaryKey(),
  stateCode: varchar("stateCode", { length: 2 }).notNull(),
  stateName: varchar("stateName", { length: 100 }).notNull(),
  sr22Required: boolean("sr22Required").default(false),
  fr44Required: boolean("fr44Required").default(false),
  sr22Duration: varchar("sr22Duration", { length: 50 }),
  minimumLiability: varchar("minimumLiability", { length: 100 }),
  filingFee: decimal("filingFee", { precision: 8, scale: 2 }),
  processingTime: varchar("processingTime", { length: 100 }),
  electronicFiling: boolean("electronicFiling").default(false),
  requirements: json("requirements"),
  notes: text("notes"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StateComplianceData = typeof stateCompliance.$inferSelect;

// --- Analytics Events ------------------------------------------------
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  eventData: json("eventData"),
  page: varchar("page", { length: 255 }),
  vertical: varchar("vertical", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// --- Public Record Leads (Lead Generation Engine) --------------------
export const publicLeads = mysqlTable("public_leads", {
  id: int("id").autoincrement().primaryKey(),
  sourceType: mysqlEnum("sourceType", [
    "marriage_license", "home_purchase", "business_filing", "birth_record", "divorce_record", "vehicle_registration"
  ]).notNull(),
  sourceState: varchar("sourceState", { length: 2 }).notNull(),
  sourceCounty: varchar("sourceCounty", { length: 100 }),
  recordDate: timestamp("recordDate"),
  fullName: varchar("fullName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  address: text("address"),
  suggestedVertical: mysqlEnum("suggestedVertical", [
    "sr22_fr44", "burial", "tiny_home", "pet", "gig_economy", "life", "home"
  ]).notNull(),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "dead"]).default("new").notNull(),
  rawData: json("rawData"),
  notes: text("notes"),
  assignedUserId: int("assignedUserId"),
  contactedAt: timestamp("contactedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PublicLead = typeof publicLeads.$inferSelect;
export type InsertPublicLead = typeof publicLeads.$inferInsert;
