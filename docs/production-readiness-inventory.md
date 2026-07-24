# Plunge Care Production Readiness Inventory

Audit date: 2026-07-24

Release branch: `release/production-readiness`

Baseline commit: `952cfed` (`main`, including merged Phase 4 patient portal UI)

## Classification

- **Fully Connected**: The route or capability uses its intended production data source and is suitable for release.
- **UI Connected but Backend Incomplete**: A UI exists, but a required production service, authorization check, or mutation is absent.
- **Missing**: The capability does not exist in this repository.
- **Feature-Gated**: The capability must remain unavailable in production until its dependency is connected.
- **Production Blocker**: The missing capability prevents a safe production release of the affected workflow.

## Executive Summary

This repository is a single Vite React application. It currently contains a production-quality
component foundation, static public marketing routes, development preview routes, and a patient
portal UI backed entirely by fictional fixtures.

The repository does not contain a Supabase client, Supabase functions or views, authentication,
server-enforced role authorization, a pricing resolver client, Stripe, messaging, laboratory,
provider onboarding, monitoring, or a production deployment target. Patient, provider, admin,
Start Care, checkout, and authenticated account workflows cannot be declared production-ready
without those capabilities.

## Route Inventory

| Area | Route | Current Implementation | Classification | Release Requirement |
| --- | --- | --- | --- | --- |
| Public | `/` | Static public homepage | Fully Connected | Keep claims limited to verified content |
| Public | `/services` | Static services overview | Fully Connected | Keep operational availability claims gated |
| Public | `/pricing` | Static explanation of the AGENTS.md pricing model | Fully Connected | Display only; no browser-side calculations |
| Public | `/for-providers` | Static provider marketplace overview | Fully Connected | Do not imply registration or scheduling availability |
| Public | `/faq` | Static categorized FAQ | Fully Connected | Keep answers within verified product behavior |
| Access | `/sign-in` | Temporary access-unavailable page | Feature-Gated | Authentication, recovery, MFA, and role routing |
| Start Care | `/start-care` | Temporary access-unavailable page | Production Blocker | Authenticated intake, state gating, matching, pricing, checkout, and confirmation APIs |
| Patient | `/patient` | Dashboard rendered from `patientFixtures.ts` | UI Connected but Backend Incomplete | Authenticated patient session and dashboard API |
| Patient | `/patient/care-requests` | Searchable fixture list | UI Connected but Backend Incomplete | Care-request API with patient authorization |
| Patient | `/patient/care-requests/:id` | Fixture detail and timeline | UI Connected but Backend Incomplete | Authorized request-detail API |
| Patient | `/patient/messages` | Fixture conversation preview | UI Connected but Backend Incomplete | Messaging API and access controls |
| Patient | `/patient/my-chart` | Fixture chart and released-result filtering | UI Connected but Backend Incomplete | Release-gated chart/results API or view |
| Patient | `/patient/billing` | Fixture billing summaries | UI Connected but Backend Incomplete | Server pricing, invoice, and payment APIs |
| Patient | `/patient/settings` | Local presentation state | UI Connected but Backend Incomplete | Account/profile preferences API |
| Provider | All required provider routes | No route implementations | Missing | Provider session, queue, roster, messaging, license, fee, W-9, and payment-summary APIs |
| Admin | All required admin routes | No route implementations | Missing | Server-enforced admin authorization and oversight APIs |
| Development | `/foundation` | Foundation preview | Fully Connected | Development-only/noindex |
| Development | `/foundation/components` | Component showcase | Fully Connected | Development-only/noindex |
| Development | `/foundation/portal` | Portal shell preview | Fully Connected | Development-only/noindex |

## Authentication and Registration

| Capability | Evidence | Classification | Notes |
| --- | --- | --- | --- |
| Sign in | `/sign-in` renders `TemporaryAccessPage` | Production Blocker | No authentication SDK or API |
| Patient registration | No route or integration | Missing | Must not be advertised as available |
| Provider registration | No route or integration | Missing | Must not be advertised as available |
| Password recovery | No route or integration | Missing | Required before authenticated release |
| MFA enrollment | No route or integration | Missing | AGENTS.md requires existing security behavior to be preserved, but none is present in this repository |
| MFA challenge | No route or integration | Missing | Required for any MFA-gated role |
| Session management | No auth client or session provider | Production Blocker | Patient routes currently have no session boundary |
| Role routing | UI shell accepts a role prop only | Production Blocker | A presentation prop is not authorization |

## Start Care Workflow

| Step | Current Status | Classification | Missing Dependency |
| --- | --- | --- | --- |
| State selection | Not implemented | Production Blocker | State catalog and server-side license eligibility |
| Care category | Not implemented | Missing | Verified category source |
| Patient intake | Not implemented | Missing | Secure intake schema and API |
| Questionnaires | Not implemented | Missing | Approved clinical questionnaires and persistence |
| Provider matching | Not implemented | Production Blocker | Server-side state/license matching |
| Review | Not implemented | Missing | Persisted request summary |
| Checkout | Not implemented | Production Blocker | Server pricing resolver and Stripe |
| Confirmation | Not implemented | Missing | Care-request creation API |
| Status transition | Fixture-only examples | Production Blocker | Backend workflow state machine |
| Laboratory request | Static explanatory copy only | Feature-Gated | Provider review, invoice, payment, and result-release APIs |

