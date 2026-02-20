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
- [x] All 23 tests passing

## Deployment
- [ ] Push to MIDNGHTSAPPHIRE/GodsofInsurance on GitHub
- [ ] Deploy live via Manus
