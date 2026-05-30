import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchGitHubGames } from "@/lib/github.functions";
import { loadSettings, type RepoSettings } from "@/lib/settings";
import { ArrowLeft, ExternalLink, Maximize2 } from "lucide-react";

export const Route = createFileRoute("/tool/$id")({
  head: () => ({
    meta: [{ title: "Tool — MathTools" }],
  }),
  component: ToolPage,
});

function ToolPage() {
  const { id } = Route.useParams();
  const decoded = decodeURIComponent(id);
  const [settings, setSettings] = useState<RepoSettings | null>(null);
  const fetchFn = useServerFn(fetchGitHubGames);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const { data, isLoading } = useQuery({
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

  const game = data?.games.find((g) => g.id === decoded);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-6">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to tools
        </Link>

        {isLoading && <p className="text-muted-foreground">Loading…</p>}

        {!isLoading && !game && (
          <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
            Tool not found.
          </div>
        )}

        {game && (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {game.displayName}
              </h1>
              <div className="flex items-center gap-2">
                <a
                  href={game.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
                </a>
                <a
                  href={game.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Source
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-black">
              <iframe
                src={game.embedUrl}
                title={game.displayName}
                className="h-[calc(100vh-220px)] min-h-[500px] w-full"
                allow="autoplay; fullscreen; gamepad; microphone; camera; clipboard-read; clipboard-write; gyroscope; accelerometer; xr-spatial-tracking"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals allow-downloads"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
