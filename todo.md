# Gods of Insurance — TODO

## Landing Page (drive-easy-insure enhanced)
- [x] Hero section with ReinstatePro branding
- [x] Header with navigation and auth buttons
- [x] QuoteWizard multi-step form
- [x] CoverageTypes (SR-22, FR-44, Non-Owner)
- [x] StateCompliance (CA, CO, NC)
- [x] HowItWorks section
- [x] TrustSection social proof
- [x] FAQ accordion
- [x] Footer with ReinstatePro branding
- [x] CTA section
- [x] VerticalsShowcase section

## Multi-Vertical Insurance Pages
- [x] Insurance verticals hub page
- [x] SR-22/FR-44 High-Risk Auto vertical
- [x] Burial/Final Expense vertical
- [x] Tiny/Mobile Home vertical
- [x] Pet Insurance vertical (foster, rescue, exotic, therapy, breeder)
- [x] Gig Economy vertical (rideshare, delivery)

## Coverage Detail Pages
- [x] SR-22 coverage detail page with tabs
- [x] FR-44 coverage detail page
- [x] Non-Owner SR-22 coverage detail page

## Authentication
- [x] Manus OAuth integration (built-in)
- [x] Admin role auto-assignment for angelreporters@gmail.com (via OWNER_OPEN_ID)
- [x] Protected routes for dashboard/admin
- [x] Admin guard middleware (adminProcedure)

## Admin Dashboard
- [x] Lead management with filters
- [x] Status updates (pending/quoted/contacted/converted/expired)
- [x] Search and filter by state/type/status
- [x] Lead export functionality (CSV)
- [x] Analytics overview cards
- [x] Leads by vertical analytics
- [x] Leads by state analytics
- [x] User management tab

## Stripe Billing
- [x] Subscription tiers (Small/Medium/Large/Enterprise) — DB schema
- [x] Token economy for overage — DB schema + endpoints
- [x] Freemium trial flow — DB schema
- [ ] Stripe payment integration (requires webdev_add_feature)

## Accessibility Modes
- [x] WCAG AAA compliance base
- [x] ECO CODE mode (low energy, reduced animations)
- [x] NEURO CODE mode (ADHD-friendly, focus mode)
- [x] DYSLEXIC MODE (OpenDyslexic font, high contrast)
- [x] NO BLUE LIGHT mode (warm color filter)
- [x] Accessibility settings panel (floating button)
- [x] Font size adjustment

## State Compliance Engine
- [x] State requirements database (20 states with data)
- [x] Auto-detect requirements by state
- [x] Filing fee calculator
- [x] State compliance search and filter UI
- [x] Electronic filing status indicator

## AI Quote Comparison
- [x] Multi-carrier comparison via LLM
- [x] Quote generation endpoint (tRPC)
- [x] Side-by-side coverage analysis UI
- [x] Token deduction per comparison

## Customer Service
- [x] Subscription management UI (dashboard)
- [ ] Payment failure handling (dunning emails — requires Stripe)
- [ ] Refund/cancellation workflows (requires Stripe)

## Analytics Dashboard
- [x] Lead conversion tracking
- [x] Revenue metrics estimate
- [x] State-by-state performance
- [x] Leads by vertical analytics

## Database Schema
- [x] Quote submissions table
- [x] Insurance verticals table
- [x] Subscription/billing tables
- [x] Token ledger table
- [x] State compliance data table
- [x] Analytics events table

## Tests
- [x] Auth tests (me, logout)
- [x] Quote submission validation tests
- [x] Admin access control tests
- [x] Protected route tests
- [x] Billing input validation tests
- [x] Compliance input validation tests
- [x] AI chat tests (8 tests)
- [x] All 31 tests passing
- [x] Zero TypeScript errors
- [x] Dev server running and healthy

## Deployment
- [ ] Push to MIDNGHTSAPPHIRE/GodsofInsurance on GitHub
- [ ] Deploy live via Manus
- [ ] Add to meetaudreyevans.com hub

