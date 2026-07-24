import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useComposedRefs } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import "./Form.css";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  description?: ReactNode;
  indeterminate?: boolean;
  invalid?: boolean;
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    className,
    description,
    indeterminate = false,
    invalid = false,
    label,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = props.id ?? `checkbox-${generatedId}`;
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const composedRef = useComposedRefs(inputRef, ref);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={cn("choice", invalid && "choice--invalid", props.disabled && "choice--disabled", className)} htmlFor={id}>
      <input
        aria-describedby={descriptionId}
        aria-invalid={invalid || undefined}
        aria-labelledby={labelId}
        className="choice__input"
        id={id}
        ref={composedRef}
        type="checkbox"
        {...props}
      />
      <div>
        <span className="choice__label" id={labelId}>
          {label}
        </span>
        {description ? (
          <p className="choice__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
    </label>
  );
});
