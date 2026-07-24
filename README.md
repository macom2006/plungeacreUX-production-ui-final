# PlungeCare Production UI

## Public routes

- `/` — production public homepage
- `/services` — public services overview
- `/for-providers` — public provider-marketing page
- `/pricing` — approved public pricing explanation
- `/faq` — public FAQ

## Development preview routes

- `/foundation` — Phase 1 foundation preview
- `/foundation/components` — shared UI component showcase
- `/foundation/portal` — portal shell preview

Public routes use `PublicLayout`, `PublicNav`, and `PublicFooter`. Portal preview routes use
`PortalShell` and must not render public navigation. Development preview routes are not listed in
the public navigation.

## Content organization

- Public route destinations and footer groups live in `src/lib/routes.ts`.
- Public marketing copy, pricing display values, service cards, process steps, provider content,
  and FAQ entries live in `src/lib/publicContent.ts`.
- Route-level document titles, descriptions, and canonicals are applied through
  `src/lib/documentMeta.ts`.

Update navigation through the shared route config instead of hardcoding links in components. Update
FAQ content through the typed FAQ objects so category grouping and accordion IDs stay consistent.

## Pricing restrictions

Pricing content is display-only. Do not add browser-side fee math, totals, tax logic, discounts,
coupon logic, checkout, Stripe, or laboratory price estimates. Laboratory request messaging must
preserve: `No charge until provider review.`

Payment required states use warning/amber. Red remains reserved for declined, failed, destructive,
and critical states.

## Local preview

This is a Vite React app. Do not open `index.html` directly from Finder or
Chrome; the browser cannot compile the app from `file://`.

Run:

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:5173/`.

## Validation

Run before opening a pull request:

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
npm audit --omit=dev
```

Responsive QA targets: `1440`, `1280`, `1024`, `768`, `720`, `640`, and `390` CSS pixels.
