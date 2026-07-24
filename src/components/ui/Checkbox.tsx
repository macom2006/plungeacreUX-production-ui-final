import {
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import "./Form.css";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  description?: ReactNode;
  indeterminate?: boolean;
  invalid?: boolean;
  label: ReactNode;
}

export function Checkbox({
  className,
  description,
  indeterminate = false,
  invalid = false,
  label,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = props.id ?? `checkbox-${generatedId}`;
  const descriptionId = description ? `${id}-description` : undefined;
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className={cn("choice", invalid && "choice--invalid", className)}>
      <input
        aria-describedby={descriptionId}
        aria-invalid={invalid || undefined}
        className="choice__input"
        id={id}
        ref={inputRef}
        type="checkbox"
        {...props}
      />
      <div>
        <label className="choice__label" htmlFor={id}>
          {label}
        </label>
        {description ? (
          <p className="choice__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
