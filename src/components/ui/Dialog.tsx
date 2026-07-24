import { useEffect, useId, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock, useFocusTrap, useModalIsolation } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import "./Overlay.css";

export interface DialogProps {
  children: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  description?: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
  preventEscapeClose?: boolean;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg";
  title: ReactNode;
}

export function Dialog({
  children,
  className,
  closeOnOverlayClick = true,
  description,
  initialFocusRef,
  isOpen,
  onClose,
  preventEscapeClose = false,
  showCloseButton = true,
  size = "md",
  title,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = description ? `${titleId}-description` : undefined;
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen, initialFocusRef);
  useBodyScrollLock(isOpen);
  useModalIsolation(isOpen);

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
      data-modal-root="true"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && !preventEscapeClose && event.target === event.currentTarget) onClose();
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
          {showCloseButton ? (
            <Button aria-label="Close dialog" onClick={onClose} size="icon" variant="ghost">
              x
            </Button>
          ) : null}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
