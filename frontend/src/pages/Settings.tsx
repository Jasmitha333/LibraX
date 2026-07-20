import { useEffect, useRef, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface SettingsData {
  libraryName: string;
  librarian: string;
  email: string;
  phone: string;
  maxBooks: string;
  borrowDays: string;
  finePerDay: string;
}

const defaultSettings: SettingsData = {
  libraryName: "Central Library",
  librarian: "Admin",
  email: "library@gmail.com",
  phone: "9876543210",
  maxBooks: "3",
  borrowDays: "14",
  finePerDay: "10",
};

function Settings() {
  const [settings, setSettings] =
    useState<SettingsData>(() => {
      const data =
        localStorage.getItem("settings");

      return data
        ? JSON.parse(data)
        : defaultSettings;
    });
    const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
  localStorage.setItem(
    "settings",
    JSON.stringify(settings)
  );
}, [settings]);

const saveSettings = () => {
  localStorage.setItem(
    "settings",
    JSON.stringify(settings)
  );

  alert("Settings Saved!");
};
;

const importData = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = JSON.parse(
        event.target?.result as string
      );

      localStorage.setItem(
        "books",
        JSON.stringify(data.books || [])
      );

      localStorage.setItem(
        "members",
        JSON.stringify(data.members || [])
      );

      localStorage.setItem(
        "transactions",
        JSON.stringify(
          data.transactions || []
        )
      );

      localStorage.setItem(
        "settings",
        JSON.stringify(
          data.settings || defaultSettings
        )
      );

      setSettings(
        data.settings ||
          defaultSettings
      );

      window.location.reload();
    } catch {
      alert("Invalid JSON File");
    }
  };

  reader.readAsText(file);
};
const resetLibrary = () => {
  const confirmReset = window.confirm(
    "Are you sure you want to reset the library?\n\nThis will permanently delete all books, members, transactions and settings."
  );

  if (!confirmReset) return;

  localStorage.removeItem("books");
  localStorage.removeItem("members");
  localStorage.removeItem("transactions");
  localStorage.removeItem("settings");

  window.location.reload();
};

const exportData = () => {
  const data = {
    books: JSON.parse(
      localStorage.getItem("books") || "[]"
    ),
    members: JSON.parse(
      localStorage.getItem("members") || "[]"
    ),
    transactions: JSON.parse(
      localStorage.getItem("transactions") || "[]"
    ),
    settings,
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    {
      type: "application/json",
    }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "library-data.json";

  a.click();

  URL.revokeObjectURL(url);
};

return (
  <div className="h-full flex flex-col gap-6">
    <PageHeader
      title="Settings"
      subtitle="Manage library configuration"
    />

    <div className="grid grid-cols-2 gap-6 flex-1">

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-5">
          Library Information
        </h2>

        <div className="space-y-4">

          <Input
            label="Library Name"
            value={settings.libraryName}
            onChange={(e) =>
              setSettings({
                ...settings,
                libraryName: e.target.value,
              })
            }
          />

          <Input
            label="Librarian"
            value={settings.librarian}
            onChange={(e) =>
              setSettings({
                ...settings,
                librarian: e.target.value,
              })
            }
          />

          <Input
            label="Email"
            value={settings.email}
            onChange={(e) =>
              setSettings({
                ...settings,
                email: e.target.value,
              })
            }
          />

          <Input
            label="Phone"
            value={settings.phone}
            onChange={(e) =>
              setSettings({
                ...settings,
                phone: e.target.value,
              })
            }
          />

        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-5">
          Borrow Rules
        </h2>

        <div className="space-y-4">

          <Input
            label="Maximum Books"
            value={settings.maxBooks}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxBooks: e.target.value,
              })
            }
          />

          <Input
            label="Borrow Duration (Days)"
            value={settings.borrowDays}
            onChange={(e) =>
              setSettings({
                ...settings,
                borrowDays: e.target.value,
              })
            }
          />

          <Input
            label="Fine Per Day (₹)"
            value={settings.finePerDay}
            onChange={(e) =>
              setSettings({
                ...settings,
                finePerDay: e.target.value,
              })
            }
          />

        </div>
      </div>

    </div>

    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-5">
        Data Management
      </h2>

      <div className="flex flex-wrap gap-4">

        <Button onClick={exportData}>
  Export Data
</Button>

<Button
  variant="secondary"
  onClick={() =>
    fileInputRef.current?.click()
  }
>
  Import Data
</Button>

<Button
  variant="secondary"
  onClick={resetLibrary}
>
  Reset Library
</Button>

<input
  type="file"
  accept=".json"
  ref={fileInputRef}
  onChange={importData}
  hidden
/>

      </div>
    </div>

    <div className="flex justify-end">
      <Button onClick={saveSettings}>
        Save Settings
      </Button>
    </div>

  </div>
);

}

export default Settings;