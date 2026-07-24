import { useId, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./DataDisplay.css";

export interface TooltipProps {
  children: ReactNode;
  className?: string;
  content: ReactNode;
}

export function Tooltip({ children, className, content }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("tooltip", className)}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined} className="tooltip__trigger" tabIndex={0}>
        {children}
      </span>
      {open ? (
        <span className="tooltip__content" id={id} role="tooltip">
          {content}
        </span>
      ) : null}
    </span>
  );
}
