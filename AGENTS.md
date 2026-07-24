# Plunge Care Production UI — Codex Implementation Rules

## 1. Repository architecture

This is a single Lovable-managed application.

Use this structure:

- `src/styles/tokens.css` — semantic CSS variables
- `src/components/ui/` — primitives such as button, input, badge, tabs, switch, drawer, dialog, filter bar, pagination
- `src/components/healthcare/` — care-request card, care timeline, provider profile card, billing summary, patient context
- `src/components/layout/` — public navigation, portal shell, sidebar, topbar

Do not restructure this repository into a monorepo. Lovable retains publishing responsibility. Codex works through branches and pull requests against this structure.

## 2. Source of truth

The approved Figma file is the UI source of truth:

https://www.figma.com/design/mQ5rcnzfDLUUg298bYvZJi

Key sections:

- Patient Portal: node `180:2`
- Provider Portal: node `183:2`
- Admin Portal: node `188:2`
- Final QA and Codex Handoff: node `198:2`

Do not invent new visual patterns when an approved pattern exists in Figma.

## 3. Brand rules

- Deep Navy `#051E4F` is reserved primarily for the logo and brand wordmark.
- Primary Blue `#0B3A75` is used for primary actions.
- Action Blue `#0F5DA8` is used for links and interaction states.
- Clinical Green is reserved for success and clinically safe states.
- Amber is used for pending, warning, review, and payment-required states.
- Red is reserved for declined, failed, destructive, and critical states.
- Public-facing pages retain the current production site's photographic identity, floating UI notification cards, water-drop motif, and deployed section imagery. Re-token the imagery; do not strip it.

## 4. Pricing and money

All fee and total amounts are supplied by the server pricing resolver through `_shared/pricing.ts` and `pricing-preview`.

Never compute, derive, or hardcode monetary amounts client-side. Design amounts are illustrative only.

Locked pricing model:

- Open-practice initial visit: `$65` flat
- Direct or referred patient: provider consultation fee plus `$15` platform fee
- Follow-up: provider follow-up fee plus `$14.99`
- Laboratory orders: no charge at request; invoice after provider review

## 5. Status vocabulary

Bind UI badges and timelines to existing platform states. Do not create parallel status vocabularies.

- Submitted — request created
- Pending review — awaiting provider
- Payment required — invoice issued or authorization pending
- Approved — provider approved
- Declined — provider declined
- Payment failed — capture or authorization failure

Payment required is amber, never red.

## 6. Responsive contract

Support these viewport classes:

- Desktop: 1440px and above
- Laptop: 1280px
- Tablet landscape: 1024px
- Tablet portrait: 768px
- Mobile: 390px reference master

Rules:

- Public pages collapse two-column hero layouts into a single-column stack.
- Portal sidebars become mobile drawers.
- Tables collapse into labeled cards only when horizontal scrolling would impair usability.
- Primary actions remain visible and reachable without horizontal scrolling.
- Clinical and billing workflows must preserve information order on mobile.
- Use the approved mobile masters for Patient Dashboard and Start Care checkout.

## 7. Accessibility contract

All work must meet WCAG 2.2 AA.

Required:

- Keyboard-complete navigation
- Visible focus indicators
- Logical focus order
- Semantic landmarks and headings
- Programmatic form labels
- Error summaries and field-level errors
- Live-region announcements for asynchronous status changes
- Accessible dialogs, drawers, tabs, tables, pagination, and menus
- Minimum 44 by 44 pixel touch targets
- 200 percent zoom and reflow support
- Reduced-motion support
- Status meaning must never depend on color alone
- Destructive actions require explicit confirmation

## 8. State coverage

Every route must support:

- Loading
- Empty
- Error
- Permission denied where applicable
- Partial or stale data where applicable
- Success and saved confirmation where applicable

Use the generic empty-state, skeleton, and alert patterns defined in Figma rather than creating route-specific visual systems.

## 9. Clinical workflow rules

- State selection in Start Care is mandatory and gates license-eligible provider matching.
- Do not reorder or skip the state step.
- Patient Review and Prescription Review are children of a Care Queue item.
- Provider Patients is a longitudinal roster, not a duplicate review entry point.
- Clinical decisions occur on full record pages, never inside drawers.
- Drawers are for context and filters only.
- My Chart must read through existing release-gated views and APIs, not directly from database tables.
- Recent Results only displays released lab results.

## 10. Laboratory flow

Lab requests have no upfront payment step.

Required timeline:

1. Request submitted
2. Provider review
3. Invoice issued
4. Accepted and paid
5. Results released

Before provider review, show: `No charge until provider review.`

Do not show estimated lab pricing. Do not include laboratory orders as a line item inside consultation checkout summaries.

## 11. Provider onboarding and gating

Provider onboarding includes:

1. Profile
2. Per-state licenses with pending, verified, rejected, and expired states
3. Fees
4. W-9

Approval and license gating are enforced server-side. The UI only reflects existing `is_approved` and per-state license status values.

DEA is conditional and must be feature-flagged or omitted until product approval.

A provider-controlled availability toggle is future scope. Do not fabricate this capability.

## 12. Admin rules

The admin experience extends the provider shell and approved components.

Use:

- Table-first layouts
- Filter Bar
- Pagination
- Data Table Row
- Drawer for context
- Confirmation Dialog for approval and destructive actions

Provider approval and license-verification actions require explicit confirmation dialogs that state the consequence.

## 13. Future scope

Video Visits are excluded from the current implementation phases. Do not add Video Visits to active navigation or build video infrastructure.

Provider Earnings may only expose Stripe payout aggregates if the backend currently supplies them. Otherwise, ship captured-payment summaries only.

## 14. Authentication

Login, registration, MFA enrollment, MFA challenge, and password recovery are token-restyle only.

Keep current structure, flow, security logic, and MFA gating behavior unchanged.

## 15. Testing and acceptance

Before marking any phase complete:

- Run type checking
- Run linting
- Run unit and integration tests
- Run Playwright tests for the affected journeys
- Validate desktop, tablet, and mobile layouts
- Validate keyboard navigation and focus behavior
- Validate loading, empty, error, and success states
- Confirm no client-side pricing calculations were introduced
- Confirm no direct reads bypass release-gated APIs or views
- Compare implementation screenshots against the approved Figma masters

## 16. Pull request workflow

- Work on a dedicated branch.
- Keep pull requests phase-scoped.
- Do not mix unrelated refactors with UI implementation.
- Describe changed routes, components, APIs used, states covered, and tests run.
- Note any backend dependency or unavailable data explicitly.
- Do not claim completion when placeholders, hardcoded data, or unimplemented states remain.
