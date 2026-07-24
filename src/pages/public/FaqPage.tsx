import { Accordion } from "../../components/ui";
import { faqCategories, faqItems, type FaqCategoryId } from "../../lib/publicContent";
import { publicRoutes } from "../../lib/routes";
import { PageHero, PublicPageShell, SectionHeader } from "./pageHelpers";

function itemsForCategory(category: FaqCategoryId) {
  return faqItems
    .filter((item) => item.category === category)
    .map((item) => ({ content: <p>{item.answer}</p>, id: item.id, title: item.question }));
}

export function FaqPage() {
  return (
    <PublicPageShell pathname={publicRoutes.faq}>
      <PageHero
        eyebrow="FAQ"
        lede="Answers to common questions about provider review, pricing timing, laboratory requests, and account access."
        title="Questions about Plunge Care"
        visual="faq"
        visualLabel="Illustration of common Plunge Care questions and helpful answers"
      />

      <section className="public-section" aria-labelledby="faq-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Questions"
            id="faq-title"
            lede="Browse by topic before beginning care or accessing your account."
            title="Frequently asked questions"
          />
          <div className="public-faq-groups">
            {faqCategories.map((category) => {
              const items = itemsForCategory(category.id);
              if (items.length === 0) return null;

              return (
                <section
                  aria-labelledby={`faq-category-${category.id}`}
                  className="public-faq-group"
                  key={category.id}
                >
                  <h2 id={`faq-category-${category.id}`}>{category.label}</h2>
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
