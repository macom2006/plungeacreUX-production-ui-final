import { LinkButton } from "../../components/ui";
import { publicRoutes, temporaryRoutes, type TemporaryRoutePath } from "../../lib/routes";
import { PageHero, PublicPageShell, SectionHeader } from "./pageHelpers";

interface TemporaryAccessPageProps {
  pathname: TemporaryRoutePath;
}

const pageContent = {
  [temporaryRoutes.signIn]: {
    eyebrow: "Account Access",
    lede:
      "Secure sign-in for Plunge Care patients and providers is being prepared. You can still review services, pricing, and common questions.",
    primaryLink: publicRoutes.faq,
    primaryLabel: "Read FAQ",
    title: "Secure Sign-In Is Being Prepared.",
  },
  [temporaryRoutes.startCare]: {
    eyebrow: "Start Care",
    lede:
      "The secure care entry point is being prepared. In the meantime, you can review care categories, pricing timing, and what happens after provider review.",
    primaryLink: publicRoutes.services,
    primaryLabel: "Explore services",
    title: "Start Care Access Is Being Prepared.",
  },
} as const;

export function TemporaryAccessPage({ pathname }: TemporaryAccessPageProps) {
  const content = pageContent[pathname];

  return (
    <PublicPageShell pathname={pathname}>
      <PageHero
        actions={(
          <>
            <LinkButton href={content.primaryLink} size="lg">
              {content.primaryLabel}
            </LinkButton>
            <LinkButton href={publicRoutes.pricing} size="lg" variant="secondary">
              Review pricing
            </LinkButton>
          </>
        )}
        eyebrow={content.eyebrow}
        lede={content.lede}
        title={content.title}
        visual="temporary"
        visualLabel="Illustration showing links to Plunge Care information while secure access is prepared"
      />

      <section className="public-section public-section--surface" aria-labelledby="access-options-title">
        <div className="public-container">
          <SectionHeader
            eyebrow="Helpful Links"
            id="access-options-title"
            lede="These pages can help you understand Plunge Care before account access is available."
            title="Where to Go Next"
          />
          <div className="public-grid">
            <article className="public-card">
              <h2>Review Care Categories</h2>
              <p>See the kinds of online care requests Plunge Care is designed to support.</p>
              <a className="public-card__link" href={publicRoutes.services}>View services</a>
            </article>
            <article className="public-card">
              <h2>Understand Pricing Timing</h2>
              <p>Learn when applicable charges are shown and how laboratory request timing works.</p>
              <a className="public-card__link" href={publicRoutes.pricing}>See pricing</a>
            </article>
            <article className="public-card">
              <h2>Read Common Questions</h2>
              <p>Find answers about provider review, payment timing, laboratory requests, and account access.</p>
              <a className="public-card__link" href={publicRoutes.faq}>Read FAQ</a>
            </article>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
