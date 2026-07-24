import { useState, type InputHTMLAttributes, type ReactNode } from "react";
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
  onClear?: () => void;
  rightIcon?: ReactNode;
  type?: InputType;
}

export function Input({
  className,
  clearLabel = "Clear search",
  disabled,
  leftIcon,
  loading = false,
  onClear,
  rightIcon,
  type = "text",
  ...props
}: InputProps) {
  const field = useFormField();
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = type === "password" && showPassword ? "text" : type;
  const canClear = type === "search" && onClear && !disabled && !props.readOnly;

  return (
    <div
      className={cn(
        "form-control",
        Boolean(leftIcon) && "form-control--has-left",
        Boolean(rightIcon || loading || canClear || type === "password") && "form-control--has-right",
        field?.isInvalid && "form-control--invalid",
        field?.isSuccess && "form-control--success",
        disabled && "form-control--disabled",
        className,
      )}
    >
      {leftIcon ? <span className="form-control__icon form-control__icon--left" aria-hidden="true">{leftIcon}</span> : null}
      <input
        aria-describedby={props["aria-describedby"] ?? field?.describedBy}
        aria-invalid={props["aria-invalid"] ?? (field?.isInvalid || undefined)}
        className="form-control__input"
        disabled={disabled}
        id={props.id ?? field?.id}
        type={resolvedType}
        {...props}
      />
      <span className="form-control__actions">
        {loading ? <Spinner decorative size="sm" /> : null}
        {canClear ? (
          <Button aria-label={clearLabel} onClick={onClear} size="icon" variant="ghost">
            x
          </Button>
        ) : null}
        {type === "password" ? (
          <Button
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((current) => !current)}
            size="icon"
            variant="ghost"
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        ) : null}
        {rightIcon ? <span className="form-control__icon" aria-hidden="true">{rightIcon}</span> : null}
      </span>
    </div>
  );
}
