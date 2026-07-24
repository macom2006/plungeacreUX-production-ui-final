import { Card, DescriptionList, Skeleton } from "../ui";
import "./Healthcare.css";

export interface PatientContext {
  allergies?: string;
  conditions?: string;
  contactDetails?: string;
  dateOfBirth?: string;
  name?: string;
  pharmacy?: string;
  state?: string;
}

export interface PatientContextCardProps {
  compact?: boolean;
  loading?: boolean;
  patient?: PatientContext;
}

export function PatientContextCard({
  compact = false,
  loading = false,
  patient,
}: PatientContextCardProps) {
  if (loading) return <Skeleton type="card" />;

  const display = patient ?? {};

  return (
    <Card className={compact ? "patient-context patient-context--compact" : "patient-context"} title="Patient context">
      <DescriptionList
        items={[
          { label: "Name", value: display.name ?? "Missing data" },
          { label: "Date of birth", value: display.dateOfBirth ?? "Missing data" },
          { label: "State", value: display.state ?? "Missing data" },
          { label: "Allergies", value: display.allergies ?? "Missing data" },
          { label: "Conditions", value: display.conditions ?? "Missing data" },
          { label: "Pharmacy", value: display.pharmacy ?? "Missing data" },
          { label: "Contact details", value: display.contactDetails ?? "Sensitive data" },
        ]}
      />
    </Card>
  );
}
