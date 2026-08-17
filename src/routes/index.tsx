import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { BRANDS, CATEGORIES, DISCLAIMER, SCOOTERS } from "@/data/scooters";
import { ScooterCard } from "@/components/ScooterCard";
import { useVersion } from "@/lib/prefs";

const QUICK = [
  { label: "🏙️ Stadt", search: { kategorie: "stadt" } },
  { label: "🏕️ Offroad", search: { kategorie: "offroad" } },
  { label: "🛣️ Pendler", search: { kategorie: "pendler" } },
  { label: "⚡ Schnell", search: { kategorie: "schnell" } },
  { label: "🔋 Große Reichweite", search: { kategorie: "reichweite" } },
  { label: "💰 Preis-Leistung", search: { kategorie: "preis-leistung" } },
  { label: "🪶 Leicht", search: { kategorie: "leicht" } },
  { label: "💪 Leistungsstark", search: { kategorie: "leistung" } },
  { label: "🆕 Neuheiten", search: { q: "" } },
  { label: "🇩🇪 Mit ABE", search: { kategorie: "abe" } },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "E-Scooter Vergleich 2026 – 500+ Modelle finden | scootcompare" },
      {
        name: "description",
        content:
          "Vergleiche über 500 E-Scooter nach Geschwindigkeit, Leistung, Reichweite, Preis, Gewicht, Einsatzgebiet und ABE. Mit Finder, Filtern und Vergleichstabelle.",
      },
      { property: "og:title", content: "E-Scooter Vergleich – finde den Scooter, der zu dir passt" },
      {
        name: "og:description",
        content: "500+ E-Scooter filtern, vergleichen und den passenden finden – unabhängig und übersichtlich.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [version] = useVersion();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.navigate({ to: "/scooter", search: { q, marke: "", kategorie: "" } });
  };

  const top = [...SCOOTERS].sort((a, b) => b.rating.overall - a.rating.overall).slice(0, 6);

  return (
    <div>
      <section className="hero-bg border-b border-border">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:pb-16 sm:pt-16">
          <span className="chip">
            <Sparkles className="size-3.5 text-primary" /> {SCOOTERS.length}+ Modelle · {BRANDS.length} Marken
          </span>
          <h1 className="mt-4 font-display text-[2rem] font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            Finde den E-Scooter,
            <br />
            der wirklich zu dir passt.
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-lg">
            Vergleiche über {SCOOTERS.length} E-Scooter nach Geschwindigkeit, Leistung, Reichweite, Preis,
            Gewicht, Einsatzgebiet und vielen weiteren Kriterien.
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-2 sm:flex-row">
            <label className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)] sm:rounded-full">
              <Search className="size-5 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="E-Scooter, Marke oder Modell suchen…"
                className="w-full bg-transparent text-base outline-none"
              />
            </label>
            <button type="submit" className="btn-primary hover:btn-primary-hover justify-center py-3.5">
              Suchen
            </button>
          </form>

          <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {QUICK.map((t) => (
              <Link
                key={t.label}
                to="/scooter"
                search={{ q: "", marke: "", kategorie: "", ...t.search }}
                className="chip shrink-0"
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link to="/finder" className="btn-primary hover:btn-primary-hover justify-center py-4 text-base">
              Finde meinen E-Scooter <ArrowRight className="size-4" />
            </Link>
            <Link to="/scooter" search={{ q: "", marke: "", kategorie: "" }} className="btn-ghost justify-center py-4">
              Alle {SCOOTERS.length} Modelle ansehen
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">Kategorien</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const n = SCOOTERS.filter(c.filter).length;
            return (
              <Link
                key={c.slug}
                to="/scooter"
                search={{ q: "", marke: "", kategorie: c.slug }}
                className="card-base flex items-center justify-between gap-3 p-4 transition-transform hover:-translate-y-0.5"
              >
                <span className="text-sm font-bold">{c.label}</span>
                <span className="chip shrink-0">{n}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-xl font-extrabold sm:text-2xl">Top bewertete Modelle</h2>
          <Link to="/scooter" search={{ q: "", marke: "", kategorie: "" }} className="text-sm font-semibold text-primary">
            Alle ansehen
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((s) => (
            <ScooterCard key={s.id} scooter={s} version={version} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">Marken</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {BRANDS.map((b) => (
            <Link key={b.slug} to="/marken/$brand" params={{ brand: b.slug }} className="chip">
              {b.name} <span className="text-muted-foreground">{b.count}</span>
            </Link>
          ))}
        </div>
        <p className="mt-8 rounded-xl border border-border bg-surface-2 p-3 text-[11px] text-muted-foreground">
          {DISCLAIMER}
        </p>
      </section>
    </div>
  );
}