State selection must remain the first matching gate. No eligibility or pricing logic may be
implemented in the browser.

## Integration Inventory

| Integration | Repository Evidence | Classification | Release Impact |
| --- | --- | --- | --- |
| Application API client | No `fetch`, GraphQL, Axios, or API adapter in production code | Missing | Production Blocker for every authenticated workflow |
| Supabase client | No dependency, configuration, or client module | Missing | Production Blocker |
| Supabase functions | No `supabase/functions` directory | Missing | Production Blocker for server workflows |
| Supabase views | No migrations, generated types, or view definitions | Missing | My Chart cannot use release-gated views |
| Pricing resolver | No `_shared/pricing.ts` or `pricing-preview` client | Missing | Checkout and totals must remain disabled |
| Stripe | No dependency, checkout client, webhook configuration, or payment API | Missing | Checkout and payment actions must remain disabled |
| Messaging | No message API, subscription, or persistence | Missing | Message pages remain preview-only |
| Laboratory | No order, invoice, payment, or released-results integration | Missing | Lab request workflow remains disabled |
| Provider onboarding | No profile, license, fee, W-9, or approval API | Missing | Provider portal cannot be released |
| Email delivery | No provider or configuration | Missing | Recovery and notifications unavailable |

## Authorization and Role Gating

The application routes directly from `window.location.pathname`. No authenticated session,
route guard, server authorization check, or role claim is present. `PortalShell` accepts
`patient`, `provider`, or `admin` as presentation variants, but that does not enforce access.

Server-enforced patient ownership, provider assignment, admin authorization, provider approval,
and per-state license gating are all **Production Blockers**.

## Environment and Feature Configuration

| Item | Current State | Classification |
| --- | --- | --- |
| Environment variables | No application `.env.example` or `import.meta.env` usage | Missing |
| Feature flags | No feature-flag module or provider | Missing |
| Production API URL | Not configured | Missing |
| Supabase URL/key | Not configured | Missing |
| Stripe publishable key | Not configured | Missing |
| Monitoring DSN | Not configured | Missing |

Any future browser-exposed variable must be non-secret. Service-role keys, Stripe secret keys,
webhook secrets, and other privileged credentials must never be bundled into the Vite client.

## Monitoring and Error Reporting

There is no error boundary, production error-reporting service, structured logging integration,
health endpoint, or release identifier. UI error states exist as reusable components and fixture
variants, but they are not connected to production failures.

Classification: **Production Blocker** for a production go-live.

## Deployment Configuration

- GitHub Actions runs install, typecheck, lint, test, and build for pull requests and `main`.
- Vite builds a static `dist` bundle.
- No production hosting configuration, domain configuration, environment binding, health check,
  staging target, rollback automation, or deployment workflow is present.
- No `.openai/hosting.json`, Vercel, Netlify, container, or equivalent target is configured.

Classification: **Production Blocker**.

## Fixture, Placeholder, and Hardcoded Data Audit

| Location | Data | Allowed Location | Production Disposition |
| --- | --- | --- | --- |
| `src/lib/patientFixtures.ts` | Fictional patient identity, care records, messages, labs, invoices, payment totals, licenses/provider names | Tests or explicit development previews only | Must not power production patient routes |
| `src/pages/patient/*` | Imports fixture data directly | Development preview only | Must be feature-gated from production |
| `src/pages/public/TemporaryAccessPage.tsx` | Honest unavailable-state copy | Public production route | May remain until access backend exists |
| `src/pages/public/pageHelpers.tsx` | Illustrative UI cards and approved display-only pricing values | Public decorative preview | Must remain clearly illustrative and non-transactional |
| `src/pages/FoundationPreview.tsx` | Foundation preview content | Development preview only | Keep noindex and out of production navigation |
| `src/pages/ComponentShowcase.tsx` | Component demo content | Development preview only | Keep noindex and out of production navigation |
| `src/pages/PortalPreview.tsx` | Portal demo identity and navigation | Development preview only | Keep noindex and out of production navigation |

The hardcoded public pricing strings match the locked display model in AGENTS.md. They are not a
checkout source and must never be used to calculate a transaction.

## Release Gate

The static public information site can be built and tested. The following must remain disabled or
preview-only until connected to authoritative production services:

- Sign in, registration, recovery, and MFA
- Start Care, provider matching, checkout, and confirmation
- All patient portal routes
- All provider portal routes
- All admin portal routes
- Payments, messages, laboratory ordering, results, and provider onboarding

Recommended status: **No-Go for full production release**. A limited static public-information
deployment is possible only after hosting, monitoring, legal/content approval, and asset-rights
review are completed.
