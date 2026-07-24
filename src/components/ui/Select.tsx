import type { SelectHTMLAttributes } from "react";
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

export function Select({
  className,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const field = useFormField();

  return (
    <div className={cn("select-wrap", field?.isInvalid && "select-wrap--invalid", className)}>
      <select
        aria-describedby={props["aria-describedby"] ?? field?.describedBy}
        aria-invalid={props["aria-invalid"] ?? (field?.isInvalid || undefined)}
        className="select-wrap__select"
        id={props.id ?? field?.id}
        {...props}
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
}
