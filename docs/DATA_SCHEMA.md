# Gods of Insurance — Data Schema

**Database:** MySQL/TiDB (via Drizzle ORM)  
**ORM:** Drizzle ORM v0.44+  
**Schema file:** `drizzle/schema.ts`

---

## Tables Overview

| Table | Purpose |
|---|---|
| `users` | Authentication and user profiles |
| `quoteSubmissions` | Customer quote requests |
| `subscriptions` | Agent subscription billing records |
| `tokenTransactions` | AI token economy ledger |
| `stateComplianceData` | SR-22/FR-44 requirements by state |
| `aiComparisons` | AI quote comparison results |
| `publicLeads` | Leads generated from public records |
| `agentGoals` | Agent commission and activity goals |
| `agentCheckIns` | Daily agent mood and wellness check-ins |
| `supportTickets` | Customer/agent support requests |
| `supportReplies` | Threaded replies on support tickets |
| `scraperJobs` | Public records scraper job tracking |
| `phoneCallLogs` | AI phone agent call records |

---

## Table Definitions

### `users`
Core user table backing auth flow.

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | Auto-increment |
| `openId` | varchar(64) | Manus OAuth identifier, unique |
| `name` | text | Display name |
| `email` | varchar(320) | Email address |
| `loginMethod` | varchar(64) | OAuth provider |
| `role` | enum(user, admin) | Default: user |
| `stripeCustomerId` | varchar(128) | Stripe customer ID |
| `createdAt` | timestamp | Auto |
| `updatedAt` | timestamp | Auto-update |
| `lastSignedIn` | timestamp | Updated on login |

### `quoteSubmissions`
Customer quote requests from the QuoteWizard.

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | Auto-increment |
| `userId` | int | FK → users.id (nullable for guests) |
| `vertical` | enum | sr22, fr44, non_owner, burial, tiny_home, pet, gig |
| `firstName` | varchar(100) | |
| `lastName` | varchar(100) | |
| `email` | varchar(320) | |
| `phone` | varchar(20) | |
| `state` | varchar(2) | 2-letter state code |
| `coverageType` | varchar(100) | |
| `vehicleYear` | varchar(4) | |
| `vehicleMake` | varchar(100) | |
| `vehicleModel` | varchar(100) | |
| `violations` | text | JSON array of violations |
| `estimatedPremium` | decimal(10,2) | AI-estimated monthly premium |
| `status` | enum | pending, quoted, contacted, converted, expired |
| `notes` | text | Admin notes |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `subscriptions`
Agent subscription billing records (Stripe IDs only — no duplicate data).

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `userId` | int | FK → users.id |
| `stripeSubscriptionId` | varchar(128) | Stripe subscription ID |
| `tier` | enum | small, medium, large, enterprise |
| `status` | enum | active, canceled, past_due, trialing |
| `interval` | enum | monthly, yearly |
| `tokensIncluded` | int | Tokens per billing period |
| `tokensUsed` | int | Tokens consumed this period |
| `currentPeriodEnd` | timestamp | When current period ends |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `tokenTransactions`
AI token economy ledger (append-only).

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `userId` | int | FK → users.id |
| `amount` | int | Positive = credit, negative = debit |
| `type` | enum | credit, debit, purchase, refund |
| `description` | text | Human-readable reason |
| `createdAt` | timestamp | |

### `publicLeads`
Leads generated from public records (exclusive, not resold).

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `sourceType` | enum | marriage_license, home_purchase, business_filing, birth_record, divorce_record, vehicle_registration |
| `firstName` | varchar(100) | |
| `lastName` | varchar(100) | |
| `email` | varchar(320) | |
| `phone` | varchar(20) | |
| `state` | varchar(2) | |
| `county` | varchar(100) | |
| `eventDate` | timestamp | Date of the life event |
| `rawData` | text | Original scraped data |
| `status` | enum | new, contacted, qualified, converted, dead |
| `assignedTo` | int | FK → users.id (agent) |
| `notes` | text | |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `agentGoals`
Agent commission and activity goals.

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `userId` | int | FK → users.id |
| `title` | varchar(255) | Goal description |
| `targetAmount` | decimal(10,2) | Dollar target (optional) |
| `currentAmount` | decimal(10,2) | Current progress |
| `targetDate` | timestamp | Deadline (optional) |
| `status` | enum | active, completed, abandoned |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `agentCheckIns`
Daily agent mood and wellness check-ins.

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `userId` | int | FK → users.id |
| `mood` | enum | great, good, okay, tough, burnout |
| `wins` | text | What went well |
| `challenges` | text | What was difficult |
| `affirmationSeen` | text | The affirmation shown |
| `createdAt` | timestamp | |

### `supportTickets`
Customer and agent support requests.

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `userId` | int | FK → users.id (nullable for guests) |
| `guestEmail` | varchar(320) | For non-authenticated users |
| `subject` | varchar(500) | |
| `body` | text | |
| `category` | enum | billing, quote, technical, compliance, general |
| `priority` | enum | low, normal, high, urgent |
| `status` | enum | open, in_progress, waiting, resolved, closed |
| `assignedTo` | int | FK → users.id (admin) |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

### `phoneCallLogs`
AI phone agent call records.

| Column | Type | Notes |
|---|---|---|
| `id` | int PK | |
| `callSid` | varchar(128) | Twilio/Google Voice call ID |
| `callerPhone` | varchar(20) | Caller's phone number |
| `detectedVertical` | varchar(100) | Insurance vertical identified |
| `transcription` | text | Full call transcript |
| `summary` | text | AI-generated call summary |
| `outcome` | enum | quoted, transferred, callback_scheduled, no_action, voicemail |
| `durationSeconds` | int | Call duration |
| `createdAt` | timestamp | |

---

## Relationships

```
users (1) ──── (many) quoteSubmissions
users (1) ──── (1) subscriptions
users (1) ──── (many) tokenTransactions
users (1) ──── (many) agentGoals
users (1) ──── (many) agentCheckIns
users (1) ──── (many) supportTickets
users (1) ──── (many) supportReplies
publicLeads (many) ──── (1) users [assignedTo]
supportTickets (1) ──── (many) supportReplies
```

---

## Token Balance Calculation

Token balance is derived from the `tokenTransactions` table (not stored as a column):

```sql
SELECT SUM(amount) as balance 
FROM tokenTransactions 
WHERE userId = ?
```

This ensures the balance is always accurate and the full transaction history is preserved for auditing.
