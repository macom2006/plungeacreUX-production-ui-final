import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./DataDisplay.css";

export interface DescriptionListItem {
  label: string;
  value: ReactNode;
}

export interface DescriptionListProps {
  className?: string;
  columns?: "single" | "multi";
  density?: "standard" | "compact";
  items: DescriptionListItem[];
}

export function DescriptionList({
  className,
  columns = "single",
  density = "standard",
  items,
}: DescriptionListProps) {
  return (
    <dl className={cn("description-list", `description-list--${columns}`, `description-list--${density}`, className)}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
