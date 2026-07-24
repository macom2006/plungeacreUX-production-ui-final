import { useState, type ReactNode } from "react";
import { Button, Drawer } from "../ui";
import "./PortalShell.css";

export type PortalRole = "patient" | "provider" | "admin";

export interface PortalNavItem {
  activeWhen?: readonly string[];
  href: string;
  label: string;
}

const navByRole: Record<PortalRole, PortalNavItem[]> = {
  admin: [
    { href: "#overview", label: "Overview" },
    { href: "#providers", label: "Providers" },
    { href: "#licenses", label: "Licenses" },
    { href: "#reports", label: "Reports" },
    { href: "#settings", label: "Settings" },
  ],
  patient: [
    { href: "#overview", label: "Overview" },
    { href: "#care-requests", label: "Care Requests" },
    { href: "#messages", label: "Messages" },
    { href: "#my-chart", label: "My Chart" },
    { href: "#billing", label: "Billing & Payments" },
    { href: "#settings", label: "Settings" },
  ],
  provider: [
    { href: "#overview", label: "Overview" },
    { href: "#queue", label: "Care Queue" },
    { href: "#patients", label: "Patients" },
    { href: "#messages", label: "Messages" },
    { href: "#settings", label: "Settings" },
  ],
};

export interface PortalShellProps {
  accountDescription?: string;
  accountInitials?: string;
  accountName?: string;
  brandHref?: string;
  children: ReactNode;
  currentPathname?: string;
  eyebrow?: string;
  navItems?: readonly PortalNavItem[];
  pageTitle: string;
  role?: PortalRole;
}

function isNavItemActive(item: PortalNavItem, currentPathname: string | undefined, index: number) {
  if (!currentPathname) return index === 0;
  if (currentPathname === item.href) return true;
  if (item.href === "/patient") return false;

  return item.activeWhen?.some((pathname) => (
    currentPathname === pathname || currentPathname.startsWith(`${pathname}/`)
  )) ?? false;
}

function PortalNavigation({
  currentPathname,
  items,
  onNavigate,
}: {
  currentPathname?: string;
  items: readonly PortalNavItem[];
  onNavigate?: () => void;
}) {
  return (
    <nav className="portal-shell__nav" aria-label="Portal navigation">
      {items.map((item, index) => (
        <a
          aria-current={isNavItemActive(item, currentPathname, index) ? "page" : undefined}
          href={item.href}
          key={item.href}
          onClick={onNavigate}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function PortalShell({
  accountDescription = "Foundation role",
  accountInitials = "PM",
  accountName = "Practice User",
  brandHref = "/",
  children,
  currentPathname,
  eyebrow = "Foundation Preview",
  navItems,
  pageTitle,
  role = "patient",
}: PortalShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const resolvedNav = navItems ?? navByRole[role];

  return (
    <div className="portal-shell">
      <a className="skip-link" href="#portal-main-content">
        Skip to content
      </a>
      <aside className="portal-shell__sidebar" aria-label="Portal navigation">
        <a className="portal-shell__brand" href={brandHref} aria-label="Plunge Care home">
          <span className="portal-shell__mark" aria-hidden="true">
            PC
          </span>
          <span>Plunge Care</span>
        </a>
        <PortalNavigation currentPathname={currentPathname} items={resolvedNav} />
      </aside>
      <div className="portal-shell__body">
        <header className="portal-shell__topbar">
          <Button
            aria-controls="portal-mobile-navigation"
            aria-expanded={drawerOpen}
            className="portal-shell__menu"
            onClick={() => setDrawerOpen(true)}
            variant="secondary"
          >
            Menu
          </Button>
          <div>
            <p className="portal-shell__eyebrow">{eyebrow}</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="portal-shell__account" aria-label="Signed in account">
            <span aria-hidden="true">{accountInitials}</span>
            <div>
              <strong>{accountName}</strong>
              <p>{accountDescription}</p>
            </div>
          </div>
        </header>
        <main className="portal-shell__main" id="portal-main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <Drawer
        description="Portal navigation links. Clinical, payment, and approval actions are not available in this drawer."
        id="portal-mobile-navigation"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="left"
        title="Portal Navigation"
      >
        <PortalNavigation
          currentPathname={currentPathname}
          items={resolvedNav}
          onNavigate={() => setDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
}
