export type PublicRoutePath = "/" | "/services" | "/for-providers" | "/pricing" | "/faq";
export type DevelopmentRoutePath = "/foundation" | "/foundation/components" | "/foundation/portal";
export type FutureRoutePath = "/sign-in" | "/start-care";
export type RoutePath = PublicRoutePath | DevelopmentRoutePath | FutureRoutePath;

export interface NavItem {
  href: PublicRoutePath;
  label: string;
}

export interface FooterGroup {
  ariaLabel: string;
  links: Array<{
    href: RoutePath;
    label: string;
    note?: string;
  }>;
  title: string;
}

export interface RouteMetadata {
  description: string;
  title: string;
}

export const publicRoutes = {
  faq: "/faq",
  forProviders: "/for-providers",
  home: "/",
  pricing: "/pricing",
  services: "/services",
} as const satisfies Record<string, PublicRoutePath>;

export const developmentRoutes = {
  foundation: "/foundation",
  foundationComponents: "/foundation/components",
  foundationPortal: "/foundation/portal",
} as const satisfies Record<string, DevelopmentRoutePath>;

export const futureRoutes = {
  signIn: "/sign-in",
  startCare: "/start-care",
} as const satisfies Record<string, FutureRoutePath>;

export const primaryNavigation: NavItem[] = [
  { href: publicRoutes.services, label: "Services" },
  { href: publicRoutes.forProviders, label: "For Providers" },
  { href: publicRoutes.pricing, label: "Pricing" },
  { href: publicRoutes.faq, label: "FAQ" },
];

export const footerGroups: FooterGroup[] = [
  {
    ariaLabel: "Public pages",
    links: [
      { href: publicRoutes.services, label: "Services" },
      { href: publicRoutes.pricing, label: "Pricing" },
      { href: publicRoutes.faq, label: "FAQ" },
    ],
    title: "Explore",
  },
  {
    ariaLabel: "Patient links",
    links: [
      { href: futureRoutes.startCare, label: "Start care", note: "Future destination" },
      { href: publicRoutes.services, label: "How care works" },
      { href: publicRoutes.pricing, label: "Pricing basics" },
    ],
    title: "Patients",
  },
  {
    ariaLabel: "Provider links",
    links: [
      { href: publicRoutes.forProviders, label: "For Providers" },
      { href: publicRoutes.faq, label: "Provider questions" },
    ],
    title: "Providers",
  },
  {
    ariaLabel: "Support links",
    links: [
      { href: publicRoutes.faq, label: "FAQ" },
      { href: futureRoutes.signIn, label: "Sign in", note: "Future destination" },
    ],
    title: "Support",
  },
];

export const routeMetadata: Record<PublicRoutePath | DevelopmentRoutePath | "notFound", RouteMetadata> = {
  "/": {
    description:
      "Plunge Care connects patients with online care requests, provider review, clear next steps, and transparent payment timing.",
    title: "Plunge Care | Online care with provider review",
  },
  "/faq": {
    description:
      "Answers about Plunge Care services, provider review, pricing timing, laboratory safeguards, and account access.",
    title: "FAQ | Plunge Care",
  },
  "/for-providers": {
    description:
      "Learn how Plunge Care presents a provider marketplace opportunity without portal onboarding or workflow actions.",
    title: "For Providers | Plunge Care",
  },
  "/foundation": {
    description: "Development preview for the Plunge Care foundation shell, tokens, and primitives.",
    title: "Foundation Preview | Plunge Care",
  },
  "/foundation/components": {
    description: "Development preview for Plunge Care shared UI components.",
    title: "Component Showcase | Plunge Care",
  },
  "/foundation/portal": {
    description: "Development preview for the Plunge Care portal shell.",
    title: "Portal Shell Preview | Plunge Care",
  },
  "/pricing": {
    description:
      "Plunge Care pricing principles, approved public display values, payment timing, and laboratory review safeguards.",
    title: "Pricing | Plunge Care",
  },
  "/services": {
    description:
      "Explore Plunge Care service categories with provider review, communication, laboratory request safeguards, and clear care steps.",
    title: "Services | Plunge Care",
  },
  notFound: {
    description: "The requested public Plunge Care page could not be found.",
    title: "Page not found | Plunge Care",
  },
};

export function isPublicRoute(pathname: string): pathname is PublicRoutePath {
  return Object.values(publicRoutes).includes(pathname as PublicRoutePath);
}

export function isDevelopmentRoute(pathname: string): pathname is DevelopmentRoutePath {
  return Object.values(developmentRoutes).includes(pathname as DevelopmentRoutePath);
}
