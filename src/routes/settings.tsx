import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type RepoSettings } from "@/lib/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — MathTools" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [s, setS] = useState<RepoSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setS(loadSettings());
  }, []);

  const update = (k: keyof RepoSettings, v: string) => {
    setS((prev) => ({ ...prev, [k]: v }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(s);
    setSaved(true);
    setTimeout(() => window.location.assign("/"), 400);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure the public GitHub repository that holds your HTML utilities.
        </p>

        <div className="mt-6 space-y-4 rounded-lg border bg-card p-6">
          {(["owner", "repo", "branch", "path"] as const).map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium capitalize text-foreground">
                {field === "path" ? "Subfolder (optional)" : field}
              </label>
              <input
                value={s[field]}
                onChange={(e) => update(field, e.target.value)}
                placeholder={field === "branch" ? "main" : ""}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {saved ? "Saved ✓" : "Save"}
          </button>
        </div>

        <div className="mt-6 rounded-md border bg-muted/40 p-4 text-xs text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">How it works</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Repo must be <strong>public</strong> on GitHub.</li>
            <li>Each top-level <code>.html</code> file appears as a tool.</li>
            <li>Or a folder containing <code>index.html</code> becomes a tool.</li>
            <li>Cover art is auto-searched on the web from the tool name.</li>
            <li>Files load via jsDelivr CDN — push to GitHub and refresh.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
