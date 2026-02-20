# Gods of Insurance — API Documentation

**Protocol:** tRPC 11 over HTTP  
**Base URL:** `/api/trpc`  
**Authentication:** JWT session cookie (`goi_session`)  
**Transport:** JSON with SuperJSON serialization

---

## Authentication

All requests use the Manus OAuth flow. The session cookie is set automatically after login.

### `auth.me`
Returns the currently authenticated user or `null`.

**Access:** Public  
**Returns:** `User | null`

```ts
const { data: user } = trpc.auth.me.useQuery();
```

### `auth.logout`
Clears the session cookie and logs the user out.

**Access:** Public  
**Returns:** `{ success: true }`

---

## Quotes

### `quotes.submit`
Submit a new insurance quote request.

**Access:** Public  
**Input:**
```ts
{
  vertical: "sr22" | "fr44" | "non_owner" | "burial" | "tiny_home" | "pet" | "gig";
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  state: string;        // 2-letter state code
  coverageType?: string;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  violations?: string[];
}
```
**Returns:** `{ success: true; quoteId: number; estimatedPremium: number }`

### `quotes.myQuotes`
Get all quote submissions for the authenticated user.

**Access:** Protected  
**Returns:** `QuoteSubmission[]`

---

## Admin

### `admin.getLeads`
Get all quote submissions with optional filtering.

**Access:** Admin only  
**Input:**
```ts
{
  status?: "pending" | "quoted" | "contacted" | "converted" | "expired";
  state?: string;
  vertical?: string;
  limit?: number;   // default 50
  offset?: number;  // default 0
}
```
**Returns:** `{ leads: QuoteSubmission[]; total: number }`

### `admin.updateLeadStatus`
Update the status of a quote submission.

**Access:** Admin only  
**Input:** `{ id: number; status: LeadStatus; notes?: string }`  
**Returns:** `{ success: true }`

### `admin.getAnalytics`
Get platform analytics.

**Access:** Admin only  
**Returns:**
```ts
{
  totalLeads: number;
  conversionRate: number;
  totalRevenue: number;
  leadsByState: { state: string; count: number }[];
  leadsByVertical: { vertical: string; count: number }[];
  recentActivity: QuoteSubmission[];
}
```

---

## Billing

### `billing.getPlans`
Get all available subscription plans.

**Access:** Public  
**Returns:** `Plan[]` with Stripe price IDs and features

### `billing.mySubscription`
Get the authenticated user's active subscription.

**Access:** Protected  
**Returns:** `Subscription | null`

### `billing.tokenBalance`
Get the authenticated user's current token balance.

**Access:** Protected  
**Returns:** `{ balance: number }`

### `billing.createCheckout`
Create a Stripe checkout session.

**Access:** Protected  
**Input:** `{ priceId: string; origin: string }`  
**Returns:** `{ url: string }` — redirect to Stripe checkout

### `billing.purchaseTokens`
Purchase additional tokens.

**Access:** Protected  
**Input:** `{ pack: "small" | "medium" | "large"; origin: string }`  
**Returns:** `{ url: string }` — redirect to Stripe checkout

---

## AI

### `ai.chat`
Send a message to the AI insurance assistant.

**Access:** Public  
**Input:**
```ts
{
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}
```
**Returns:** `{ reply: string; tokensUsed: number }`

### `ai.compareQuotes`
Get AI-powered multi-carrier quote comparison.

**Access:** Protected (requires tokens)  
**Input:**
```ts
{
  vertical: string;
  state: string;
  coverageType: string;
  driverAge?: number;
  violations?: string[];
}
```
**Returns:**
```ts
{
  carriers: {
    name: string;
    monthlyPremium: number;
    annualPremium: number;
    coverageHighlights: string[];
    pros: string[];
    cons: string[];
    rating: number;
    filingFee?: number;
  }[];
  recommendation: string;
  tokensUsed: number;
}
```

---

## Lead Generation

### `leadGen.getLeads`
Get all public record leads.

**Access:** Admin only  
**Input:** `{ status?: LeadStatus; sourceType?: string; limit?: number; offset?: number }`  
**Returns:** `{ leads: PublicLead[]; total: number }`

