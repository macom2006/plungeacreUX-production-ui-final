import { forwardRef, type SelectHTMLAttributes } from "react";
import { mergeIds } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { useFormField } from "./FormField";
import "./Form.css";

export interface SelectOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    className,
    options,
    placeholder,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    id,
    required,
    ...props
  },
  ref,
) {
  const field = useFormField();
  const describedBy = mergeIds(field?.describedBy, ariaDescribedBy);
  const invalid = field?.isInvalid ? true : ariaInvalid;
  const resolvedRequired = required ?? field?.required;

  return (
    <div className={cn("select-wrap", field?.isInvalid && "select-wrap--invalid", className)}>
      <select
        {...props}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        className="select-wrap__select"
        id={id ?? field?.id}
        ref={ref}
        required={resolvedRequired}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});
