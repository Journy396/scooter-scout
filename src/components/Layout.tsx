import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, Moon, Sun, Heart, Scale, Zap } from "lucide-react";
import { useCompare, useFavorites, useTheme, useHydrated } from "@/lib/prefs";

export const SCOOTER_SEARCH = { q: "", marke: "", kategorie: "" };

const NAV = [
  { to: "/vergleich", label: "Vergleichen" },
  { to: "/finder", label: "Finder" },
  { to: "/marken", label: "Marken" },
  { to: "/kategorien", label: "Kategorien" },
  { to: "/favoriten", label: "Favoriten" },
  { to: "/ueber-uns", label: "Über uns" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const fav = useFavorites();
  const hydrated = useHydrated();
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.navigate({ to: "/scooter", search: { q, marke: "", kategorie: "" } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Zap className="size-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            scoot<span className="text-primary">compare</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <Link
            to="/scooter"
            search={SCOOTER_SEARCH}
            className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "bg-secondary text-foreground" }}
          >
            Alle Scooter
          </Link>
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form onSubmit={submit} className="hidden md:block">
            <label className="flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-2">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Suchen…"
                aria-label="E-Scooter suchen"
                className="w-32 bg-transparent text-sm outline-none xl:w-44"
              />
            </label>
          </form>
          <Link to="/favoriten" className="relative grid size-10 place-items-center rounded-full border border-border bg-surface-2" aria-label="Favoriten">
            <Heart className="size-4" />
            {hydrated && fav.list.length > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {fav.list.length}
              </span>
            )}
          </Link>
          <button onClick={toggle} aria-label="Dark Mode umschalten" className="grid size-10 place-items-center rounded-full border border-border bg-surface-2">
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menü"
            className="grid size-10 place-items-center rounded-full border border-border bg-surface-2 lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-3 lg:hidden">
          <form onSubmit={submit} className="mb-3 flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="E-Scooter, Marke oder Modell suchen…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/scooter"
              search={SCOOTER_SEARCH}
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-sm font-semibold"
            >
              Alle Scooter
            </Link>
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border bg-surface-2 px-3 py-3 text-sm font-semibold"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function CompareBar() {
  const cmp = useCompare();
  const hydrated = useHydrated();
  if (!hydrated || cmp.list.length === 0) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-[var(--shadow-glow)] backdrop-blur-xl">
        <Scale className="size-5 shrink-0 text-primary" />
        <p className="text-sm font-semibold">
          {cmp.list.length} Scooter ausgewählt
          <span className="ml-1 hidden text-muted-foreground sm:inline">(max. 4)</span>
        </p>
        <button onClick={cmp.clear} className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground">
          Leeren
        </button>
        <Link to="/vergleich" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          Jetzt vergleichen
        </Link>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-extrabold">scootcompare</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Die unabhängige Vergleichsplattform für E-Scooter – Daten, Filter und Vergleiche statt Shop.
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">Entdecken</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {NAV.slice(0, 5).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-foreground">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-bold">Rechtlicher Hinweis</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Alle Angaben auf dieser Plattform sind aktuell Demo-/Platzhalterdaten und keine offiziellen
            Herstellerangaben. Technische Daten können je nach Version, Land, Softwarestand und Konfiguration
            abweichen. Prüfe vor dem Kauf die Angaben des Herstellers und die für dein Land geltenden
            Vorschriften. In Deutschland zugelassene Modelle (ABE) sind auf 20 km/h und max. 500 W
            Dauerleistung begrenzt.
          </p>
        </div>
      </div>
    </footer>
  );
}
