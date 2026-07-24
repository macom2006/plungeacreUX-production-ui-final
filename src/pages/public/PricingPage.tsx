import { LinkButton, StatusBadge } from "../../components/ui";
import { pricingItems, pricingPrinciples, publicCtas } from "../../lib/publicContent";
import { publicRoutes } from "../../lib/routes";
import { PageHero, PublicPageShell, SectionHeader } from "./pageHelpers";

export function PricingPage() {
  return (
    <PublicPageShell pathname={publicRoutes.pricing}>
      <PageHero
        actions={(
          <>
            <LinkButton href={publicCtas.startCare.href} size="lg">
              {publicCtas.startCare.label}
            </LinkButton>
            <LinkButton href={publicRoutes.faq} size="lg" variant="secondary">
              Pricing FAQ
            </LinkButton>
          </>
        )}
        eyebrow="Pricing"
        lede="Approved public pricing values are display content only. Totals, platform-fee math, tax, discounts, coupons, and payment processing are not calculated in the browser."
        title="Clear pricing timing, no browser-side calculations"
        visualLabel="Illustrative pricing visual showing warning status for payment required and no lab charge before review"
      />

      <section className="public-section" aria-labelledby="pricing-values-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Approved display values"
            id="pricing-values-title"
            lede="These values come from the approved pricing model in AGENTS.md and are centralized as content. They are not combined into totals."
            title="What the public site may display"
          />
          <div className="public-pricing-list">
            {pricingItems.map((item) => (
              <article className="public-pricing-item" key={item.label}>
                <div>
                  <h2>{item.label}</h2>
                  <p>{item.description}</p>
                </div>
                <strong className="public-pricing-item__value">{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--surface" aria-labelledby="pricing-principles-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Safeguards"
            id="pricing-principles-title"
            lede="Financial messaging stays explanatory and avoids checkout, Stripe, coupons, taxes, refunds, or calculators."
            title="Payment safeguards remain visible"
          />
          <div className="public-grid">
            {pricingPrinciples.map((item) => (
              <article className="public-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section" aria-labelledby="payment-status-title">
        <div className="public-container public-grid public-grid--two">
          <div className="public-note" aria-labelledby="payment-status-title">
            <h2 id="payment-status-title">Payment required stays amber</h2>
            <p>
              <StatusBadge status="payment-required" /> Payment required is a warning state, not a danger state.
            </p>
          </div>
          <div className="public-note" aria-labelledby="lab-charge-title">
            <h2 id="lab-charge-title">Laboratory request timing</h2>
            <p>No charge until provider review.</p>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
