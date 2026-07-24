import { LinkButton, Accordion } from "../../components/ui";
import {
  careProcessSteps,
  faqItems,
  marketplaceHighlights,
  publicCtas,
  serviceCategories,
} from "../../lib/publicContent";
import { publicRoutes } from "../../lib/routes";
import { PageHero, PublicPageShell, SectionHeader } from "./pageHelpers";

const homepageFaqs = faqItems.slice(0, 3).map((item) => ({
  content: <p>{item.answer}</p>,
  id: item.id,
  title: item.question,
}));

export function HomePage() {
  return (
    <PublicPageShell pathname="/">
      <PageHero
        actions={(
          <>
            <LinkButton href={publicCtas.startCare.href} size="lg">
              {publicCtas.startCare.label}
            </LinkButton>
            <LinkButton href={publicCtas.exploreServices.href} size="lg" variant="secondary">
              {publicCtas.exploreServices.label}
            </LinkButton>
          </>
        )}
        eyebrow="Online care marketplace"
        lede="Plunge Care helps patients begin online care requests, follow provider review, and understand next steps with clear status and payment timing."
        title="Modern care, made simple."
        visualLabel="Illustrative public homepage visual showing request, review, and payment timing cards"
      />

      <section className="public-section" aria-labelledby="positioning-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Trust and positioning"
            id="positioning-title"
            lede="The public experience explains what Plunge Care organizes without promising approval, prescriptions, or treatment."
            title="A calmer front door for provider-reviewed care"
          />
          <div className="public-grid">
            {marketplaceHighlights.map((item) => (
              <article className="public-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--surface" aria-labelledby="services-preview-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Services"
            id="services-preview-title"
            lede="Service content stays high level until a later secure care workflow can collect the required information."
            title="Support for care requests, review, and communication"
          />
          <div className="public-grid">
            {serviceCategories.map((item) => (
              <article className="public-card" key={item.title}>
                {item.eyebrow ? <p className="public-eyebrow">{item.eyebrow}</p> : null}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.href && item.label ? (
                  <a className="public-card__link" href={item.href}>{item.label}</a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section" aria-labelledby="process-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="How it works"
            id="process-title"
            lede="The public site describes the process without implementing patient intake, checkout, or clinical workflows."
            title="Clear steps before secure care workflows"
          />
          <ol className="public-process">
            {careProcessSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="public-section public-section--mint" aria-labelledby="patient-value-title">
        <div className="public-container public-grid public-grid--two">
          <article className="public-card">
            <p className="public-eyebrow">Patients</p>
            <h2 id="patient-value-title">Convenience with provider review at the center</h2>
            <p>
              Patients can understand the role of online requests, provider review, communication, and transparent
              payment timing before entering future secure workflows.
            </p>
            <LinkButton href={publicRoutes.services} variant="secondary">
              Review services
            </LinkButton>
          </article>
          <article className="public-card public-card--navy">
            <p className="public-eyebrow">Providers</p>
            <h2>Provider opportunity without portal actions</h2>
            <p>
              Provider-facing public content explains the marketplace model without implementing onboarding,
              credentialing, availability, clinical queue, or payout features.
            </p>
            <LinkButton href={publicRoutes.forProviders} variant="secondary">
              Learn about providers
            </LinkButton>
          </article>
        </div>
      </section>

      <section className="public-section" aria-labelledby="pricing-preview-title">
        <div className="public-container public-grid public-grid--two">
          <div>
            <SectionHeader
              eyebrow="Pricing"
              id="pricing-preview-title"
              lede="Applicable pricing is confirmed before payment actions. Laboratory requests preserve the required pre-review safeguard."
              title="Pricing clarity before applicable payment steps"
            />
            <LinkButton href={publicRoutes.pricing}>{publicCtas.seePricing.label}</LinkButton>
          </div>
          <div className="public-note" aria-labelledby="lab-note-title">
            <h3 id="lab-note-title">Laboratory safeguard</h3>
            <p>No charge until provider review.</p>
          </div>
        </div>
      </section>

      <section className="public-section public-section--surface" aria-labelledby="faq-preview-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="FAQ"
            id="faq-preview-title"
            lede="A few core questions are available here, with the full FAQ organized by category."
            title="Questions before getting started"
          />
          <Accordion defaultOpenIds={[homepageFaqs[0]?.id ?? ""]} items={homepageFaqs} />
          <div className="public-actions">
            <LinkButton href={publicRoutes.faq} variant="secondary">
              View all questions
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="public-section" aria-labelledby="final-cta-title">
        <div className="public-container">
          <div className="public-card public-card--mint">
            <p className="public-eyebrow">Next step</p>
            <h2 id="final-cta-title">Start from a clear public overview</h2>
            <p>
              Continue to the future care entry point when it is available, or review services and pricing first.
            </p>
            <div className="public-actions">
              <LinkButton href={publicCtas.startCare.href}>{publicCtas.startCare.label}</LinkButton>
              <LinkButton href={publicRoutes.services} variant="secondary">Explore first</LinkButton>
            </div>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
