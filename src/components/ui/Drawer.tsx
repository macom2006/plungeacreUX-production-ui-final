import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock, useFocusTrap } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import "./Overlay.css";

export interface DrawerProps {
  children: ReactNode;
  className?: string;
  description?: ReactNode;
  id?: string;
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
  isOpen,
  onClose,
  position = "right",
  title,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = description ? `${titleId}-description` : undefined;
  const containerRef = useFocusTrap<HTMLElement>(isOpen);
  useBodyScrollLock(isOpen);

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
    <div className="overlay overlay--drawer">
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
