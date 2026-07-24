import { Accordion } from "../../components/ui";
import { faqItems, type FaqItem } from "../../lib/publicContent";
import { publicRoutes } from "../../lib/routes";
import { PageHero, PublicPageShell, SectionHeader } from "./pageHelpers";

const categories: FaqItem["category"][] = [
  "Getting care",
  "Providers",
  "Pricing and payment",
  "Laboratory requests",
  "Account and privacy",
];

function itemsForCategory(category: FaqItem["category"]) {
  return faqItems
    .filter((item) => item.category === category)
    .map((item) => ({ content: <p>{item.answer}</p>, id: item.id, title: item.question }));
}

export function FaqPage() {
  return (
    <PublicPageShell pathname={publicRoutes.faq}>
      <PageHero
        eyebrow="FAQ"
        lede="Answers stay within approved public content and avoid legal, clinical, privacy, financial, or compliance claims that have not been sourced."
        title="Questions about Plunge Care"
        visualLabel="Illustrative FAQ visual showing public question categories and provider review safeguards"
      />

      <section className="public-section" aria-labelledby="faq-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Questions"
            id="faq-title"
            lede="Questions are grouped for scanability and each answer expands with button-based disclosure behavior."
            title="Public FAQ"
          />
          <div className="public-faq-groups">
            {categories.map((category) => {
              const items = itemsForCategory(category);
              if (items.length === 0) return null;

              return (
                <section className="public-faq-group" key={category} aria-labelledby={`${category}-title`}>
                  <h2 id={`${category}-title`}>{category}</h2>
                  <Accordion items={items} />
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
