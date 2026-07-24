import { cn } from "../../lib/cn";
import "./Navigation.css";

export interface BreadcrumbItem {
  href?: string;
  label: string;
}

export interface BreadcrumbsProps {
  className?: string;
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  const visibleItems = items.length > 4
    ? [items[0], { label: "..." }, ...items.slice(-2)]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cn("breadcrumbs", className)}>
      <ol>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !isLast ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
