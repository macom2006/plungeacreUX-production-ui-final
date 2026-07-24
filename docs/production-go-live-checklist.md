# Plunge Care Production Go-Live Checklist

Last reviewed: 2026-07-24

Current recommendation: **No-Go**

This checklist requires evidence, an accountable owner, and a completed status before the full
Plunge Care application can be released. Do not place secret values in this document, source
control, browser bundles, screenshots, or logs.

## Status Key

- **Complete**: Verified with durable evidence.
- **Blocked**: A required capability, credential, owner, or decision is missing.
- **Pending**: The capability exists but has not completed release validation.
- **Not Applicable**: Confirmed out of release scope with product approval.

## Environment Configuration

- [ ] **Blocked** — Production environment is identified and access is documented.
- [ ] **Blocked** — Staging environment is identified and isolated from production data.
- [ ] **Blocked** — Public application origin is configured for API and authentication allowlists.
- [ ] **Blocked** — Non-secret browser variables are documented in `.env.example`.
- [ ] **Blocked** — Production and staging values are injected by the deployment platform.
- [ ] **Complete** — Development fixtures are excluded from the production bundle by
  `npm run verify:production-build`.
- [ ] **Complete** — Sora and Inter are locally bundled at approved weights.

Evidence required: environment inventory, deployment-platform configuration record, and a
successful staging build.

## Secrets

- [ ] **Blocked** — Secret manager and access policy are approved.
- [ ] **Blocked** — Supabase service-role credentials are stored server-side only.
- [ ] **Blocked** — Stripe secret and webhook-signing keys are stored server-side only.
- [ ] **Blocked** — Email provider credentials are stored server-side only.
- [ ] **Blocked** — Monitoring credentials are configured without exposing privileged values.
- [ ] **Blocked** — Secret rotation procedure and owner are documented.
- [ ] **Blocked** — Repository history has completed secret scanning.

Never expose service-role keys, Stripe secret keys, webhook secrets, or privileged API tokens as
`VITE_*` values.

## Domain and SSL

- [ ] **Blocked** — Production domain is approved.
- [ ] **Blocked** — DNS ownership and change access are confirmed.
- [ ] **Blocked** — TLS certificate is active and auto-renewal is verified.
- [ ] **Blocked** — HTTP redirects to HTTPS.
- [ ] **Blocked** — Canonical origin, authentication redirects, and CORS use the production domain.
- [ ] **Blocked** — Security headers are verified on the deployed response.

Evidence required: DNS record, certificate status, redirect test, and response-header capture.

## Supabase Production Project

- [ ] **Blocked** — Production Supabase project is identified.
- [ ] **Blocked** — Project URL and anonymous key are available to the browser deployment.
- [ ] **Blocked** — Service-role access is restricted to trusted server functions.
- [ ] **Blocked** — Authentication providers and redirect URLs are configured.
- [ ] **Blocked** — MFA enrollment and challenge policies are configured and tested.
- [ ] **Blocked** — Password recovery is configured and tested.
- [ ] **Blocked** — Production data retention and regional requirements are approved.

No Supabase dependency or client configuration currently exists in this repository.

## Database Migrations

- [ ] **Blocked** — Authoritative migration repository and production baseline are identified.
- [ ] **Blocked** — Pending migrations are reviewed for destructive operations.
- [ ] **Blocked** — Migrations have been applied to staging.
- [ ] **Blocked** — Migration verification queries pass.
- [ ] **Blocked** — Production migration window and operator are assigned.
- [ ] **Blocked** — Rollback or forward-fix plan is reviewed.

Do not run a destructive production migration from this UI repository.

## Row-Level Security and Authorization

- [ ] **Blocked** — Patient ownership policies are tested with positive and negative cases.
- [ ] **Blocked** — Provider assignment and state-license eligibility policies are tested.
- [ ] **Blocked** — Admin access is enforced server-side.
- [ ] **Blocked** — Provider approval and license-verification mutations require authorized roles.
- [ ] **Blocked** — My Chart reads only from release-gated APIs or views.
- [ ] **Blocked** — Released laboratory results cannot expose unreleased records.
- [ ] **Blocked** — Route hiding is not the sole authorization control.

The current repository has no authenticated session or server-enforced authorization.

## Edge Functions and APIs

- [ ] **Blocked** — Required edge functions and API contracts are inventoried.
- [ ] **Blocked** — Authentication is validated server-side for every protected function.
- [ ] **Blocked** — Request validation, rate limits, idempotency, and error contracts are tested.
- [ ] **Blocked** — Pricing preview uses the authoritative server resolver.
- [ ] **Blocked** — Care-request state transitions are enforced server-side.
- [ ] **Blocked** — Provider matching requires state selection and license eligibility.
- [ ] **Blocked** — API deployment version and rollback procedure are recorded.

## Stripe Production Configuration

- [ ] **Blocked** — Production Stripe account is approved and access is limited.
- [ ] **Blocked** — Server pricing resolver is the only transaction amount source.
- [ ] **Blocked** — Publishable key is configured for the approved production origin.
- [ ] **Blocked** — Checkout or Payment Element flow is integrated.
- [ ] **Blocked** — Payment failure and retry behavior are tested.
- [ ] **Blocked** — Idempotency and duplicate-submission protection are tested.
- [ ] **Blocked** — Laboratory requests bypass upfront payment.
- [ ] **Blocked** — Captured-payment summaries come from Stripe-backed server data.

