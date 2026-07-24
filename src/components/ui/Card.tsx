import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Card.css";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  title?: string;
}

export function Card({ children, className, title, ...props }: CardProps) {
  return (
    <section className={cn("card", className)} {...props}>
      {title ? <h3 className="card__title">{title}</h3> : null}
      {children}
    </section>
  );
}
