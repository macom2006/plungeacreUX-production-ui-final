import { forwardRef, type TextareaHTMLAttributes } from "react";
import { mergeIds } from "../../lib/a11y";
import { cn } from "../../lib/cn";
import { useFormField } from "./FormField";
import "./Form.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: "none" | "vertical" | "both";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    id,
    required,
    resize = "vertical",
    ...props
  },
  ref,
) {
  const field = useFormField();
  const describedBy = mergeIds(field?.describedBy, ariaDescribedBy);
  const invalid = field?.isInvalid ? true : ariaInvalid;
  const resolvedRequired = required ?? field?.required;

  return (
    <textarea
      {...props}
      aria-describedby={describedBy}
      aria-invalid={invalid}
      className={cn(
        "textarea",
        `textarea--resize-${resize}`,
        field?.isInvalid && "textarea--invalid",
        field?.isSuccess && "textarea--success",
        className,
      )}
      id={id ?? field?.id}
      ref={ref}
      required={resolvedRequired}
    />
  );
});