No Stripe dependency or payment API currently exists in this repository.

## Webhooks

- [ ] **Blocked** — Production webhook endpoints are deployed over HTTPS.
- [ ] **Blocked** — Signature verification is mandatory.
- [ ] **Blocked** — Event replay and duplicate delivery are handled idempotently.
- [ ] **Blocked** — Failed webhook delivery is monitored and retryable.
- [ ] **Blocked** — Payment and invoice state transitions are reconciled.
- [ ] **Blocked** — Webhook secret rotation procedure is documented.

## Email Delivery

- [ ] **Blocked** — Transactional email provider is approved.
- [ ] **Blocked** — Sending domain, SPF, DKIM, and DMARC are configured.
- [ ] **Blocked** — Password recovery delivery is tested.
- [ ] **Blocked** — Patient and provider notification templates are clinically and legally reviewed.
- [ ] **Blocked** — Messages contain no unnecessary PHI.
- [ ] **Blocked** — Bounce, complaint, and suppression handling is monitored.

## Error Monitoring and Logging

- [ ] **Blocked** — Browser error monitoring is configured.
- [ ] **Blocked** — Server and edge-function error monitoring is configured.
- [ ] **Blocked** — Release identifiers and source maps are managed securely.
- [ ] **Blocked** — Logs exclude PHI, credentials, tokens, and payment details.
- [ ] **Blocked** — Alert thresholds and escalation routes are documented.
- [ ] **Blocked** — Log retention and access are approved.

## Backup and Rollback

- [ ] **Blocked** — Database backup schedule and restore test are verified.
- [ ] **Blocked** — Point-in-time recovery capability is verified.
- [ ] **Blocked** — Previous frontend artifact can be redeployed without rebuilding.
- [ ] **Blocked** — Edge functions can be rolled back independently.
- [ ] **Blocked** — Feature flags can disable incomplete workflows without a new deployment.
- [ ] **Blocked** — Rollback decision maker is assigned.

Rollback sequence:

1. Disable affected feature flags.
2. Stop new consequential mutations if data integrity is at risk.
3. Redeploy the last verified frontend and edge-function versions.
4. Reconcile queued webhooks and payment events.
5. Restore data only under the approved database recovery procedure.
6. Run the production smoke test and record the incident timeline.

## Health Check

- [ ] **Blocked** — Public health endpoint or platform health signal exists.
- [ ] **Blocked** — Health check covers frontend delivery and critical API dependencies.
- [ ] **Blocked** — Health checks never expose secrets or sensitive system detail.
- [ ] **Blocked** — External uptime monitoring is configured.

## Staging Smoke Test

- [ ] **Blocked** — Staging deployment exists.
- [ ] **Pending** — Public homepage, services, pricing, providers, FAQ, and unavailable-state routes load.
- [ ] **Blocked** — Patient sign-in, recovery, MFA, state selection, intake, matching, checkout, and confirmation pass.
- [ ] **Blocked** — Patient care request, messages, chart, billing, and settings pass with authorized test accounts.
- [ ] **Blocked** — Provider queue, review, roster, onboarding, and payment summaries pass.
- [ ] **Blocked** — Admin provider review and permission-denied cases pass.
- [ ] **Blocked** — Payment failure and lab-without-upfront-charge journeys pass.
- [ ] **Blocked** — Mobile navigation and 200% reflow pass on the deployed build.
- [ ] **Blocked** — No console errors or failed production network requests remain.

Use fictional test identities and non-production payment methods. Do not use real patient data.

## Feature Flags and Disabled Routes

- [x] **Complete** — Foundation previews render only in development builds.
- [x] **Complete** — Fixture-backed patient portal routes render only in development builds.
- [x] **Complete** — Sign In presents an honest unavailable state.
- [x] **Complete** — Start Care presents an honest unavailable state.
- [ ] **Blocked** — Server-backed feature-flag service is available.
- [ ] **Blocked** — Provider routes are implemented and gated.
- [ ] **Blocked** — Admin routes are implemented and gated.
- [ ] **Blocked** — Feature flags cannot bypass server authorization.

Unfinished routes must not appear in production navigation.

## Support and Incident Ownership

- [ ] **Blocked** — Public support contact is approved and published.
- [ ] **Blocked** — Clinical escalation contact is assigned.
- [ ] **Blocked** — Payment support contact is assigned.
- [ ] **Blocked** — Privacy/security contact is assigned.
- [ ] **Blocked** — Primary incident owner is assigned.
- [ ] **Blocked** — Backup incident owner is assigned.
- [ ] **Blocked** — On-call schedule and escalation policy are documented.
- [ ] **Blocked** — Status-page communication owner is assigned.

No contact names or addresses are entered because the repository does not provide an authoritative
source.

## Final Release Sign-Off

- [ ] Product owner
- [ ] Clinical owner
- [ ] Security/privacy owner
- [ ] Engineering owner
- [ ] Operations/incident owner
- [ ] Legal/content owner
- [ ] Payment owner

The full release remains **No-Go** until all production blockers in
`docs/production-readiness-inventory.md` are resolved and this checklist has durable evidence.
