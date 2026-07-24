import { LinkButton } from "../../components/ui";
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
        lede="See when charges are presented, what listed fees cover, and how laboratory requests are handled after provider review."
        title="Clear pricing timing before payment"
        visual="pricing"
        visualLabel="Illustration of pricing timing, provider fees, and laboratory review safeguards"
      />

      <section className="public-section" aria-labelledby="pricing-values-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Pricing basics"
            id="pricing-values-title"
            lede="These values are shown as separate pricing references. Any applicable final charge is presented before payment."
            title="What patients can expect to see"
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
            lede="Pricing is easiest to understand when provider fees, platform fees, and lab request timing stay clear."
            title="Payment timing that is easier to understand"
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

      <section className="public-section" aria-labelledby="lab-charge-title">
        <div className="public-container public-grid public-grid--two">
          <div className="public-note" aria-labelledby="lab-charge-title">
            <h2 id="lab-charge-title">Laboratory request timing</h2>
            <p>No charge until provider review.</p>
          </div>
          <div className="public-note public-note--info" aria-labelledby="provider-fees-title">
            <h2 id="provider-fees-title">Provider fees</h2>
            <p>Provider fees may vary and are shown before payment when they apply.</p>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
