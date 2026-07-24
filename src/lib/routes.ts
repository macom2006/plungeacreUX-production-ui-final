export type MarketingRoutePath = "/" | "/services" | "/for-providers" | "/pricing" | "/faq";
export type TemporaryRoutePath = "/sign-in" | "/start-care";
export type PublicRoutePath = MarketingRoutePath | TemporaryRoutePath;
export type DevelopmentRoutePath = "/foundation" | "/foundation/components" | "/foundation/portal";
export type RoutePath = PublicRoutePath | DevelopmentRoutePath;

export interface NavItem {
  href: MarketingRoutePath;
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
  robots: "index, follow" | "noindex, nofollow";
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

export const temporaryRoutes = {
  signIn: "/sign-in",
  startCare: "/start-care",
} as const satisfies Record<string, TemporaryRoutePath>;

export const primaryNavigation: NavItem[] = [
  { href: publicRoutes.services, label: "Services" },
  { href: publicRoutes.forProviders, label: "For Providers" },
  { href: publicRoutes.pricing, label: "Pricing" },
  { href: publicRoutes.faq, label: "FAQ" },
];

export const footerGroups: FooterGroup[] = [
  {
    ariaLabel: "Site pages",
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
      { href: temporaryRoutes.startCare, label: "Start care" },
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
      { href: temporaryRoutes.signIn, label: "Sign in" },
    ],
    title: "Support",
  },
];

export const routeMetadata: Record<PublicRoutePath | DevelopmentRoutePath | "notFound", RouteMetadata> = {
  "/": {
    description:
      "Start online care with Plunge Care through licensed provider review, clear next steps, and transparent payment timing.",
    robots: "index, follow",
    title: "Plunge Care | Modern Telehealth Care, Made Simple",
  },
  "/faq": {
    description:
      "Find answers about Plunge Care, provider review, pricing timing, laboratory requests, and account access.",
    robots: "index, follow",
    title: "FAQ | Plunge Care",
  },
  "/for-providers": {
    description:
      "Learn how licensed providers can consider participating in the Plunge Care online care marketplace.",
    robots: "index, follow",
    title: "For Providers | Plunge Care",
  },
  "/foundation": {
    description: "Development preview for the Plunge Care foundation shell, tokens, and primitives.",
    robots: "noindex, nofollow",
    title: "Foundation Preview | Plunge Care",
  },
  "/foundation/components": {
    description: "Development preview for Plunge Care shared UI components.",
    robots: "noindex, nofollow",
    title: "Component Showcase | Plunge Care",
  },
  "/foundation/portal": {
    description: "Development preview for the Plunge Care portal shell.",
    robots: "noindex, nofollow",
    title: "Portal Shell Preview | Plunge Care",
  },
  "/pricing": {
    description:
      "Review Plunge Care pricing timing, provider fee information, and the laboratory review safeguard.",
    robots: "index, follow",
    title: "Pricing | Plunge Care",
  },
  "/services": {
    description:
      "Explore Plunge Care service categories for online care requests, provider review, communication, and lab request timing.",
    robots: "index, follow",
    title: "Services | Plunge Care",
  },
  "/sign-in": {
    description:
      "Plunge Care account access is being prepared for patients and providers.",
    robots: "noindex, nofollow",
    title: "Sign In | Plunge Care",
  },
  "/start-care": {
    description:
      "The secure Plunge Care start-care experience is being prepared.",
    robots: "noindex, nofollow",
    title: "Start Care | Plunge Care",
  },
  notFound: {
    description: "The requested public Plunge Care page could not be found.",
    robots: "noindex, nofollow",
    title: "Page Not Found | Plunge Care",
  },
};

export function isPublicRoute(pathname: string): pathname is PublicRoutePath {
  return (
    Object.values(publicRoutes).includes(pathname as MarketingRoutePath)
    || Object.values(temporaryRoutes).includes(pathname as TemporaryRoutePath)
  );
}

export function isDevelopmentRoute(pathname: string): pathname is DevelopmentRoutePath {
  return Object.values(developmentRoutes).includes(pathname as DevelopmentRoutePath);
}
