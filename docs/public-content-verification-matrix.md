# Public Content Verification Matrix

Audit date: 2026-07-24

Do not publish or enable any entry marked **No** or **Unverified**.

| Proposed Claim, Service, Feature, Route, or Image | Authoritative Source | Current Product Availability | Approved for Public Display | Implementation Destination | Legal, Clinical, or Asset Blocker |
| --- | --- | --- | --- | --- | --- |
| Plunge Care public information site | Existing merged public routes and AGENTS.md | Static information pages exist | Yes | `/`, `/services`, `/pricing`, `/for-providers`, `/faq` | Content must not imply unavailable transactional access |
| Online Care Requests | AGENTS.md sections 5, 9, and 10 describe the workflow rules | Start Care and request APIs are absent | No | Future `/start-care` and `/services` | Backend, authentication, clinical workflow, and content approval |
| Provider-Reviewed Laboratory Requests | AGENTS.md sections 4, 9, and 10 | Explanatory content exists; ordering is absent | Yes, explanatory only | `/services`, `/pricing`, `/faq` | Must state `No charge until provider review.` and must not imply ordering is live |
| Clear Follow-Through / request status visibility | AGENTS.md status vocabulary; current fixture UI | Production status API is absent | No | Future patient portal and public service copy | Backend workflow and authenticated patient access |
| Open-practice initial visit: `$65` flat | AGENTS.md section 4 | Approved display model; resolver client absent | Yes, explanatory only | `/pricing` | Must not be a checkout value or browser calculation |
| Direct/referred patient: provider consultation fee plus `$15` platform fee | AGENTS.md section 4 | Approved display model; provider fee source and resolver client absent | Yes, explanatory only | `/pricing` | Must not imply a currently selectable provider or calculate totals |
| Follow-up: provider fee plus `$14.99` | AGENTS.md section 4 | Approved display model; resolver client absent | Yes, explanatory only | `/pricing` | Must not calculate totals client-side |
| Laboratory orders have no charge until provider review | AGENTS.md sections 4 and 10 | Approved workflow rule; ordering absent | Yes, explanatory only | `/pricing`, `/services`, `/faq` | No estimated lab price or upfront checkout |
| Provider-controlled fee behavior | AGENTS.md sections 4 and 11 | Backend fee configuration and resolver are absent | Yes, high-level explanatory wording only | `/pricing`, `/for-providers` | Do not expose editable fees or transaction totals |
| Provider registration availability | No repository source confirms availability | Unavailable | No | Future provider authentication/onboarding route | Authentication, onboarding API, legal and credentialing review |
| Personal referral links | AGENTS.md section 6 explicitly prohibits unverified referral links | Unavailable / unverified | No | None | Product and compliance approval |
| Provider scheduling claims | AGENTS.md section 6 explicitly prohibits unverified scheduling claims | Unavailable / unverified | No | None | Scheduling backend and product approval |
| Provider availability toggle | AGENTS.md sections 11 and 13 identify it as future scope | Unavailable | No | None | Product and backend capability |
| State availability or state coverage | No state catalog or eligibility API is present | Unverified | No | Future state-selection step | Legal/clinical coverage approval and server-side license matching |
| Insurance participation or acceptance | No authoritative source in repository | Unverified | No | None | Payer contracting and legal approval |
| Prescription-request availability | AGENTS.md prohibits unverified prescription availability | Unverified | No | None | Clinical, legal, DEA, feature-flag, and backend approval |
| GLP-1 availability | AGENTS.md explicitly prohibits unverified GLP-1 availability | Unverified | No | None | Clinical, legal, product, and prescribing capability |
| Video Visits | AGENTS.md sections 6 and 13 exclude this scope | Unavailable | No | None | Explicitly out of scope |
| Provider earnings or payouts | AGENTS.md permits only backend-supplied Stripe aggregates | Unavailable | No | Future provider payment summary | Stripe aggregate API is absent |
| Captured payment summaries | AGENTS.md permits them only where backend-supported | Unavailable | No | Future provider portal | Stripe/payment API is absent |
| Patient registration | No authentication or registration implementation | Unavailable | No | Future registration route | Authentication, privacy, security, and legal approval |
| Patient Sign In | Current `/sign-in` accurately says access is being prepared | Unavailable | Yes, unavailable-state only | `/sign-in` | Auth, recovery, MFA, session, and role-routing backend |
| Start Care | Current `/start-care` accurately says secure access is being prepared | Unavailable | Yes, unavailable-state only | `/start-care` | All intake, state, matching, pricing, checkout, and request APIs |
| Lifestyle photography | No licensed photographic assets or rights records are present | Unverified | No | Future `PublicHeroVisual` | Asset license, model release, patient/privacy review, source attribution |
| Deployed section imagery | No production-site asset inventory or usage-rights record is present | Unverified | No | Future public sections | Asset provenance and usage rights |
| `src/assets/plunge-care-logo.png` | Existing repository brand asset | Present | Yes | Shared public and portal branding | Brand ownership is assumed from repository placement; formal brand approval is not recorded |
| Current CSS-built hero panels/cards | Existing merged UI; no external asset rights required | Present | Yes, as illustrative UI | Public page hero visuals | Must use fictional, non-PHI data and approved statuses only |

## Required Evidence Before Updating a No or Unverified Entry

- A product owner-approved capability statement
- A backend contract or deployed endpoint for operational features
- Legal and clinical approval where the claim affects care, prescribing, state coverage, or insurance
- A license record and model/property releases for each photographic asset
- A feature flag and safe unavailable state for capability-limited releases
- Security and authorization verification for authenticated routes
