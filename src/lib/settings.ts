export type RepoSettings = {
  owner: string;
  repo: string;
  branch: string;
  path: string;
};

const KEY = "mathtools.repo";

export const DEFAULT_SETTINGS: RepoSettings = {
  owner: "cyberleander-cyber",
  repo: "my-creative-hub",
  branch: "main",
  path: "",
};

export function loadSettings(): RepoSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: RepoSettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
