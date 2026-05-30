import { createServerFn } from "@tanstack/react-start";

export type GameEntry = {
  id: string;
  name: string;
  displayName: string;
  embedUrl: string; // raw HTML from GitHub Pages-style or jsdelivr CDN
  sourceUrl: string; // human-readable GitHub page
  path: string;
};

function prettifyName(raw: string): string {
  return raw
    .replace(/\.html?$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export const fetchGitHubGames = createServerFn({ method: "POST" })
  .inputValidator((data: { owner: string; repo: string; branch?: string; path?: string }) => data)
  .handler(async ({ data }) => {
    const { owner, repo } = data;
    const branch = data.branch || "main";
    const path = data.path || "";

    try {
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const res = await fetch(apiUrl, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "mathtools-app" },
      });

      if (!res.ok) {
        return { games: [] as GameEntry[], error: `GitHub: ${res.status} ${res.statusText}` };
      }

      const items = (await res.json()) as Array<{
        name: string;
        path: string;
        type: "dir" | "file";
        download_url: string | null;
        html_url: string;
      }>;

      const games: GameEntry[] = [];

      // Files: any .html at this level (skip readme-style names like index at root only? include all)
      for (const item of items) {
        if (item.type === "file" && /\.html?$/i.test(item.name)) {
          games.push({
            id: item.path,
            name: item.name,
            displayName: prettifyName(item.name),
            embedUrl: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${item.path}`,
            sourceUrl: item.html_url,
            path: item.path,
          });
        }
      }

      // Folders: check if folder contains an index.html
      const folderChecks = items
        .filter((i) => i.type === "dir")
        .map(async (dir) => {
          try {
            const subRes = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contents/${dir.path}?ref=${branch}`,
              { headers: { Accept: "application/vnd.github+json", "User-Agent": "mathtools-app" } },
            );
            if (!subRes.ok) return null;
            const subItems = (await subRes.json()) as Array<{ name: string; path: string; type: string }>;
            const index = subItems.find(
              (s) => s.type === "file" && /^index\.html?$/i.test(s.name),
            );
            if (!index) return null;
            return {
              id: dir.path,
              name: dir.name,
              displayName: prettifyName(dir.name),
              embedUrl: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${index.path}`,
              sourceUrl: `https://github.com/${owner}/${repo}/tree/${branch}/${dir.path}`,
              path: dir.path,
            } as GameEntry;
          } catch {
            return null;
          }
        });

      const folderResults = await Promise.all(folderChecks);
      for (const g of folderResults) if (g) games.push(g);

      return { games, error: null as string | null };
    } catch (err) {
      console.error("fetchGitHubGames failed", err);
      return { games: [] as GameEntry[], error: "Failed to reach GitHub" };
    }
  });

export const findBoxart = createServerFn({ method: "POST" })
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) return { imageUrl: null as string | null, error: "Firecrawl not configured" };

    try {
      const res = await fetch("https://api.firecrawl.dev/v2/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `${data.title} game cover art box art`,
          limit: 5,
          sources: ["images"],
        }),
      });

      if (!res.ok) {
        return { imageUrl: null, error: `Firecrawl: ${res.status}` };
      }
      const json: any = await res.json();
      const images = json?.data?.images || json?.images || [];
      const first = images[0];
      const url = first?.imageUrl || first?.url || first?.src || null;
      return { imageUrl: url as string | null, error: null as string | null };
    } catch (err) {
      console.error("findBoxart failed", err);
      return { imageUrl: null as string | null, error: "Boxart search failed" };
    }
  });
