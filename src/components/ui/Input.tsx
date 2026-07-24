import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { mergeIds } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { useFormField } from "./FormField";
import "./Form.css";

type InputType = "text" | "email" | "password" | "tel" | "search" | "date" | "number";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  clearLabel?: string;
  leftIcon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  onClear?: () => void;
  rightIcon?: ReactNode;
  type?: InputType;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    clearLabel = "Clear search",
    disabled,
    leftIcon,
    loading = false,
    loadingLabel = "Loading input",
    onClear,
    rightIcon,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    id,
    readOnly,
    required,
    type = "text",
    ...props
  },
  ref,
) {
  const field = useFormField();
  const loadingId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = type === "password" && showPassword ? "text" : type;
  const canClear = type === "search" && onClear && !disabled && !readOnly;
  const endActionCount = [
    loading,
    canClear,
    type === "password",
    Boolean(rightIcon),
  ].filter(Boolean).length;
  const describedBy = mergeIds(field?.describedBy, ariaDescribedBy, loading ? loadingId : undefined);
  const invalid = field?.isInvalid ? true : ariaInvalid;
  const resolvedRequired = required ?? field?.required;

  return (
    <div
      className={cn(
        "form-control",
        Boolean(leftIcon) && "form-control--has-left",
        endActionCount > 0 && "form-control--has-right",
        endActionCount > 0 && `form-control--actions-${Math.min(endActionCount, 4)}`,
        field?.isInvalid && "form-control--invalid",
        field?.isSuccess && "form-control--success",
        disabled && "form-control--disabled",
        className,
      )}
    >
      {leftIcon ? <span className="form-control__icon form-control__icon--left" aria-hidden="true">{leftIcon}</span> : null}
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        className="form-control__input"
        disabled={disabled}
        id={id ?? field?.id}
        readOnly={readOnly}
        ref={ref}
        required={resolvedRequired}
        type={resolvedType}
      />
      <span className="form-control__actions">
        {loading ? (
          <>
            <Spinner decorative size="sm" />
            <span className="sr-only" id={loadingId}>{loadingLabel}</span>
          </>
        ) : null}
        {canClear ? (
          <Button aria-label={clearLabel} className="form-control__action" onClick={onClear} size="icon" variant="ghost">
            x
          </Button>
        ) : null}
        {type === "password" ? (
          <Button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="form-control__action"
            onClick={() => setShowPassword((current) => !current)}
            size="icon"
            variant="ghost"
          >
            {showPassword ? "H" : "V"}
          </Button>
        ) : null}
        {rightIcon ? <span className="form-control__icon" aria-hidden="true">{rightIcon}</span> : null}
      </span>
    </div>
  );
});
