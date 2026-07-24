import { cn } from "../../lib/cn";
import "./Spinner.css";

export interface SpinnerProps {
  className?: string;
  decorative?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function Spinner({
  className,
  decorative = false,
  label = "Loading",
  size = "md",
}: SpinnerProps) {
  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      className={cn("spinner", `spinner--${size}`, className)}
      role={decorative ? undefined : "status"}
    />
  );
}
