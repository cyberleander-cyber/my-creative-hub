import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { GameCard } from "@/components/GameCard";
import { fetchGitHubGames } from "@/lib/github.functions";
import { loadSettings, type RepoSettings } from "@/lib/settings";
import { Loader2, Search } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MathTools — Study utilities" },
      { name: "description", content: "Interactive math and study tools for the classroom." },
    ],
  }),
  component: Home,
});

function Home() {
  const [settings, setSettings] = useState<RepoSettings | null>(null);
  const [query, setQuery] = useState("");
  const fetchFn = useServerFn(fetchGitHubGames);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["games", settings],
    queryFn: () =>
      fetchFn({
        data: {
          owner: settings!.owner,
          repo: settings!.repo,
          branch: settings!.branch,
          path: settings!.path,
        },
      }),
    enabled: !!settings,
    staleTime: 1000 * 60 * 5,
  });

  const games = data?.games || [];
  const filtered = query
    ? games.filter((g) => g.displayName.toLowerCase().includes(query.toLowerCase()))
    : games;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Study Tools</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Interactive utilities synced from your library.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-2 rounded-md border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading tools…
          </div>
        )}

        {!isLoading && (isError || data?.error) && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            Couldn't load library: {data?.error || "Unknown error"}. Check the repo in{" "}
            <a href="/settings" className="underline">Settings</a> — it must be a public repo.
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="rounded-md border bg-card p-8 text-center text-sm text-muted-foreground">
            No tools found. Add an <code>.html</code> file (or a folder with{" "}
            <code>index.html</code>) to your repo and refresh.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </main>
    </div>
  );
}
