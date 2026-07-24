import type { ReactNode } from "react";
import { Button } from "../ui";
import "./PortalShell.css";

const navItems = ["Overview", "Care requests", "Messages", "Documents", "Settings"];

export interface PortalShellProps {
  children: ReactNode;
  pageTitle: string;
}

export function PortalShell({ children, pageTitle }: PortalShellProps) {
  return (
    <div className="portal-shell">
      <aside className="portal-shell__sidebar" aria-label="Portal navigation">
        <a className="portal-shell__brand" href="/" aria-label="Plunge Care home">
          <span className="portal-shell__mark" aria-hidden="true">
            PC
          </span>
          <span>Plunge Care</span>
        </a>
        <nav className="portal-shell__nav">
          {navItems.map((item, index) => (
            <a
              aria-current={index === 0 ? "page" : undefined}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <div className="portal-shell__body">
        <header className="portal-shell__topbar">
          <Button
            aria-controls="portal-mobile-navigation"
            aria-expanded="false"
            className="portal-shell__menu"
            variant="secondary"
          >
            Menu
          </Button>
          <div>
            <p className="portal-shell__eyebrow">Foundation preview</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="portal-shell__account" aria-label="Signed in account">
            <span aria-hidden="true">PM</span>
            <div>
              <strong>Practice User</strong>
              <p>Foundation role</p>
            </div>
          </div>
        </header>
        <main className="portal-shell__main" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <div
        aria-hidden="true"
        className="portal-shell__drawer-placeholder"
        id="portal-mobile-navigation"
      />
    </div>
  );
}
