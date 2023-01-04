import Section from "../components/Section";
import LibraryScan from "../components/settings/LibraryScan";

export default function SettingsPage() {
  return (
    <div className="settings page">
      <h1 className="pageTitle">Settings</h1>
      <div className="settingsContent pageContent">
        <Section title="Library">
          <LibraryScan />
        </Section>
      </div>
    </div>
  );
}
