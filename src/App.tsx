import { useEffect } from "react";
import { applyRouteMetadata } from "./lib/documentMeta";
import { developmentRoutes, publicRoutes, routeMetadata, temporaryRoutes } from "./lib/routes";
import { ComponentShowcase } from "./pages/ComponentShowcase";
import { FoundationPreview } from "./pages/FoundationPreview";
import { PortalPreview } from "./pages/PortalPreview";
import {
  FaqPage,
  HomePage,
  NotFoundPage,
  PricingPage,
  ProvidersPage,
  ServicesPage,
  TemporaryAccessPage,
} from "./pages/public";

export default function App() {
  const pathname = window.location.pathname;
  const metadata = routeMetadata[pathname as keyof typeof routeMetadata] ?? routeMetadata.notFound;

  useEffect(() => {
    applyRouteMetadata(metadata, pathname);
  }, [metadata, pathname]);

  if (pathname === publicRoutes.home) {
    return <HomePage />;
  }

  if (pathname === publicRoutes.services) {
    return <ServicesPage />;
  }

  if (pathname === publicRoutes.forProviders) {
    return <ProvidersPage />;
  }

  if (pathname === publicRoutes.pricing) {
    return <PricingPage />;
  }

  if (pathname === publicRoutes.faq) {
    return <FaqPage />;
  }

  if (pathname === temporaryRoutes.signIn || pathname === temporaryRoutes.startCare) {
    return <TemporaryAccessPage pathname={pathname} />;
  }

  if (pathname === developmentRoutes.foundation) {
    return <FoundationPreview />;
  }

  if (pathname === developmentRoutes.foundationComponents) {
    return <ComponentShowcase />;
  }

  if (pathname === developmentRoutes.foundationPortal) {
    return <PortalPreview />;
  }

  return <NotFoundPage />;
}
