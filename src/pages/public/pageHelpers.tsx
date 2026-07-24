import type { ReactNode } from "react";
import { PublicLayout } from "../../components/layout";
import { LinkButton, StatusBadge } from "../../components/ui";
import type { PublicRoutePath } from "../../lib/routes";
import "./PublicPages.css";

interface PublicPageShellProps {
  children: ReactNode;
  pathname: PublicRoutePath | string;
}

interface PageHeroProps {
  actions?: ReactNode;
  eyebrow: string;
  lede: string;
  title: string;
  visualLabel?: string;
}

interface SectionHeaderProps {
  eyebrow?: string;
  id: string;
  lede?: string;
  title: string;
}

export function PublicPageShell({ children, pathname }: PublicPageShellProps) {
  return (
    <PublicLayout currentPathname={pathname}>
      <div className="public-page">{children}</div>
    </PublicLayout>
  );
}

export function PageHero({ actions, eyebrow, lede, title, visualLabel }: PageHeroProps) {
  return (
    <section className="public-hero" aria-labelledby="page-title">
      <div className="public-container public-hero__grid">
        <div className="public-hero__content">
          <p className="public-eyebrow">{eyebrow}</p>
          <h1 id="page-title">{title}</h1>
          <p>{lede}</p>
          {actions ? <div className="public-actions">{actions}</div> : null}
        </div>
        <CareVisual label={visualLabel ?? "Illustrative Plunge Care status cards"} />
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, id, lede, title }: SectionHeaderProps) {
  return (
    <div className="public-section__header">
      {eyebrow ? <p className="public-eyebrow">{eyebrow}</p> : null}
      <h2 id={id}>{title}</h2>
      {lede ? <p>{lede}</p> : null}
    </div>
  );
}

export function CareVisual({ label }: { label: string }) {
  return (
    <div className="public-visual" role="img" aria-label={label}>
      <div className="public-visual__panel">
        <strong>Plunge Care</strong>
        <p>Provider review, status clarity, and payment timing shown in one calm public experience.</p>
      </div>
      <div className="public-visual__cards">
        <div className="public-visual__card">
          <strong>Online request</strong>
          <span>Submitted for review</span>
          <StatusBadge status="submitted" />
        </div>
        <div className="public-visual__card">
          <strong>Provider review</strong>
          <span>Clinical appropriateness determines next steps</span>
          <StatusBadge status="pending-review" />
        </div>
        <div className="public-visual__card">
          <strong>Payment timing</strong>
          <span>No charge until provider review for lab requests</span>
          <StatusBadge status="payment-required" />
        </div>
      </div>
    </div>
  );
}

export function FutureDestinationLink({ href, label }: { href: string; label: string }) {
  return (
    <LinkButton href={href}>
      {label}
    </LinkButton>
  );
}
