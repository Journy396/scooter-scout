import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SCOOTERS, CATEGORIES, DISCLAIMER } from "@/data/scooters";
import { ScooterCard, VersionPicker } from "@/components/ScooterCard";
import {
  EMPTY,
  FilterPanel,
  MobileFilterButton,
  MobileFilterSheet,
  SORTS,
  applyFilters,
  useActiveFilterCount,
  type FilterState,
} from "@/components/Filters";
import { useVersion } from "@/lib/prefs";

export const Route = createFileRoute("/scooter/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: String(search["q"] ?? ""),
    marke: String(search["marke"] ?? ""),
    kategorie: String(search["kategorie"] ?? ""),
  }),
  head: () => ({
    meta: [
      { title: "Alle E-Scooter vergleichen – 500+ Modelle | scootcompare" },
      {
        name: "description",
        content:
          "Über 500 E-Scooter filtern und vergleichen: Preis, Geschwindigkeit, Reichweite, Leistung, Gewicht, Federung, Bremsen, ABE und Ausstattung.",
      },
      { property: "og:title", content: "Alle E-Scooter vergleichen – 500+ Modelle" },
      { property: "og:description", content: "Filtere E-Scooter nach Preis, Reichweite, Leistung, Gewicht und Zulassung." },
    ],
  }),
  component: ScooterListPage,
});

function ScooterListPage() {
  const { q, marke, kategorie } = Route.useSearch();
  const [version, setVersion] = useVersion();
  const [f, setF] = useState<FilterState>({ ...EMPTY, q, brands: marke ? [marke] : [] });
  const [sheet, setSheet] = useState(false);
  const [limit, setLimit] = useState(24);
  const count = useActiveFilterCount(f);

  const category = CATEGORIES.find((c) => c.slug === kategorie);

  const results = useMemo(() => {
    let base = SCOOTERS;
    if (category) base = base.filter(category.filter).sort(category.sort);
    const r = applyFilters(base, f);
    return category && f.sort === "empfehlung" ? base.filter((s) => r.includes(s)) : r;
  }, [f, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
        {category ? category.label : "Alle E-Scooter"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {results.length} von {SCOOTERS.length} Modellen · Demo-Datenbank (Platzhalterwerte)
      </p>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          value={f.q}
          onChange={(e) => setF({ ...f, q: e.target.value })}
          placeholder="🔍 E-Scooter, Marke oder Modell suchen…"
          className="w-full rounded-full border border-border bg-surface-2 px-4 py-3 text-sm outline-none focus:border-primary"
        />
        <div className="flex gap-2">
          <select
            value={f.sort}
            onChange={(e) => setF({ ...f, sort: e.target.value })}
            className="flex-1 rounded-full border border-border bg-surface-2 px-3 py-3 text-sm lg:w-52"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                Sortieren: {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="lg:w-auto">
          <MobileFilterButton count={count} onClick={() => setSheet(true)} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Daten anzeigen für:</span>
        <VersionPicker value={version} onChange={setVersion} />
      </div>

      <div className="mt-6 flex gap-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            <FilterPanel f={f} set={setF} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.slice(0, limit).map((s) => (
              <ScooterCard key={s.id} scooter={s} version={version} />
            ))}
          </div>
          {results.length === 0 && (
            <p className="card-base p-8 text-center text-sm text-muted-foreground">
              Keine Modelle gefunden. Setze ein paar Filter zurück.
            </p>
          )}
          {limit < results.length && (
            <button onClick={() => setLimit(limit + 24)} className="btn-ghost mx-auto mt-6 block">
              Weitere {Math.min(24, results.length - limit)} Modelle laden
            </button>
          )}
          <p className="mt-8 rounded-xl border border-border bg-surface-2 p-3 text-[11px] text-muted-foreground">
            {DISCLAIMER}
          </p>
        </div>
      </div>

      <MobileFilterSheet open={sheet} onClose={() => setSheet(false)}>
        <FilterPanel f={f} set={setF} />
      </MobileFilterSheet>
    </div>
  );
}
