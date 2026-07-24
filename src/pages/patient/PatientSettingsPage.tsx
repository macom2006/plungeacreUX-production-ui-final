import { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  FormField,
  Input,
  Select,
  Skeleton,
  Switch,
  type SelectOption,
} from "../../components/ui";
import { patientSettingsFixture, type PatientPageState } from "../../lib/patientFixtures";

const stateOptions: SelectOption[] = [
  { label: "Illinois", value: "IL" },
  { label: "Missouri", value: "MO" },
  { label: "Wisconsin", value: "WI" },
];

export function PatientSettingsPage({ state = "ready" }: { state?: PatientPageState }) {
  const [saved, setSaved] = useState(state === "saved");
  const [secureMessages, setSecureMessages] = useState(true);
  const [careRequestUpdates, setCareRequestUpdates] = useState(true);
  const [comfortableSpacing, setComfortableSpacing] = useState(
    patientSettingsFixture.accessibility.comfortableSpacing,
  );
  const [reduceMotionPreference, setReduceMotionPreference] = useState(
    patientSettingsFixture.accessibility.reduceMotionPreference,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  if (state === "loading") {
    return (
      <section className="patient-page" aria-label="Settings loading">
        <Skeleton type="card" />
        <Skeleton type="card" />
      </section>
    );
  }

  if (state === "error") {
    return (
      <Alert
        description="Settings could not be loaded from the fixture source."
        role="alert"
        title="Settings Could Not Load"
        tone="danger"
      />
    );
  }

  if (state === "permission") {
    return (
      <Alert
        description="This fictional patient account does not have access to the requested settings."
        role="alert"
        title="Permission Needed"
        tone="danger"
      />
    );
  }

  return (
    <form className="patient-page patient-settings" onSubmit={handleSubmit} aria-labelledby="patient-settings-title">
      <div className="patient-page__heading patient-page__heading--split">
        <div>
          <p className="patient-page__kicker">Settings</p>
          <h2 id="patient-settings-title">Patient Preferences</h2>
          <p>
            Review profile, contact, communication, security, and accessibility preferences.
          </p>
        </div>
        <Button type="submit">
          Save Preferences
        </Button>
      </div>

      {saved ? (
        <Alert
          description="Preferences were saved in this local presentation view."
          role="status"
          title="Preferences Saved"
          tone="success"
        />
      ) : null}

      {state === "partial" ? (
        <Alert
          description="Security settings are presentation-only, while profile and preference controls are available."
          role="status"
          title="Partial Data Loaded"
          tone="warning"
        />
      ) : null}

      <div className="patient-page__detail-grid">
        <Card title="Profile">
          <FormField
            description="This name appears in the patient portal preview."
            id="patient-display-name"
            label="Display name"
          >
            <Input defaultValue={patientSettingsFixture.profile.displayName} />
          </FormField>
          <FormField
            description="Used for patient-facing greetings in this fixture."
            id="patient-preferred-name"
            label="Preferred name"
          >
            <Input defaultValue={patientSettingsFixture.profile.preferredName} />
          </FormField>
        </Card>

        <Card title="Contact Information">
          <FormField
            description="Email changes are handled by the existing authentication flow."
            id="patient-email"
            label="Email address"
          >
            <Input defaultValue={patientSettingsFixture.contact.email} readOnly type="email" />
          </FormField>
          <FormField
            description="Fictional phone number for layout and label validation."
            id="patient-phone"
            label="Phone number"
          >
            <Input defaultValue={patientSettingsFixture.contact.phone} type="tel" />
          </FormField>
          <FormField
            description="Used only for display in this local fixture."
            id="patient-state"
            label="State"
          >
            <Select defaultValue="IL" options={stateOptions} />
          </FormField>
        </Card>

        <Card title="Communication Preferences">
          <Checkbox
            checked={secureMessages}
            description="Show secure message reminders in the patient portal."
            label="Secure message reminders"
            onChange={(event) => setSecureMessages(event.currentTarget.checked)}
          />
          <Checkbox
            checked={careRequestUpdates}
            description="Show care request update reminders in the patient portal."
            label="Care request updates"
            onChange={(event) => setCareRequestUpdates(event.currentTarget.checked)}
          />
        </Card>

        <Card title="Security">
          <p className="patient-page__section-copy">
            Password, MFA, and email security changes remain managed by the existing authentication flow.
          </p>
          <div className="patient-settings__security-actions">
            <Button disabled variant="secondary">
              Password Change Unavailable
            </Button>
            <Button disabled variant="secondary">
              MFA Change Unavailable
            </Button>
          </div>
        </Card>

        <Card title="Accessibility Preferences">
          <Switch
            checked={comfortableSpacing}
            description="Increase spacing in dense portal areas where supported."
            label="Comfortable spacing"
            onChange={setComfortableSpacing}
          />
          <Switch
            checked={reduceMotionPreference}
            description="Reduce non-essential motion where supported by the interface."
            label="Reduced motion preference"
            onChange={setReduceMotionPreference}
          />
        </Card>
      </div>
    </form>
  );
}
