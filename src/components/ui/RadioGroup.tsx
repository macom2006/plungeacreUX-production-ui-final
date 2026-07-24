import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Form.css";

export interface RadioOption {
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface RadioGroupProps {
  className?: string;
  description?: ReactNode;
  disabled?: boolean;
  error?: string;
  legend: ReactNode;
  name: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  value?: string;
}

export function RadioGroup({
  className,
  description,
  disabled = false,
  error,
  legend,
  name,
  onChange,
  options,
  value,
}: RadioGroupProps) {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(value ?? "");
  const selectedValue = value ?? internalValue;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;

  const selectValue = (nextValue: string) => {
    setInternalValue(nextValue);
    onChange?.(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const enabledOptions = options
      .map((option, index) => ({ ...option, index }))
      .filter((option) => !option.disabled && !disabled);
    const currentIndex = enabledOptions.findIndex((option) => option.value === selectedValue);
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = currentIndex === -1
      ? 0
      : (currentIndex + direction + enabledOptions.length) % enabledOptions.length;
    const nextOption = enabledOptions[nextIndex];
    if (nextOption) {
      selectValue(nextOption.value);
      inputRefs.current[nextOption.index]?.focus();
    }
  };

  return (
    <fieldset
      aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
      className={cn("radio-group", error && "radio-group--invalid", className)}
    >
      <legend>{legend}</legend>
      {description ? <p id={descriptionId}>{description}</p> : null}
      <div className="radio-group__options" onKeyDown={handleKeyDown}>
        {options.map((option, index) => {
          const id = `${generatedId}-${option.value}`;
          return (
            <div className="choice" key={option.value}>
              <input
                checked={selectedValue === option.value}
                className="choice__input"
                disabled={disabled || option.disabled}
                id={id}
                name={name}
                onChange={() => selectValue(option.value)}
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                type="radio"
                value={option.value}
              />
              <div>
                <label className="choice__label" htmlFor={id}>
                  {option.label}
                </label>
                {option.description ? (
                  <p className="choice__description">{option.description}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      {error ? (
        <p className="form-field__message form-field__message--error" id={errorId}>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
