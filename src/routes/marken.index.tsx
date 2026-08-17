import { createFileRoute, Link } from "@tanstack/react-router";
import { BRANDS, fmtPrice } from "@/data/scooters";

export const Route = createFileRoute("/marken/")({
  head: () => ({
    meta: [
      { title: "E-Scooter Marken im Überblick | scootcompare" },
      {
        name: "description",
        content:
          "Alle E-Scooter Hersteller im Überblick: NAVEE, Segway-Ninebot, KuKirin, Xiaomi, Teverun, Dualtron, Kaabo, VMAX, NIU und viele mehr.",
      },
      { property: "og:title", content: "E-Scooter Marken im Überblick" },
      { property: "og:description", content: "Hersteller vergleichen und alle Modelle einer Marke ansehen." },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Marken</h1>
      <p className="mt-1 text-sm text-muted-foreground">{BRANDS.length} Hersteller in der Datenbank</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {BRANDS.map((b) => (
          <Link
            key={b.slug}
            to="/marken/$brand"
            params={{ brand: b.slug }}
            className="card-base p-4 transition-transform hover:-translate-y-0.5 hover:border-primary"
          >
            <p className="font-display text-base font-extrabold">{b.name}</p>
            <p className="text-xs text-muted-foreground">{b.country}</p>
            <p className="mt-2 text-xs font-semibold">
              {b.count} Modelle · ab {fmtPrice(b.priceFrom)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
