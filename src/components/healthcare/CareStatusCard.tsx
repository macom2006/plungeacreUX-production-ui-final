import { Card, StatusBadge, type StatusBadgeTone } from "../ui";
import "./CareStatusCard.css";

export interface CareStatusCardProps {
  description: string;
  status: string;
  tone: StatusBadgeTone;
  title: string;
}

export function CareStatusCard({
  description,
  status,
  title,
  tone,
}: CareStatusCardProps) {
  return (
    <Card className="care-status-card">
      <div className="care-status-card__heading">
        <h3>{title}</h3>
        <StatusBadge tone={tone}>{status}</StatusBadge>
      </div>
      <p>{description}</p>
    </Card>
  );
}
