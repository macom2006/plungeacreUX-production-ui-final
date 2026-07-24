import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./DataDisplay.css";

export interface DescriptionListItem {
  label: string;
  value: ReactNode;
}

export interface DescriptionListProps {
  className?: string;
  items: DescriptionListItem[];
}

export function DescriptionList({ className, items }: DescriptionListProps) {
  return (
    <dl className={cn("description-list", className)}>
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
