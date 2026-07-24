import { futureRoutes, publicRoutes, type RoutePath } from "./routes";

export interface CtaLink {
  href: RoutePath;
  label: string;
}

export interface ContentCard {
  description: string;
  eyebrow?: string;
  href?: RoutePath;
  label?: string;
  title: string;
}

export interface ProcessStep {
  description: string;
  title: string;
}

export interface PricingItem {
  description: string;
  label: string;
  value: string;
}

export interface FaqItem {
  answer: string;
  category: "Getting care" | "Providers" | "Pricing and payment" | "Laboratory requests" | "Account and privacy";
  id: string;
  question: string;
}

export const publicCtas = {
  exploreServices: { href: publicRoutes.services, label: "Explore services" },
  forProviders: { href: publicRoutes.forProviders, label: "For Providers" },
  seePricing: { href: publicRoutes.pricing, label: "See pricing" },
  signIn: { href: futureRoutes.signIn, label: "Sign in" },
  startCare: { href: futureRoutes.startCare, label: "Start care" },
} as const satisfies Record<string, CtaLink>;

export const serviceCategories: ContentCard[] = [
  {
    description:
      "Share a care need online and receive next-step guidance after provider review. Plunge Care does not guarantee approval, treatment, or prescriptions.",
    eyebrow: "Online requests",
    href: publicRoutes.services,
    label: "Request review",
    title: "Care request review",
  },
  {
    description:
      "When laboratory testing is clinically appropriate, charges are not collected at request time and are handled after provider review.",
    eyebrow: "Laboratory safeguards",
    href: publicRoutes.pricing,
    label: "Pricing safeguards",
    title: "Laboratory request support",
  },
  {
    description:
      "Status updates, provider messages, and payment timing are presented in one organized care experience when those workflows are available.",
    eyebrow: "Clear next steps",
    href: publicRoutes.faq,
    label: "Read FAQ",
    title: "Communication and tracking",
  },
];

export const marketplaceHighlights: ContentCard[] = [
  {
    description:
      "Plunge Care presents care requests to eligible providers for review. Clinical decisions remain provider-led and depend on the details submitted.",
    title: "Provider-led review",
  },
  {
    description:
      "Patients see status language such as Submitted, Pending review, Payment required, Approved, Declined, and Payment failed with text and tone together.",
    title: "Readable status states",
  },
  {
    description:
      "Applicable pricing is confirmed before payment actions, and laboratory requests keep the pre-review no-charge safeguard visible.",
    title: "Payment timing clarity",
  },
];

export const careProcessSteps: ProcessStep[] = [
  {
    description: "Patients start from a public entry point and move into the appropriate secure workflow when that later phase exists.",
    title: "Start with the care need",
  },
  {
    description: "A provider reviews submitted details to determine whether a request is clinically appropriate.",
    title: "Provider review",
  },
  {
    description: "Plunge Care shows clear status updates and next steps without promising approval or a prescription.",
    title: "Track next steps",
  },
  {
    description: "Applicable payment actions appear only when timing and provider review allow them.",
    title: "Confirm payment timing",
  },
];

export const providerBenefits: ContentCard[] = [
  {
    description:
      "A marketplace model helps separate public education from provider portal work. Phase 3 does not implement onboarding, licensing, or clinical queue actions.",
    title: "Marketplace presentation",
  },
  {
    description:
      "Provider-facing content stays professional and avoids guarantees about patient volume, compensation, or approval outcomes.",
    title: "Trustworthy expectations",
  },
  {
    description:
      "Future provider workflows can use the approved portal shell, confirmation dialogs, forms, and table-first patterns from the shared UI library.",
    title: "Prepared for later portal work",
  },
];

export const pricingItems: PricingItem[] = [
  {
    description: "Approved public display content from AGENTS.md. This is not calculated in the browser.",
    label: "Open-practice initial visit",
    value: "$65 flat",
  },
  {
    description: "The provider fee is supplied by the pricing resolver. The public page does not calculate a total.",
    label: "Direct or referred patient",
    value: "Provider consultation fee plus $15 platform fee",
  },
  {
    description: "The follow-up provider fee is supplied by the pricing resolver. The public page does not calculate a total.",
    label: "Follow-up",
    value: "Provider follow-up fee plus $14.99",
  },
  {
    description: "No estimated laboratory pricing is shown before provider review.",
    label: "Laboratory orders",
    value: "No charge until provider review.",
  },
];

export const pricingPrinciples: ContentCard[] = [
  {
    description:
      "Amounts shown here are display content only. Totals, taxes, discounts, coupons, and payment processing are outside Phase 3.",
    title: "No browser-side calculations",
  },
  {
    description:
      "Payment required is treated as a warning state. Red remains reserved for declined, failed, destructive, and critical states.",
    title: "Status tone discipline",
  },
  {
    description:
      "Laboratory requests do not include estimated pricing before provider review and do not appear as upfront checkout line items.",
    title: "Laboratory review safeguard",
  },
];

export const faqItems: FaqItem[] = [
  {
    answer:
      "Plunge Care helps organize online care requests, provider review, clear next steps, and payment timing. Approval, treatment, and prescriptions are never guaranteed.",
    category: "Getting care",
    id: "what-is-plunge-care",
    question: "What is Plunge Care?",
  },
  {
    answer:
      "A provider reviews the submitted information and determines clinical appropriateness. The public site does not implement the care request workflow.",
    category: "Getting care",
    id: "how-provider-review-works",
    question: "How does provider review work?",
  },
  {
    answer:
      "No. Plunge Care does not guarantee prescriptions, diagnosis, treatment, or approval for a request.",
    category: "Getting care",
    id: "prescription-guarantee",
    question: "Does Plunge Care guarantee prescriptions?",
  },
  {
    answer:
      "Laboratory requests show the required safeguard: No charge until provider review. Estimated lab pricing is not shown before review.",
    category: "Laboratory requests",
    id: "lab-payment-timing",
    question: "When are laboratory requests charged?",
  },
  {
    answer:
      "Applicable pricing is confirmed in the care process before payment actions. The public page displays approved values only and does not calculate totals.",
    category: "Pricing and payment",
    id: "pricing-confirmation",
    question: "When is pricing confirmed?",
  },
  {
    answer:
      "The provider page explains the marketplace opportunity at a high level. It does not include onboarding, credential submission, licensing review, dashboards, or clinical queue actions.",
    category: "Providers",
    id: "provider-page-scope",
    question: "Can providers apply from this page?",
  },
  {
    answer:
      "The sign-in destination is reserved for a later authenticated flow. Phase 3 does not implement login, account creation, MFA, or patient intake.",
    category: "Account and privacy",
    id: "account-access",
    question: "Can I sign in from the public site?",
  },
];

export const footerDescription =
  "Public information for Plunge Care patients and providers, built around provider review, clear status language, and transparent payment timing.";
