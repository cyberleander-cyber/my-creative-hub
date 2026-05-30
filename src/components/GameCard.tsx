import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { findBoxart, type GameEntry } from "@/lib/github.functions";
import { BookOpen } from "lucide-react";

export function GameCard({ game }: { game: GameEntry }) {
  const findBoxartFn = useServerFn(findBoxart);
  const { data } = useQuery({
    queryKey: ["boxart", game.displayName],
    queryFn: () => findBoxartFn({ data: { title: game.displayName } }),
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  const img = data?.imageUrl;

  return (
    <Link
      to="/tool/$id"
      params={{ id: encodeURIComponent(game.id) }}
      className="group block overflow-hidden rounded-lg border bg-card transition hover:border-primary hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={game.displayName}
            className="h-full w-full object-cover transition group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => ((e.currentTarget.style.display = "none"))}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <BookOpen className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-foreground">{game.displayName}</h3>
        <p className="truncate text-xs text-muted-foreground">{game.path}</p>
      </div>
    </Link>
  );
}
