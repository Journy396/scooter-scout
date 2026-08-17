import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, SCOOTERS, fmtPrice } from "@/data/scooters";

export const Route = createFileRoute("/kategorien")({
  head: () => ({
    meta: [
      { title: "E-Scooter Kategorien – Stadt, Pendler, Offroad, Premium | scootcompare" },
      {
        name: "description",
        content:
          "Die besten E-Scooter je Einsatzgebiet: Stadt, Pendeln, Offroad, schnellste Modelle, größte Reichweite, unter 500 € und Premium.",
      },
      { property: "og:title", content: "E-Scooter Kategorien" },
      { property: "og:description", content: "Beste E-Scooter je Einsatzgebiet und Budget auf einen Blick." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Kategorien</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((c) => {
          const top = SCOOTERS.filter(c.filter).sort(c.sort).slice(0, 3);
          return (
            <section key={c.slug} className="card-base p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-base font-extrabold">{c.label}</h2>
                <Link
                  to="/scooter"
                  search={{ q: "", marke: "", kategorie: c.slug }}
                  className="chip shrink-0 !text-xs"
                >
                  Alle
                </Link>
              </div>
              <ol className="mt-3 space-y-2">
                {top.map((s, i) => (
                  <li key={s.id} className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm">
                    <span className="font-bold text-muted-foreground">{i + 1}</span>
                    <Link to="/scooter/$id" params={{ id: s.id }} className="flex-1 truncate font-semibold hover:text-primary">
                      {s.name}
                    </Link>
                    <span className="text-xs font-bold">{fmtPrice(s.price)}</span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
