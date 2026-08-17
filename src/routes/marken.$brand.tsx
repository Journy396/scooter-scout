import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { DISCLAIMER, SCOOTERS, brandBySlug } from "@/data/scooters";
import { ScooterCard, VersionPicker } from "@/components/ScooterCard";
import { SORTS, applyFilters, EMPTY } from "@/components/Filters";
import { useVersion } from "@/lib/prefs";

export const Route = createFileRoute("/marken/$brand")({
  loader: ({ params }) => {
    const b = brandBySlug(params.brand);
    if (!b) throw notFound();
    return { name: b.name, count: b.count };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Marke nicht gefunden | scootcompare" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} E-Scooter – alle ${loaderData.count} Modelle | scootcompare`;
    const description = `Alle ${loaderData.name} E-Scooter im Vergleich: Preise, Reichweite, Geschwindigkeit je Version, Leistung, Gewicht und ABE-Status.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: BrandPage,
});

function BrandPage() {
  const { brand } = Route.useParams();
  const b = brandBySlug(brand)!;
  const [version, setVersion] = useVersion();
  const [sort, setSort] = useState("empfehlung");
  const list = applyFilters(
    SCOOTERS.filter((s) => s.brand === b.name),
    { ...EMPTY, sort },
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{b.name} E-Scooter</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {b.country} · {list.length} Modelle in der Demo-Datenbank
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-border bg-surface-2 px-3 py-2.5 text-sm sm:w-56"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              Sortieren: {s.label}
            </option>
          ))}
        </select>
        <VersionPicker value={version} onChange={setVersion} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((s) => (
          <ScooterCard key={s.id} scooter={s} version={version} />
        ))}
      </div>
      <p className="mt-8 rounded-xl border border-border bg-surface-2 p-3 text-[11px] text-muted-foreground">
        {DISCLAIMER}
      </p>
    </div>
  );
}
