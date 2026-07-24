import {
  createContext,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import "./Form.css";

interface FormFieldContextValue {
  describedBy?: string;
  error?: string;
  id: string;
  isInvalid: boolean;
  isSuccess: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  characterCount?: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  error?: string;
  id?: string;
  label: ReactNode;
  required?: boolean;
  success?: string;
}

export function useFormField() {
  return useContext(FormFieldContext);
}

export function FormField({
  characterCount,
  children,
  className,
  description,
  error,
  id,
  label,
  required = false,
  success,
  ...props
}: FormFieldProps) {
  const generatedId = useId();
  const controlId = id ?? `field-${generatedId}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const successId = success ? `${controlId}-success` : undefined;
  const countId = characterCount ? `${controlId}-count` : undefined;
  const describedBy = [descriptionId, errorId, successId, countId]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <FormFieldContext.Provider
      value={{
        describedBy,
        error,
        id: controlId,
        isInvalid: Boolean(error),
        isSuccess: Boolean(success) && !error,
      }}
    >
      <div className={cn("form-field", className)} {...props}>
        <label className="form-field__label" htmlFor={controlId}>
          {label}
          {required ? (
            <span aria-hidden="true" className="form-field__required">
              *
            </span>
          ) : null}
        </label>
        {description ? (
          <p className="form-field__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
        {children}
        <div className="form-field__meta">
          {error ? (
            <p className="form-field__message form-field__message--error" id={errorId}>
              {error}
            </p>
          ) : null}
          {success && !error ? (
            <p className="form-field__message form-field__message--success" id={successId}>
              {success}
            </p>
          ) : null}
          {characterCount ? (
            <p className="form-field__count" id={countId}>
              {characterCount}
            </p>
          ) : null}
        </div>
      </div>
    </FormFieldContext.Provider>
  );
}
