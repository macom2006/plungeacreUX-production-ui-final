import { LinkButton } from "../../components/ui";
import { careProcessSteps, publicCtas, serviceCategories } from "../../lib/publicContent";
import { publicRoutes } from "../../lib/routes";
import { PageHero, PublicPageShell, SectionHeader } from "./pageHelpers";

export function ServicesPage() {
  return (
    <PublicPageShell pathname={publicRoutes.services}>
      <PageHero
        actions={(
          <>
            <LinkButton href={publicCtas.startCare.href} size="lg">
              {publicCtas.startCare.label}
            </LinkButton>
            <LinkButton href={publicRoutes.faq} size="lg" variant="secondary">
              Read FAQ
            </LinkButton>
          </>
        )}
        eyebrow="Services"
        lede="Explore online care categories designed to start with your need and continue through licensed provider review."
        title="Online Care That Starts With Provider Review"
        visual="services"
        visualLabel="Illustration of service categories, provider review, and laboratory request timing"
      />

      <section className="public-section" aria-labelledby="service-categories-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Service Categories"
            id="service-categories-title"
            lede="Each category begins with information from the patient. A provider determines what care, if any, is appropriate."
            title="Care Paths Designed for Clear Next Steps"
          />
          <div className="public-grid">
            {serviceCategories.map((item) => (
              <article className="public-card" key={item.title}>
                {item.eyebrow ? <p className="public-eyebrow">{item.eyebrow}</p> : null}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--surface" aria-labelledby="review-title">
        <div className="public-container public-grid public-grid--two">
          <article className="public-card public-card--mint">
            <p className="public-eyebrow">Provider Review</p>
            <h2 id="review-title">Clinical Appropriateness Is Determined by a Provider</h2>
            <p>
              A provider reviews the details shared with the request before determining whether care, testing, or
              another next step is appropriate.
            </p>
          </article>
          <article className="public-card">
            <p className="public-eyebrow">Laboratory Requests</p>
            <h2>Laboratory Pricing Stays Protected Before Review</h2>
            <p>
              Laboratory requests are reviewed before any lab charge appears. No charge until provider review.
            </p>
          </article>
        </div>
      </section>

      <section className="public-section" aria-labelledby="service-process-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Process"
            id="service-process-title"
            lede="Share your care needs, receive provider review, and follow guidance based on that review."
            title="A Simple Care Path"
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
    </PublicPageShell>
  );
}
