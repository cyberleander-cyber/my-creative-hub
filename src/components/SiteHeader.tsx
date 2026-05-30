import { Link } from "@tanstack/react-router";
import { Calculator, Settings as SettingsIcon } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Calculator className="h-5 w-5 text-primary" />
          <span className="text-lg tracking-tight">MathTools</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            · Study utilities
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }} activeOptions={{ exact: true }}>
            Tools
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
            About
          </Link>
          <Link to="/settings" className="flex items-center gap-1 text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
            <SettingsIcon className="h-4 w-4" /> Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
