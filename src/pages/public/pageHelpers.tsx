import type { ReactNode } from "react";
import { PublicLayout } from "../../components/layout";
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
  visual?: HeroVisualVariant;
  visualLabel?: string;
}

interface SectionHeaderProps {
  eyebrow?: string;
  id: string;
  lede?: string;
  title: string;
}

export type HeroVisualVariant = "home" | "services" | "providers" | "pricing" | "faq" | "temporary";

export function PublicPageShell({ children, pathname }: PublicPageShellProps) {
  return (
    <PublicLayout currentPathname={pathname}>
      <div className="public-page">{children}</div>
    </PublicLayout>
  );
}

export function PageHero({ actions, eyebrow, lede, title, visual = "home", visualLabel }: PageHeroProps) {
  return (
    <section className="public-hero" aria-labelledby="page-title">
      <div className="public-container public-hero__grid">
        <div className="public-hero__content">
          <p className="public-eyebrow">{eyebrow}</p>
          <h1 id="page-title">{title}</h1>
          <p>{lede}</p>
          {actions ? <div className="public-actions">{actions}</div> : null}
        </div>
        <HeroVisual
          label={visualLabel ?? "Illustration of Plunge Care provider review and clear next steps"}
          variant={visual}
        />
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

interface HeroVisualProps {
  label: string;
  variant: HeroVisualVariant;
}

interface HeroVisualContent {
  cards: Array<{
    eyebrow: string;
    text: string;
    title: string;
  }>;
  heading: string;
  note: string;
}

const visualContent: Record<HeroVisualVariant, HeroVisualContent> = {
  faq: {
    cards: [
      { eyebrow: "Care", text: "What happens after I submit?", title: "Request review" },
      { eyebrow: "Pricing", text: "When will I see the cost?", title: "Before payment" },
      { eyebrow: "Labs", text: "No charge until provider review.", title: "Review first" },
    ],
    heading: "Answers before you begin",
    note: "Helpful guidance for patients and providers.",
  },
  home: {
    cards: [
      { eyebrow: "Request", text: "Share what you need.", title: "Tell us what is going on" },
      { eyebrow: "Review", text: "A licensed provider reviews your request.", title: "Provider-led care" },
      { eyebrow: "Next step", text: "Clear guidance follows review.", title: "Know what comes next" },
    ],
    heading: "Online care with a calmer path forward",
    note: "Simple steps, provider review, and transparent payment timing.",
  },
  pricing: {
    cards: [
      { eyebrow: "Initial visit", text: "$65 flat", title: "Open-practice care" },
      { eyebrow: "Provider fees", text: "Shown before payment.", title: "Clear before you pay" },
      { eyebrow: "Laboratory", text: "No charge until provider review.", title: "Review first" },
    ],
    heading: "Pricing timing without surprises",
    note: "Applicable charges are shown before payment.",
  },
  providers: {
    cards: [
      { eyebrow: "Marketplace", text: "Reach patients seeking online care.", title: "Modern care access" },
      { eyebrow: "Review", text: "Clinical decisions remain provider-led.", title: "Professional judgment" },
      { eyebrow: "Participation", text: "Profile and license details may be requested.", title: "Clear requirements" },
    ],
    heading: "Built for provider-led participation",
    note: "A professional marketplace overview for licensed providers.",
  },
  services: {
    cards: [
      { eyebrow: "Everyday needs", text: "Start with a care concern.", title: "Online requests" },
      { eyebrow: "Labs", text: "Provider review comes first.", title: "Lab request timing" },
      { eyebrow: "Follow-through", text: "Understand the next step.", title: "Clear communication" },
    ],
    heading: "Services shaped around review",
    note: "Care categories are explained clearly before you begin.",
  },
  temporary: {
    cards: [
      { eyebrow: "Services", text: "Review care categories.", title: "Explore care" },
      { eyebrow: "Pricing", text: "Understand payment timing.", title: "See pricing" },
      { eyebrow: "FAQ", text: "Read common questions.", title: "Get oriented" },
    ],
    heading: "Secure access is being prepared",
    note: "Useful public information is available while account access is readied.",
  },
};

export function HeroVisual({ label, variant }: HeroVisualProps) {
  const content = visualContent[variant];

  return (
    <div className={`public-visual public-visual--${variant}`} role="img" aria-label={label}>
      <div className="public-visual__media" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="public-visual__panel">
        <strong>{content.heading}</strong>
        <p>{content.note}</p>
      </div>
      <div className="public-visual__cards">
        {content.cards.map((card) => (
          <div className="public-visual__card" key={`${variant}-${card.eyebrow}`}>
            <span className="public-visual__eyebrow">{card.eyebrow}</span>
            <strong>{card.title}</strong>
            <span>{card.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
