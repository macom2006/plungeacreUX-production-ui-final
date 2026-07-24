import { forwardRef, useId, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "./Spinner";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  rightIcon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled,
    fullWidth = false,
    leftIcon,
    loading = false,
    loadingLabel = "Loading",
    rightIcon,
    size = "md",
    variant = "primary",
    type = "button",
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const loadingDescriptionId = useId();
  const describedBy = [ariaDescribedBy, loading ? loadingDescriptionId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;
  const hasTextChild = typeof children === "string" || typeof children === "number";
  const iconOnly = size === "icon" && !hasTextChild && !props["aria-label"];

  if (iconOnly) {
    throw new Error("Icon-only buttons require an aria-label.");
  }

  return (
    <>
      <button
        aria-busy={loading || undefined}
        aria-describedby={describedBy}
        className={cn(
          "button",
          `button--${variant}`,
          `button--${size}`,
          fullWidth && "button--full",
          loading && "button--loading",
          className,
        )}
        disabled={disabled || loading}
        ref={ref}
        type={type}
        {...props}
      >
        <span className="button__content">
          {leftIcon ? <span className="button__icon" aria-hidden="true">{leftIcon}</span> : null}
          <span>{children}</span>
          {rightIcon ? <span className="button__icon" aria-hidden="true">{rightIcon}</span> : null}
        </span>
        {loading ? (
          <span className="button__loading">
            <Spinner decorative size="sm" />
          </span>
        ) : null}
      </button>
      {loading ? (
        <span className="sr-only" id={loadingDescriptionId}>
          {loadingLabel}
        </span>
      ) : null}
    </>
  );
});