## AI Assistant — "Phone Answering Everything" (Blue Ocean Feature)
- [x] AI Chat Assistant component (built into app, helps customers)
- [x] Chat UI with message history and streaming responses
- [x] AI chat backend tRPC procedure with LLM integration
- [x] 8 comprehensive tests for AI chat functionality
- [ ] AI Phone Agent backend (Vocode orchestration) — FUTURE
- [ ] Whisper STT integration for phone calls — FUTURE
- [ ] Piper TTS integration for voice responses — FUTURE
- [ ] Phone routing logic (detect vertical, route to appropriate agent) — FUTURE
- [ ] Consultation booking via phone agent — FUTURE
- [ ] Call recording and transcription storage — FUTURE
- [ ] Phone agent analytics (calls handled, conversion rate, avg duration) — FUTURE
- [ ] Integration with quote submission system — FUTURE

## Design & Branding
- [x] Zeus/Greek mythology theme (dark navy + Olympic gold + marble)
- [x] Zeus splash screen as hero background
- [x] Zeus medallion logo
- [x] Cinzel serif display font (Greek/Roman aesthetic)
- [x] Gold gradient color palette
- [x] Accessibility panel with 5 WCAG AAA modes

## Lead Generation Engine (Blue Ocean Feature)
- [x] publicLeads database table (public records)
- [x] Lead Gen Engine page (/lead-gen) — admin only
- [x] Manual lead seeding form
- [x] AI bulk extraction from raw public record data
- [x] Lead status management (new/contacted/qualified/converted/dead)
- [x] Source type mapping (marriage_license, home_purchase, business_filing, birth_record, divorce_record, vehicle_registration)
- [x] FOSS-first philosophy documented in UI
- [x] 12 lead gen tests passing

## Tests (Updated)
- [x] Auth tests (1)
- [x] Router tests (22)
- [x] AI chat tests (8)
- [x] Lead gen tests (12)
- [x] All 43 tests passing
- [x] Zero TypeScript errors
- [x] Dev server running and healthy

## Deployment
- [ ] Push to MIDNGHTSAPPHIRE/GodsofInsurance on GitHub
- [ ] Deploy live via Manus
- [ ] Add to meetaudreyevans.com hub

## New Pages (Sprint 2 — February 2026)
- [x] Pricing page with Stripe checkout (/pricing)
- [x] Agent Motivation page with daily affirmations and goals (/agent)
- [x] Support Tickets page for customers and agents (/support)
- [x] AI Phone Agent page with call logs and tech stack (/phone)

## Documentation (/docs)
- [x] BLUEPRINT.md — product blueprint and FOSS philosophy
- [x] ROADMAP.md — 4-phase product roadmap
- [x] DATA_SCHEMA.md — all 13 tables documented
- [x] API_DOCS.md — all tRPC procedures documented
- [x] PATENT_DISCLOSURE.md — 3 invention disclosures
- [x] KANBAN.md — full sprint board with 52+ completed cards

## Stripe Billing (Sprint 2)
- [x] Stripe feature added via webdev_add_feature
- [x] Stripe products.ts with all tier price IDs
- [x] Stripe webhook handler at /api/stripe/webhook
- [x] Checkout session creation for subscriptions and token packs
- [x] Subscription activation on checkout.session.completed
- [x] Token credit on token pack purchase
- [ ] Claim Stripe sandbox at dashboard.stripe.com (user action required)
- [ ] Test with card 4242 4242 4242 4242 (user action required)

## Agent Support Features
- [x] Agent Motivation module (daily affirmations, mood check-in)
- [x] Commission goal tracker with visual progress
- [x] Daily check-in journal (wins, challenges)
- [x] AI-personalized affirmations based on mood
- [x] Check-in history with mood trends
- [x] agentGoals table in database
- [x] agentCheckIns table in database

## Support Tickets
- [x] Support ticket creation (authenticated + guest)
- [x] Ticket categories (billing, quote, technical, compliance, general)
- [x] Priority levels (low, normal, high, urgent)
- [x] Reply threading
- [x] Ticket status workflow (open, in_progress, waiting, resolved, closed)
- [x] supportTickets table in database
- [x] supportReplies table in database

## Phone Agent Infrastructure
- [x] phoneCallLogs table in database
- [x] phone.logs tRPC procedure (admin)
- [x] phone.logCall tRPC procedure (webhook endpoint)
- [x] AI Phone Agent page with FOSS stack documentation
- [ ] Vocode deployment (Phase 2)
- [ ] Whisper STT deployment (Phase 2)
- [ ] Piper TTS deployment (Phase 2)
