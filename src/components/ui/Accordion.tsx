import { useId, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Accordion.css";

export interface AccordionItem {
  content: ReactNode;
  id: string;
  title: string;
}

export interface AccordionProps {
  allowMultiple?: boolean;
  className?: string;
  defaultOpenIds?: string[];
  items: AccordionItem[];
}

export function Accordion({
  allowMultiple = true,
  className,
  defaultOpenIds = [],
  items,
}: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpenIds));

  const toggleItem = (id: string) => {
    setOpenIds((current) => {
      const next = new Set(allowMultiple ? current : []);

      if (current.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return (
    <div className={cn("accordion", className)}>
      {items.map((item) => {
        const open = openIds.has(item.id);
        const buttonId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <section className="accordion__item" key={item.id}>
            <h3 className="accordion__heading">
              <button
                aria-controls={panelId}
                aria-expanded={open}
                className="accordion__trigger"
                id={buttonId}
                onClick={() => toggleItem(item.id)}
                type="button"
              >
                <span>{item.title}</span>
                <span aria-hidden="true" className="accordion__icon">
                  {open ? "-" : "+"}
                </span>
              </button>
            </h3>
            <div
              aria-labelledby={buttonId}
              className="accordion__panel"
              hidden={!open}
              id={panelId}
              role="region"
            >
              {item.content}
            </div>
          </section>
        );
      })}
    </div>
  );
}
