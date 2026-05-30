import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MathTools" },
      { name: "description", content: "About MathTools study utilities." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">About MathTools</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          MathTools is a curated collection of interactive study utilities and
          problem-solving helpers. Each tool is hosted as a small HTML application,
          embeddable in any modern browser. The library is community-maintained
          via an open repository — add a new tool by pushing an HTML file.
        </p>
      </main>
    </div>
  );
}
