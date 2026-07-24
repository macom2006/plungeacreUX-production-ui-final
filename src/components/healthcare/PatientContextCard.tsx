import { Avatar, Card, DescriptionList, Skeleton, type DescriptionListItem } from "../ui";
import "./Healthcare.css";

export interface PatientContext {
  age?: string;
  allergies?: string;
  avatarSrc?: string;
  conditions?: string;
  contactDetails?: string;
  dateOfBirth?: string;
  demographicContext?: string;
  initials?: string;
  name?: string;
  pharmacy?: string;
  pronouns?: string;
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

  const hasPatientContext = Boolean(patient && Object.values(patient).some((value) => Boolean(value)));

  if (!patient || !hasPatientContext) {
    return (
      <Card className={compact ? "patient-context patient-context--compact" : "patient-context"} title="Patient context">
        <p className="patient-context__empty">Patient context not provided.</p>
      </Card>
    );
  }

  const initials = patient.initials ?? getInitials(patient.name) ?? "PC";
  const details: DescriptionListItem[] = [
    patient.dateOfBirth ? { label: "Date of birth", value: patient.dateOfBirth } : undefined,
    patient.age ? { label: "Age", value: patient.age } : undefined,
    patient.pronouns ? { label: "Pronouns", value: patient.pronouns } : undefined,
    patient.demographicContext ? { label: "Demographic context", value: patient.demographicContext } : undefined,
    patient.state ? { label: "State", value: patient.state } : undefined,
    patient.contactDetails ? { label: "Contact details", value: patient.contactDetails } : undefined,
    patient.allergies ? { label: "Allergies", value: patient.allergies } : undefined,
    patient.conditions ? { label: "Conditions", value: patient.conditions } : undefined,
    patient.pharmacy ? { label: "Pharmacy", value: patient.pharmacy } : undefined,
  ].filter(Boolean) as DescriptionListItem[];

  return (
    <Card className={compact ? "patient-context patient-context--compact" : "patient-context"} title="Patient context">
      <div className="patient-context__identity">
        <Avatar
          alt={patient.name ? undefined : "Patient avatar"}
          decorative={Boolean(patient.name)}
          initials={initials}
          size={compact ? "md" : "lg"}
          src={patient.avatarSrc}
        />
        <div>
          <h4>{patient.name ?? "Name not provided"}</h4>
          {patient.dateOfBirth || patient.age ? (
            <p>
              {[patient.dateOfBirth, patient.age].filter(Boolean).join(" - ")}
            </p>
          ) : (
            <p>Date of birth not provided</p>
          )}
        </div>
      </div>
      {details.length > 0 ? (
        <DescriptionList
          columns={compact ? "single" : "multi"}
          density={compact ? "compact" : "standard"}
          items={details}
        />
      ) : (
        <p className="patient-context__empty">Additional patient context not provided.</p>
      )}
    </Card>
  );
}

function getInitials(name?: string) {
  if (!name) return undefined;

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || undefined;
}
