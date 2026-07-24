import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { mergeIds, useComposedRefs } from "../../lib/a11y";
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
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    disabled,
    id: providedId,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = providedId ?? `checkbox-${generatedId}`;
  const labelId = `${id}-label`;
  const descriptionId = description ? `${id}-description` : undefined;
  const describedBy = mergeIds(descriptionId, ariaDescribedBy);
  const resolvedInvalid = invalid ? true : ariaInvalid;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const composedRef = useComposedRefs(inputRef, ref);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={cn("choice", invalid && "choice--invalid", disabled && "choice--disabled", className)} htmlFor={id}>
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={resolvedInvalid}
        aria-labelledby={labelId}
        className="choice__input"
        disabled={disabled}
        id={id}
        ref={composedRef}
        type="checkbox"
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
