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

// --- Support Tickets -------------------------------------------------
export const supportTickets = mysqlTable("support_tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  guestEmail: varchar("guestEmail", { length: 320 }),
  subject: varchar("subject", { length: 500 }).notNull(),
  body: text("body").notNull(),
  category: mysqlEnum("category", ["billing", "quote", "technical", "compliance", "general"]).default("general").notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high", "urgent"]).default("normal").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "waiting", "resolved", "closed"]).default("open").notNull(),
  assignedAdminId: int("assignedAdminId"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const ticketReplies = mysqlTable("ticket_replies", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId"),
  isAdmin: boolean("isAdmin").default(false).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;
export type TicketReply = typeof ticketReplies.$inferSelect;

// --- Agent Motivation ------------------------------------------------
export const agentGoals = mysqlTable("agent_goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  targetAmount: decimal("targetAmount", { precision: 12, scale: 2 }),
  currentAmount: decimal("currentAmount", { precision: 12, scale: 2 }).default("0"),
  targetDate: timestamp("targetDate"),
  vertical: varchar("vertical", { length: 50 }),
  status: mysqlEnum("status", ["active", "achieved", "abandoned"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const agentCheckIns = mysqlTable("agent_check_ins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  mood: mysqlEnum("mood", ["great", "good", "okay", "tough", "burnout"]).notNull(),
  wins: text("wins"),
  challenges: text("challenges"),
  affirmationSeen: varchar("affirmationSeen", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentGoal = typeof agentGoals.$inferSelect;
export type InsertAgentGoal = typeof agentGoals.$inferInsert;
export type AgentCheckIn = typeof agentCheckIns.$inferSelect;

// --- Scraper Jobs ----------------------------------------------------
export const scraperJobs = mysqlTable("scraper_jobs", {
  id: int("id").autoincrement().primaryKey(),
  jobType: varchar("jobType", { length: 100 }).notNull(),
  sourceState: varchar("sourceState", { length: 2 }).notNull(),
  sourceCounty: varchar("sourceCounty", { length: 100 }),
  targetUrl: text("targetUrl"),
  status: mysqlEnum("status", ["pending", "running", "completed", "failed", "disabled"]).default("pending").notNull(),
  leadsFound: int("leadsFound").default(0),
  lastRunAt: timestamp("lastRunAt"),
  nextRunAt: timestamp("nextRunAt"),
  errorLog: text("errorLog"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScraperJob = typeof scraperJobs.$inferSelect;
export type InsertScraperJob = typeof scraperJobs.$inferInsert;

// --- Phone Call Logs (AI Phone Agent) --------------------------------
export const phoneCallLogs = mysqlTable("phone_call_logs", {
  id: int("id").autoincrement().primaryKey(),
  callSid: varchar("callSid", { length: 255 }),
  callerNumber: varchar("callerNumber", { length: 32 }),
  direction: mysqlEnum("direction", ["inbound", "outbound"]).default("inbound").notNull(),
  detectedVertical: varchar("detectedVertical", { length: 50 }),
  transcription: text("transcription"),
  summary: text("summary"),
  outcome: mysqlEnum("outcome", ["quoted", "transferred", "callback_scheduled", "no_action", "voicemail"]).default("no_action"),
  durationSeconds: int("durationSeconds"),
  recordingUrl: text("recordingUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PhoneCallLog = typeof phoneCallLogs.$inferSelect;
