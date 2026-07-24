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
        lede="Plunge Care public services are explained as high-level support areas. Provider review determines clinical appropriateness."
        title="Care request support without unsupported guarantees"
        visualLabel="Illustrative services visual showing provider review and laboratory request safeguards"
      />

      <section className="public-section" aria-labelledby="service-categories-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Service categories"
            id="service-categories-title"
            lede="These categories describe the public experience and do not create service selection, intake, prescription, lab ordering, scheduling, or checkout workflows."
            title="What Plunge Care can organize"
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
            <p className="public-eyebrow">Provider review</p>
            <h2 id="review-title">Clinical appropriateness is determined by a provider</h2>
            <p>
              Public service content avoids diagnosis, prescription, treatment, or approval guarantees. A provider
              reviews submitted information before clinical next steps are determined.
            </p>
          </article>
          <article className="public-card">
            <p className="public-eyebrow">Laboratory requests</p>
            <h2>Laboratory pricing stays protected before review</h2>
            <p>
              Laboratory request content does not list a lab menu or estimated lab pricing. The required safeguard is:
              No charge until provider review.
            </p>
          </article>
        </div>
      </section>

      <section className="public-section" aria-labelledby="service-process-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Process"
            id="service-process-title"
            lede="The process is informational in Phase 3. Secure workflows belong to later phases."
            title="A high-level care path"
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
