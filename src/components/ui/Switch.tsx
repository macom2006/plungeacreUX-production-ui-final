import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Form.css";

export interface SwitchProps {
  checked: boolean;
  className?: string;
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  onChange: (checked: boolean) => void;
}

export function Switch({
  checked,
  className,
  description,
  disabled = false,
  label,
  onChange,
}: SwitchProps) {
  const id = useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const labelId = `${id}-label`;
  const toggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <div className={cn("switch-field", disabled && "switch-field--disabled", className)}>
      <button
        aria-checked={checked}
        aria-describedby={descriptionId}
        aria-labelledby={labelId}
        className="switch-field__control"
        disabled={disabled}
        id={id}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Space" || event.key === "Spacebar") {
            event.preventDefault();
            toggle();
          }
        }}
        role="switch"
        type="button"
      >
        <span aria-hidden="true" />
      </button>
      <div>
        <span className="switch-field__label" id={labelId}>
          {label}
        </span>
        {description ? (
          <p className="switch-field__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
