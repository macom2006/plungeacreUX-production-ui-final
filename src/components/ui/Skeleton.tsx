import { cn } from "../../lib/cn";
import "./Feedback.css";

export interface SkeletonProps {
  className?: string;
  lines?: number;
  type?: "text" | "card" | "avatar" | "table-row";
}

export function Skeleton({ className, lines = 3, type = "text" }: SkeletonProps) {
  if (type === "text") {
    return (
      <div aria-label="Loading content" className={cn("skeleton-text", className)} role="status">
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-label="Loading content"
      className={cn("skeleton", `skeleton--${type}`, className)}
      role="status"
    />
  );
}
