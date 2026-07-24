# Production Release Screenshot Evidence

Captured: 2026-07-24

Source: local Vite production preview built from `release/production-readiness`

Viewports:

- Desktop: 1440 by 900 CSS pixels
- Mobile: 390 by 844 CSS pixels

## Captured Public Routes

- Homepage
- Services
- Pricing
- For Providers
- FAQ
- Start Care unavailable state

Each public route has a desktop and mobile viewport capture. Automated browser checks also covered
1280, 1024, 768, and 720 CSS-pixel widths with no horizontal overflow.

## Production Gate Evidence

`desktop-patient-gated.jpg` confirms that a production build does not render the fixture-backed
patient portal. Foundation previews and all patient paths returned the safe not-found experience,
contained no fixture identity, and produced no browser console errors.

## Missing Evidence

The following requested screenshots cannot be produced truthfully because the production routes
or required backend integrations do not exist in this repository:

- Checkout
- Patient portal routes and authenticated states
- Provider portal routes and onboarding
- Admin portal routes, approval, and license verification
- Production dialogs and drawers for consequential actions
- Backend-driven loading, empty, error, permission, and payment-failure states

These omissions are production blockers, not passed visual checks. See
`docs/production-readiness-inventory.md` and `docs/production-go-live-checklist.md`.
