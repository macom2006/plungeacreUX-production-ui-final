import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { useFormField } from "./FormField";
import "./Form.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: "none" | "vertical" | "both";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    required,
    resize = "vertical",
    ...props
  },
  ref,
) {
  const field = useFormField();
  const resolvedRequired = required ?? field?.required;

  return (
    <textarea
      aria-describedby={props["aria-describedby"] ?? field?.describedBy}
      aria-invalid={props["aria-invalid"] ?? (field?.isInvalid || undefined)}
      className={cn(
        "textarea",
        `textarea--resize-${resize}`,
        field?.isInvalid && "textarea--invalid",
        field?.isSuccess && "textarea--success",
        className,
      )}
      id={props.id ?? field?.id}
      ref={ref}
      required={resolvedRequired}
      {...props}
    />
  );
});
