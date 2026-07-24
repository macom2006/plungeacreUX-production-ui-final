import { LinkButton, Accordion } from "../../components/ui";
import { faqItems, providerBenefits, publicCtas } from "../../lib/publicContent";
import { publicRoutes } from "../../lib/routes";
import { PageHero, PublicPageShell, SectionHeader } from "./pageHelpers";

const providerFaqs = faqItems
  .filter((item) => item.category === "providers" || item.category === "account-and-privacy")
  .map((item) => ({ content: <p>{item.answer}</p>, id: item.id, title: item.question }));

const joiningSteps = [
  {
    description: "Review how Plunge Care connects patients seeking online care with licensed provider review.",
    title: "Learn the marketplace",
  },
  {
    description: "Provider participation may require profile details, state license information, fees, and W-9 information.",
    title: "Prepare participation details",
  },
  {
    description: "Access the provider area when secure sign-in is available and follow any requested next steps.",
    title: "Access the provider area",
  },
];

export function ProvidersPage() {
  return (
    <PublicPageShell pathname={publicRoutes.forProviders}>
      <PageHero
        actions={(
          <>
            <LinkButton href={publicCtas.signIn.href} size="lg">
              Access provider area
            </LinkButton>
            <LinkButton href={publicRoutes.faq} size="lg" variant="secondary">
              Review provider questions
            </LinkButton>
          </>
        )}
        eyebrow="For providers"
        lede="Plunge Care is an online care marketplace built around licensed provider review, patient convenience, and clear participation expectations."
        title="Provider participation, presented clearly"
        visual="providers"
        visualLabel="Illustration of provider marketplace participation and provider-led review"
      />

      <section className="public-section" aria-labelledby="provider-benefits-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Opportunity"
            id="provider-benefits-title"
            lede="Participating providers can consider a modern online channel while maintaining professional clinical judgment."
            title="A care marketplace for licensed providers"
          />
          <div className="public-grid">
            {providerBenefits.map((item) => (
              <article className="public-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--surface" aria-labelledby="joining-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Joining process"
            id="joining-title"
            lede="The exact participation steps may depend on provider qualifications, licensure, and requested documentation."
            title="What provider participation can involve"
          />
          <ol className="public-process">
            {joiningSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="public-section" aria-labelledby="provider-faq-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Provider FAQ"
            id="provider-faq-title"
            lede="Common questions for providers considering Plunge Care."
            title="Provider questions"
          />
          <Accordion defaultOpenIds={[providerFaqs[0]?.id ?? ""]} items={providerFaqs} />
        </div>
      </section>
    </PublicPageShell>
  );
}
