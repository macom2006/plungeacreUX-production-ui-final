import { publicRoutes, temporaryRoutes, type RoutePath } from "./routes";

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

export const faqCategories = [
  { id: "getting-care", label: "Getting care" },
  { id: "providers", label: "Providers" },
  { id: "pricing-and-payment", label: "Pricing and payment" },
  { id: "laboratory-requests", label: "Laboratory requests" },
  { id: "account-and-privacy", label: "Account and privacy" },
] as const;

export type FaqCategoryId = (typeof faqCategories)[number]["id"];

export interface FaqItem {
  answer: string;
  category: FaqCategoryId;
  id: string;
  question: string;
}

export const publicCtas = {
  exploreServices: { href: publicRoutes.services, label: "Explore services" },
  forProviders: { href: publicRoutes.forProviders, label: "For Providers" },
  seePricing: { href: publicRoutes.pricing, label: "See pricing" },
  signIn: { href: temporaryRoutes.signIn, label: "Sign in" },
  startCare: { href: temporaryRoutes.startCare, label: "Start care" },
} as const satisfies Record<string, CtaLink>;

export const serviceCategories: ContentCard[] = [
  {
    description:
      "Begin with a health concern and receive clear next steps after a licensed provider reviews the information you share.",
    eyebrow: "Everyday needs",
    href: publicRoutes.services,
    label: "Learn how review works",
    title: "Online care requests",
  },
  {
    description:
      "When lab testing may be appropriate, a provider reviews the request first. No charge until provider review.",
    eyebrow: "Laboratory requests",
    href: publicRoutes.pricing,
    label: "Review pricing timing",
    title: "Provider-reviewed labs",
  },
  {
    description:
      "Understand where your request stands and what to do next without sorting through disconnected messages.",
    eyebrow: "Communication",
    href: publicRoutes.faq,
    label: "Read FAQ",
    title: "Clear follow-through",
  },
];

export const marketplaceHighlights: ContentCard[] = [
  {
    description:
      "Care requests are reviewed by licensed providers, and clinical decisions stay with the reviewing provider.",
    title: "Provider-led review",
  },
  {
    description:
      "Patients can see what was submitted, what is awaiting review, and what next step is needed.",
    title: "Simple next steps",
  },
  {
    description:
      "Pricing is presented before applicable payment, and lab requests keep the no-charge-before-review safeguard.",
    title: "Transparent timing",
  },
];

export const careProcessSteps: ProcessStep[] = [
  {
    description: "Share the reason you are seeking care so the request can be directed appropriately.",
    title: "Tell us what you need",
  },
  {
    description: "A licensed provider reviews the information and determines whether next steps are appropriate.",
    title: "A licensed provider reviews your request",
  },
  {
    description: "You receive clear guidance about what happens next, without promises of approval, treatment, or prescriptions.",
    title: "Receive clear next steps",
  },
  {
    description: "When a payment step applies, the amount is shown before payment is completed.",
    title: "Complete applicable payment when presented",
  },
];

export const providerBenefits: ContentCard[] = [
  {
    description:
      "Reach patients who are looking for a simple online starting point for care while keeping provider judgment at the center.",
    title: "Meet patients where they begin",
  },
  {
    description:
      "Plunge Care is designed around provider-led review, clear request context, and careful communication with patients.",
    title: "Protect clinical judgment",
  },
  {
    description:
      "Provider participation may involve profile details, state license information, fees, and tax documentation when requested.",
    title: "Understand participation needs",
  },
];

export const pricingItems: PricingItem[] = [
  {
    description: "Shown for open-practice initial visits before payment is completed.",
    label: "Open-practice initial visit",
    value: "$65 flat",
  },
  {
    description: "Provider consultation fees may vary and are shown with the platform fee before payment.",
    label: "Direct or referred patient",
    value: "Provider consultation fee plus $15 platform fee",
  },
  {
    description: "Follow-up provider fees may vary and are shown with the follow-up platform fee before payment.",
    label: "Follow-up",
    value: "Provider follow-up fee plus $14.99",
  },
  {
    description: "Laboratory charges appear only after a provider reviews the request.",
    label: "Laboratory orders",
    value: "No charge until provider review.",
  },
];

export const pricingPrinciples: ContentCard[] = [
  {
    description:
      "You see applicable charges before completing payment, including provider fees when they apply.",
    title: "Charges shown before payment",
  },
  {
    description:
      "Direct, referred, and follow-up care may include provider-set fees in addition to the listed platform fee.",
    title: "Provider fees may vary",
  },
  {
    description:
      "Lab requests are reviewed first, and any applicable lab charge is presented only after review.",
    title: "Laboratory review safeguard",
  },
];

export const faqItems: FaqItem[] = [
  {
    answer:
      "Plunge Care gives patients a simple online starting point for care, provider review, clear next steps, and pricing timing.",
    category: "getting-care",
    id: "what-is-plunge-care",
    question: "What is Plunge Care?",
  },
  {
    answer:
      "A licensed provider reviews the information you share and determines whether care, lab testing, or another next step is appropriate.",
    category: "getting-care",
    id: "what-happens-after-request",
    question: "What happens after I submit a care request?",
  },
  {
    answer:
      "No. Submitting a request does not guarantee approval, diagnosis, treatment, lab testing, or a prescription.",
    category: "getting-care",
    id: "does-request-guarantee-treatment",
    question: "Does submitting a request guarantee treatment or a prescription?",
  },
  {
    answer:
      "Laboratory requests are not charged at the time of request. No charge until provider review.",
    category: "laboratory-requests",
    id: "lab-payment-timing",
    question: "When are laboratory requests charged?",
  },
  {
    answer:
      "You see applicable charges before payment is completed. Provider fees may vary depending on the care path and reviewing provider.",
    category: "pricing-and-payment",
    id: "when-will-i-see-cost",
    question: "When will I see the cost?",
  },
  {
    answer:
      "Providers can review the marketplace overview and access the provider area when secure sign-in is available. Participation requirements may include profile, license, fee, and W-9 information.",
    category: "providers",
    id: "how-do-providers-participate",
    question: "How do providers participate?",
  },
  {
    answer:
      "Online account access is being prepared. Please return soon or contact support when an approved support channel is available.",
    category: "account-and-privacy",
    id: "account-access",
    question: "How do I access my account?",
  },
];

export const footerDescription =
  "A simple online starting point for patients and a provider-led marketplace for modern care.";
