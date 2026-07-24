import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { useFormField } from "./FormField";
import "./Form.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: "none" | "vertical" | "both";
}

export function Textarea({
  className,
  resize = "vertical",
  ...props
}: TextareaProps) {
  const field = useFormField();

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
      {...props}
    />
  );
}
