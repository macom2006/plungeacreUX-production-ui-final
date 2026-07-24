import type { ReactNode } from "react";
import { Card } from "./Card";
import "./DataDisplay.css";

export interface RecordField {
  label: string;
  value: ReactNode;
}

export interface MobileRecordCardProps {
  fields: RecordField[];
  overflowActions?: ReactNode;
  primaryAction?: ReactNode;
  status?: ReactNode;
  title: ReactNode;
}

export function MobileRecordCard({
  fields,
  overflowActions,
  primaryAction,
  status,
  title,
}: MobileRecordCardProps) {
  return (
    <Card className="mobile-record-card">
      <div className="mobile-record-card__header">
        <h3>{title}</h3>
        {status}
      </div>
      <dl>
        {fields.map((field) => (
          <div key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
      {(primaryAction || overflowActions) ? (
        <div className="mobile-record-card__actions">
          {primaryAction}
          {overflowActions}
        </div>
      ) : null}
    </Card>
  );
}
