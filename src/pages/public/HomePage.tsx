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
            <LinkButton href={publicCtas.forProviders.href} size="lg" variant="ghost">
              {publicCtas.forProviders.label}
            </LinkButton>
          </>
        )}
        eyebrow="Online care marketplace"
        lede="Begin online, receive licensed provider review, and follow clear next steps with transparent payment timing."
        title="Modern Telehealth Care, Made Simple."
        visual="home"
        visualLabel="Illustration of online care requests, licensed provider review, and clear next steps"
      />

      <section className="public-section" aria-labelledby="positioning-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="How Plunge Care helps"
            id="positioning-title"
            lede="Plunge Care is designed to make the first step easier for patients while keeping clinical decisions in licensed provider hands."
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
            lede="Care begins with the information you share, then a provider determines whether the request is appropriate."
            title="Support for online care requests"
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
            lede="Share your care needs, receive provider review, and follow clear next steps. Submitting a request does not guarantee approval, treatment, or a prescription."
            title="A trustworthy path from request to review"
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
              Start from home, understand what information may be needed, and know when a provider has reviewed the request.
            </p>
            <LinkButton href={publicRoutes.services} variant="secondary">
              Review services
            </LinkButton>
          </article>
          <article className="public-card public-card--navy">
            <p className="public-eyebrow">Providers</p>
            <h2>Participate in a modern care marketplace</h2>
            <p>
              Plunge Care helps providers reach patients seeking online care while preserving provider-led clinical judgment.
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
              lede="Applicable charges are shown before payment. Laboratory requests preserve the required pre-review safeguard."
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
            lede="A few core questions are available here, with more detail organized by topic."
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
            <h2 id="final-cta-title">Ready to understand your options?</h2>
            <p>
              Review service categories, pricing timing, and common questions before beginning the secure care path.
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
