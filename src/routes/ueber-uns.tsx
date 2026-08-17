import { createFileRoute } from "@tanstack/react-router";
import { BRANDS, DISCLAIMER, SCOOTERS } from "@/data/scooters";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über scootcompare – unabhängiger E-Scooter Vergleich" },
      {
        name: "description",
        content:
          "scootcompare ist eine unabhängige Vergleichsplattform für E-Scooter: transparente Daten, klare Filter und ehrliche Hinweise zu Zulassung und Versionen.",
      },
      { property: "og:title", content: "Über scootcompare" },
      { property: "og:description", content: "Unabhängige Vergleichsplattform für E-Scooter – kein Shop." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Über scootcompare</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        scootcompare ist eine unabhängige Vergleichs- und Informationsplattform für E-Scooter – kein Shop. Aktuell
        umfasst die Datenbank {SCOOTERS.length} Modelle von {BRANDS.length} Herstellern und kann jederzeit um weitere
        Marken, Modelle und später E-Bikes oder E-Motorräder erweitert werden.
      </p>

      <h2 className="mt-8 font-display text-xl font-extrabold">Datenqualität – ehrlich gesagt</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Alle technischen Daten, Preise und Zulassungsangaben in dieser Version sind <strong>Demo-/Platzhalterdaten</strong>{" "}
        und keine offiziellen Herstellerangaben. Wir erfinden bewusst keine ABE-Zulassungen, Preise oder Messwerte als
        „gesicherte Fakten“: unbekannte Werte werden als „Nicht bekannt“ ausgewiesen. Die Datenstruktur ist so gebaut,
        dass geprüfte Herstellerdaten Feld für Feld ergänzt werden können.
      </p>

      <h2 className="mt-8 font-display text-xl font-extrabold">Versionen & Recht</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
        <li>🇩🇪 ABE-Version: in Deutschland zulassungsfähig, 20 km/h, max. 500 W Dauerleistung.</li>
        <li>🇪🇺 EU-Version: je Land unterschiedliche Grenzen (häufig 20–25 km/h).</li>
        <li>🇺🇸 US-Version: abweichende Software- und Leistungsfreigaben.</li>
        <li>🌍 Freie/offene Version: nicht für den öffentlichen Straßenverkehr in Deutschland zugelassen.</li>
      </ul>

      <p className="mt-8 rounded-xl border border-border bg-surface-2 p-4 text-xs text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );
}
