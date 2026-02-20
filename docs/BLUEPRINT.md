# Gods of Insurance — Product Blueprint

**Version:** 1.0.0  
**Author:** angelreporters@gmail.com  
**Repository:** MIDNGHTSAPPHIRE/GodsofInsurance  
**Philosophy:** FOSS-first. Use free and open-source software wherever possible. Only pay for APIs that provide an irreplaceable competitive advantage — then build our own better version.

---

## Executive Summary

Gods of Insurance (operating brand: **ReinstatePro**) is a multi-vertical insurance lead generation and agent support platform. It disrupts the $40–$150/lead monopoly by generating exclusive leads from public records, provides a 24/7 AI phone agent that answers every call like a seasoned insurance professional, and offers agent motivation and wellness tools to reduce burnout in a notoriously brutal industry.

The platform serves two primary audiences:
1. **Insurance Agents** — lead generation, compliance automation, motivation tools, and AI-powered quote comparison.
2. **Customers** — instant quotes, state compliance guidance, multi-vertical coverage options, and 24/7 AI support.

---

## Core Verticals

| Vertical | Coverage Type | Target Customer |
|---|---|---|
| SR-22 / FR-44 | High-risk auto filing | DUI/DWI, license suspension |
| Burial / Final Expense | Life insurance | Seniors, families |
| Tiny / Mobile Home | Property | Non-traditional housing |
| Pet Insurance | Animal health | Exotic, therapy, rescue, foster, breeder |
| Gig Economy | Commercial auto | Rideshare, delivery drivers |

---

## Blue Ocean Features

### 1. Public Records Lead Generation Engine
The insurance lead industry is a monopoly. Agents pay $40–$150 per lead that gets sold to 5+ competitors simultaneously. Gods of Insurance disrupts this by generating **exclusive leads** from public records at zero cost:

- **Marriage licenses** — newlyweds need life, home, and auto insurance. Records are public in every county.
- **Home purchases** — new homeowners need home, flood, and umbrella coverage.
- **New business filings** — new LLCs need commercial liability, workers comp, and E&O.
- **Birth announcements** — new parents need life insurance and health riders.
- **Vehicle registrations** — new vehicle owners may need SR-22 if high-risk.

**Implementation:** Playwright-based scraper + cron job. FOSS. Zero ongoing cost.

### 2. AI Phone Agent — "Phone Answering Everything"
A 24/7 AI phone agent that answers every call like a seasoned insurance professional.

**FOSS Stack:**
- **Whisper** (OpenAI open-source) — speech-to-text transcription
- **Piper TTS** — neural text-to-speech, runs locally
- **Vocode** — open-source voice AI orchestration framework
- **Google Voice** — free business phone number
- **Twilio** (paid, optional) — SIP trunking for high volume

### 3. Agent Motivation & Wellness Module
Insurance agents face one of the highest burnout rates of any profession. This module provides:
- Daily AI-personalized affirmations based on mood check-in
- Commission goal tracker with visual progress
- Daily check-in journal (wins, challenges)
- Historical mood trend analysis

### 4. State Compliance Automation
- Auto-detect SR-22/FR-44 requirements by state
- Electronic filing simulation
- DMV notification tracking
- Filing fee calculator for all 50 states

### 5. AI Quote Comparison Engine
- Multi-carrier comparison using LLM
- Side-by-side coverage analysis
- Token economy for overage handling

---

## Technology Stack

### Frontend
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Wouter (routing)
- tRPC client
- Framer Motion (animations)
- Recharts (analytics)

### Backend
- Node.js + Express 4
- tRPC 11 (type-safe API)
- Drizzle ORM + MySQL/TiDB
- Manus OAuth (authentication)
- Stripe (billing)

### AI / ML
- Manus Built-in LLM (chat, affirmations, quote comparison)
- OpenAI Whisper (STT — self-hosted)
- Piper TTS (voice synthesis — self-hosted)
- Vocode (voice AI orchestration — open-source)

### Infrastructure
- Manus Platform (hosting, database, auth, storage)
- S3-compatible storage (file uploads)
- Playwright + cron (public records scraping)
- Google Voice / Twilio (phone routing)

---

## Accessibility

Five mandatory WCAG AAA accessibility modes:

| Mode | Description |
|---|---|
| ECO CODE | Low energy, reduced animations, power-saving colors |
| NEURO CODE | ADHD-friendly focus mode, reduced distractions |
| DYSLEXIC MODE | OpenDyslexic font, high contrast, increased spacing |
| NO BLUE LIGHT | Warm color filter, sepia tones, eye strain reduction |
| HIGH CONTRAST | Maximum contrast ratios for visual impairment |

---

## Revenue Model

### Subscription Tiers

| Tier | Price | Leads/mo | Tokens | Features |
|---|---|---|---|---|
| Small | $49/mo | 50 | 100 | Basic lead gen, AI chat |
| Medium | $149/mo | 200 | 500 | + Phone agent, compliance |
| Large | $399/mo | 500 | 2000 | + Analytics, priority support |
| Enterprise | Custom | Unlimited | Custom | White-label, API access |

### Token Economy
- Tokens power AI features (quote comparison, affirmations, phone summaries)
- Included with subscription; overage via token packs
- Token packs: 50 tokens ($9.99), 200 tokens ($29.99), 500 tokens ($59.99)

---

## Admin Capabilities

- Lead management (view, filter, search, export CSV)
- Status workflow: pending → quoted → contacted → converted → expired
- User management with role assignment
- Analytics dashboard (revenue, conversions, state performance)
- Support ticket management
- Scraper job monitoring
- Phone call log review

---

## Security & Compliance

- JWT session cookies (httpOnly, secure, sameSite=none)
- Stripe webhook signature verification
- Admin role-based access control
- No PII stored beyond what's necessary
- HTTPS enforced in production
- No raw card data ever stored (Stripe handles all payment data)
