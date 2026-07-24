import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "../ui";
import { PublicFooter } from "./PublicFooter";
import { PublicNav } from "./PublicNav";
import "./PublicLayout.css";

export interface PublicLayoutProps {
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  currentPathname?: string;
}

export function PublicLayout({ breadcrumbs, children, currentPathname }: PublicLayoutProps) {
  return (
    <div className="public-layout">
      <a className="skip-link" href="#public-main-content">
        Skip to content
      </a>
      <PublicNav currentPathname={currentPathname} />
      <main className="public-layout__main" id="public-main-content" tabIndex={-1}>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <div className="public-layout__breadcrumbs">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
