import type { ReactNode } from "react";
import { PublicNav } from "./PublicNav";
import "./PublicLayout.css";

export interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="public-layout">
      <a className="skip-link" href="#public-main-content">
        Skip to content
      </a>
      <PublicNav />
      <main className="public-layout__main" id="public-main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="public-layout__footer" aria-label="Public footer">
        <div>
          <strong>Plunge Care</strong>
          <p>Footer structure reserved for production public pages.</p>
        </div>
      </footer>
    </div>
  );
}