### `leadGen.addLead`
Manually add a lead from public records.

**Access:** Admin only  
**Input:**
```ts
{
  sourceType: "marriage_license" | "home_purchase" | "business_filing" | "birth_record" | "divorce_record" | "vehicle_registration";
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  state: string;
  county?: string;
  eventDate?: string;
  notes?: string;
}
```
**Returns:** `{ success: true; leadId: number }`

### `leadGen.extractLeads`
Use AI to extract multiple leads from raw public record data.

**Access:** Admin only  
**Input:** `{ rawText: string; sourceType: string; state: string }`  
**Returns:** `{ leads: ExtractedLead[]; count: number }`

### `leadGen.updateLeadStatus`
Update a lead's status.

**Access:** Admin only  
**Input:** `{ id: number; status: LeadStatus; notes?: string }`  
**Returns:** `{ success: true }`

---

## Agent Motivation

### `agent.getAffirmation`
Get a daily affirmation (AI-personalized if mood provided).

**Access:** Protected  
**Input:** `{ mood?: string }`  
**Returns:** `{ affirmation: string; source: "ai" | "static" }`

### `agent.checkIn`
Submit a daily check-in.

**Access:** Protected  
**Input:** `{ mood: MoodType; wins?: string; challenges?: string; affirmationSeen?: string }`  
**Returns:** `{ success: true }`

### `agent.getGoals`
Get the authenticated agent's goals.

**Access:** Protected  
**Returns:** `AgentGoal[]`

### `agent.createGoal`
Create a new agent goal.

**Access:** Protected  
**Input:** `{ title: string; targetAmount?: number; targetDate?: string }`  
**Returns:** `{ success: true; goalId: number }`

### `agent.updateGoalProgress`
Update progress on a goal.

**Access:** Protected  
**Input:** `{ id: number; currentAmount: number }`  
**Returns:** `{ success: true }`

---

## Support

### `support.createTicket`
Create a new support ticket.

**Access:** Public  
**Input:**
```ts
{
  subject: string;
  body: string;
  category: "billing" | "quote" | "technical" | "compliance" | "general";
  priority?: "low" | "normal" | "high" | "urgent";
  guestEmail?: string;  // required if not authenticated
}
```
**Returns:** `{ success: true; ticketId: number }`

### `support.myTickets`
Get all tickets for the authenticated user.

**Access:** Protected  
**Returns:** `SupportTicket[]`

### `support.getTicket`
Get a specific ticket with replies.

**Access:** Protected  
**Input:** `{ id: number }`  
**Returns:** `{ ticket: SupportTicket; replies: SupportReply[] }`

### `support.replyToTicket`
Add a reply to a ticket.

**Access:** Protected  
**Input:** `{ ticketId: number; body: string }`  
**Returns:** `{ success: true }`

---

## Phone

### `phone.logs`
Get all phone call logs.

**Access:** Admin only  
**Returns:** `PhoneCallLog[]`

### `phone.logCall`
Log a completed phone call (called by the Vocode webhook).

**Access:** Public (webhook)  
**Input:**
```ts
{
  callSid?: string;
  callerNumber?: string;
  detectedVertical?: string;
  transcription?: string;
  summary?: string;
  outcome?: "quoted" | "transferred" | "callback_scheduled" | "no_action" | "voicemail";
  durationSeconds?: number;
}
```
**Returns:** `{ success: true }`

---

## Compliance

### `compliance.getStateData`
Get SR-22/FR-44 compliance data for a state.

**Access:** Public  
**Input:** `{ state: string }`  
**Returns:** `StateComplianceData | null`

### `compliance.getAllStates`
Get compliance data for all states.

**Access:** Public  
**Returns:** `StateComplianceData[]`

---

## Webhooks

### `POST /api/stripe/webhook`
Stripe webhook endpoint. Handles:
- `checkout.session.completed` — activate subscription or credit tokens
- `customer.subscription.updated` — sync subscription status
- `customer.subscription.deleted` — cancel subscription
- `invoice.payment_failed` — mark subscription as past_due

**Authentication:** Stripe webhook signature verification  
**Content-Type:** `application/json` (raw body required)
