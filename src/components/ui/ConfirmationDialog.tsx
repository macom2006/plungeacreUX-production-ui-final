import { useRef, type ReactNode } from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import "./Overlay.css";

export interface ConfirmationDialogProps {
  actionName: string;
  cancelLabel?: string;
  confirmLabel: string;
  consequence: ReactNode;
  isOpen: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: ReactNode;
  tone?: "standard" | "warning" | "danger";
}

export function ConfirmationDialog({
  actionName,
  cancelLabel = "Cancel",
  confirmLabel,
  consequence,
  isOpen,
  loading = false,
  onCancel,
  onConfirm,
  title,
  tone = "standard",
}: ConfirmationDialogProps) {
  const destructive = tone === "danger";
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog
      closeOnOverlayClick={false}
      description={`Confirm ${actionName}`}
      initialFocusRef={cancelRef}
      isOpen={isOpen}
      onClose={onCancel}
      preventEscapeClose={loading}
      showCloseButton={!loading}
      size="sm"
      title={title}
    >
      <div className={`confirmation confirmation--${tone}`}>
        <p>{consequence}</p>
        <div className="confirmation__actions">
          <Button disabled={loading} onClick={onCancel} ref={cancelRef} variant="secondary">
            {cancelLabel}
          </Button>
          <Button
            loading={loading}
            loadingLabel={`Confirming ${actionName}`}
            onClick={onConfirm}
            variant={destructive ? "danger" : tone === "warning" ? "outline" : "primary"}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
