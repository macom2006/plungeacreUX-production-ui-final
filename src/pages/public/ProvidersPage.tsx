import { LinkButton, Accordion } from "../../components/ui";
import { faqItems, providerBenefits, publicCtas } from "../../lib/publicContent";
import { publicRoutes } from "../../lib/routes";
import { PageHero, PublicPageShell, SectionHeader } from "./pageHelpers";

const providerFaqs = faqItems
  .filter((item) => item.category === "Providers" || item.category === "Account and privacy")
  .map((item) => ({ content: <p>{item.answer}</p>, id: item.id, title: item.question }));

const joiningSteps = [
  {
    description: "Review the public marketplace model and decide whether Plunge Care fits your practice goals.",
    title: "Learn the model",
  },
  {
    description: "Future onboarding can collect approved profile, license, fee, and W-9 information in a secure flow.",
    title: "Prepare requirements",
  },
  {
    description: "Approval, license gating, availability, and clinical work remain server-enforced future portal scope.",
    title: "Use later portal workflows",
  },
];

export function ProvidersPage() {
  return (
    <PublicPageShell pathname={publicRoutes.forProviders}>
      <PageHero
        actions={(
          <>
            <LinkButton href={publicRoutes.faq} size="lg">
              Review provider questions
            </LinkButton>
            <LinkButton href={publicCtas.signIn.href} size="lg" variant="secondary">
              {publicCtas.signIn.label}
            </LinkButton>
          </>
        )}
        eyebrow="For providers"
        lede="A public overview of the Plunge Care marketplace opportunity, written without claims about income, volume, approval, or employment."
        title="Provider participation, presented clearly"
        visualLabel="Illustrative provider marketing visual showing marketplace information cards without portal workflows"
      />

      <section className="public-section" aria-labelledby="provider-benefits-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Opportunity"
            id="provider-benefits-title"
            lede="This page is public marketing content only. It does not render provider portal navigation or provider workflow controls."
            title="A marketplace model with restrained expectations"
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
            lede="The sequence is intentionally high level because onboarding, credential submission, license verification, and provider authentication are out of scope for Phase 3."
            title="What future provider participation can involve"
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
            lede="Provider questions stay informational and do not launch onboarding or credential workflows."
            title="Provider questions"
          />
          <Accordion defaultOpenIds={[providerFaqs[0]?.id ?? ""]} items={providerFaqs} />
        </div>
      </section>
    </PublicPageShell>
  );
}
