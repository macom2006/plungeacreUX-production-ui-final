import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock, useFocusTrap } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import "./Overlay.css";

export interface DialogProps {
  children: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  description?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  preventEscapeClose?: boolean;
  size?: "sm" | "md" | "lg";
  title: ReactNode;
}

export function Dialog({
  children,
  className,
  closeOnOverlayClick = true,
  description,
  isOpen,
  onClose,
  preventEscapeClose = false,
  size = "md",
  title,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = description ? `${titleId}-description` : undefined;
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen);
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !preventEscapeClose) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, preventEscapeClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn("dialog", `dialog--${size}`, className)}
        ref={containerRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="dialog__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <Button aria-label="Close dialog" onClick={onClose} size="icon" variant="ghost">
            x
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
