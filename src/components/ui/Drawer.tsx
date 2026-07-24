import { useEffect, useId, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock, useFocusTrap, useModalIsolation } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import "./Overlay.css";

export interface DrawerProps {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  id?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
  position?: "left" | "right" | "bottom";
  title: ReactNode;
}

export function Drawer({
  children,
  className,
  description,
  id,
  initialFocusRef,
  isOpen,
  onClose,
  position = "right",
  title,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = description ? `${titleId}-description` : undefined;
  const containerRef = useFocusTrap<HTMLElement>(isOpen, initialFocusRef);
  useBodyScrollLock(isOpen);
  useModalIsolation(isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="overlay overlay--drawer" data-modal-root="true">
      <aside
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn("drawer", `drawer--${position}`, className)}
        id={id}
        ref={containerRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="drawer__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </div>
          <Button aria-label="Close drawer" onClick={onClose} size="icon" variant="ghost">
            x
          </Button>
        </div>
        <div className="drawer__body">{children}</div>
      </aside>
    </div>,
    document.body,
  );
}
