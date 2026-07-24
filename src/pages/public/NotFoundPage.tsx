import { LinkButton } from "../../components/ui";
import { publicRoutes } from "../../lib/routes";
import { PublicPageShell } from "./pageHelpers";

export function NotFoundPage() {
  return (
    <PublicPageShell pathname={window.location.pathname}>
      <section className="public-section public-not-found" aria-labelledby="not-found-title">
        <div className="public-container">
          <div className="public-card">
            <p className="public-eyebrow">Page not found</p>
            <h1 id="not-found-title">We could not find that page.</h1>
            <p>
              The public Plunge Care page may have moved, or the address may be incomplete.
            </p>
            <div className="public-actions">
              <LinkButton href={publicRoutes.home}>Go home</LinkButton>
              <LinkButton href={publicRoutes.services} variant="secondary">View services</LinkButton>
              <LinkButton href={publicRoutes.faq} variant="ghost">Read FAQ</LinkButton>
            </div>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
