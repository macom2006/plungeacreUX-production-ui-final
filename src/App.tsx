import { ComponentShowcase } from "./pages/ComponentShowcase";
import { FoundationPreview } from "./pages/FoundationPreview";
import { PortalPreview } from "./pages/PortalPreview";

export default function App() {
  if (window.location.pathname === "/foundation/components") {
    return <ComponentShowcase />;
  }

  if (window.location.pathname === "/foundation/portal") {
    return <PortalPreview />;
  }

  return <FoundationPreview />;
}
