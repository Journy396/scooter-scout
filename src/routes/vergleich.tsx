import { createFileRoute, Link } from "@tanstack/react-router";
import { DISCLAIMER, byId, fmt, fmtPrice, valueScore, type Scooter, type VersionKey } from "@/data/scooters";
import { ScooterImage, Stars, VersionPicker } from "@/components/ScooterCard";
import { useCompare, useHydrated, useVersion } from "@/lib/prefs";
import { useState } from "react";
import { X } from "lucide-react";

export const Route = createFileRoute("/vergleich")({
  head: () => ({
    meta: [
      { title: "E-Scooter Vergleich – bis zu 4 Modelle direkt vergleichen | scootcompare" },
      {
        name: "description",
        content:
          "Vergleiche bis zu vier E-Scooter Seite an Seite: Preis, Reichweite, Geschwindigkeit je Version, Motor, Akku, Bremsen, Federung und ABE.",
      },
      { property: "og:title", content: "E-Scooter direkt vergleichen" },
      { property: "og:description", content: "Bis zu 4 E-Scooter Seite an Seite mit automatischer Bestwert-Markierung." },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  const cmp = useCompare();
  const hydrated = useHydrated();
  const [globalVersion] = useVersion();
  const [versions, setVersions] = useState<Record<string, VersionKey>>({});

  const items = cmp.list.map(byId).filter(Boolean) as Scooter[];
  const vOf = (s: Scooter): VersionKey => {
    const v = versions[s.id] ?? globalVersion;
    return s.availableVersions.includes(v) ? v : "free";
  };

  if (!hydrated) return <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground">Lädt…</div>;

  if (items.length === 0)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-extrabold">Noch keine Scooter im Vergleich</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Füge auf der Übersicht bis zu vier Modelle über „+ Zum Vergleich hinzufügen“ hinzu.
        </p>
        <Link to="/scooter" search={{ q: "", marke: "", kategorie: "" }} className="btn-primary mt-6">
          Zur Scooter-Übersicht
        </Link>
      </div>
    );

  const best = {
    price: Math.min(...items.map((s) => s.price)),
    range: Math.max(...items.map((s) => s.range)),
    speed: Math.max(...items.map((s) => s.topSpeed[vOf(s)] ?? 0)),
    power: Math.max(...items.map((s) => s.peakPower)),
    weight: Math.min(...items.map((s) => s.weight)),
    rating: Math.max(...items.map((s) => s.rating.overall)),
    value: Math.max(...items.map((s) => valueScore(s))),
  };

  const rows: { label: string; value: (s: Scooter) => string; winner?: (s: Scooter) => boolean; badge?: string }[] = [
    { label: "Preis", value: (s) => fmtPrice(s.price), winner: (s) => s.price === best.price, badge: "💰 Günstigster" },
    { label: "Reichweite", value: (s) => `${s.range} km`, winner: (s) => s.range === best.range, badge: "🏆 Beste Reichweite" },
    {
      label: "Geschwindigkeit (gewählte Version)",
      value: (s) => fmt(s.topSpeed[vOf(s)], "km/h"),
      winner: (s) => (s.topSpeed[vOf(s)] ?? 0) === best.speed,
      badge: "⚡ Schnellster",
    },
    { label: "Motor (Dauerleistung)", value: (s) => fmt(s.motorPower[vOf(s)], "W") },
    { label: "Peak-Leistung", value: (s) => `${s.peakPower} W`, winner: (s) => s.peakPower === best.power, badge: "💪 Stärkster" },
    { label: "Motoren", value: (s) => `${s.motors}` },
    { label: "Gewicht", value: (s) => `${s.weight} kg`, winner: (s) => s.weight === best.weight, badge: "🪶 Leichtester" },
    { label: "Akku", value: (s) => `${s.batteryVoltage} V / ${s.batteryAh} Ah (${s.batteryWh} Wh)` },
    { label: "Ladezeit", value: (s) => `ca. ${s.chargingTime} h` },
    { label: "Bremsen", value: (s) => s.brakes },
    { label: "ABS", value: (s) => (s.abs ? "Ja" : "Nein") },
    { label: "Federung", value: (s) => s.suspension },
    { label: "Reifen", value: (s) => `${s.tireType}, ${s.tireSize}″` },
    { label: "ABE", value: (s) => (s.abe ? "✓ vorgesehen (20 km/h / 500 W)" : "✗ keine deutsche ABE") },
    { label: "Steigfähigkeit", value: (s) => `${s.climbAngle} %` },
    { label: "Ausstattung", value: (s) => [s.display && "Display", s.app && "App", s.indicators && "Blinker", s.nfc && "NFC"].filter(Boolean).join(", ") || "Basis" },
    {
      label: "Bewertung",
      value: (s) => `${s.rating.overall.toFixed(1).replace(".", ",")}/5`,
      winner: (s) => s.rating.overall === best.rating,
      badge: "⭐ Beste Bewertung",
    },
    {
      label: "Preis-Leistung",
      value: (s) => `${valueScore(s)} Punkte`,
      winner: (s) => valueScore(s) === best.value,
      badge: "🔥 Bestes P/L",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Vergleich</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} Modelle · Wähle pro Scooter die Version (ABE, EU, US oder frei).
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-background p-2 text-left align-bottom text-xs font-bold text-muted-foreground">
                Kategorie
              </th>
              {items.map((s) => (
                <th key={s.id} className="min-w-[180px] p-2 align-bottom">
                  <div className="card-base relative p-3 text-left">
                    <button
                      onClick={() => cmp.remove(s.id)}
                      aria-label="Entfernen"
                      className="absolute right-2 top-2 grid size-7 place-items-center rounded-full border border-border"
                    >
                      <X className="size-3.5" />
                    </button>
                    <ScooterImage scooter={s} className="h-20 w-full" />
                    <p className="mt-2 text-[11px] font-bold uppercase text-muted-foreground">{s.brand}</p>
                    <Link to="/scooter/$id" params={{ id: s.id }} className="block text-sm font-bold hover:text-primary">
                      {s.model}
                    </Link>
                    <Stars value={s.rating.overall} className="mt-1" />
                    <div className="mt-2">
                      <VersionPicker
                        value={vOf(s)}
                        available={s.availableVersions}
                        onChange={(v) => setVersions({ ...versions, [s.id]: v })}
                      />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <th className="sticky left-0 z-10 bg-background p-2 text-left text-xs font-semibold text-muted-foreground">
                  {r.label}
                </th>
                {items.map((s) => {
                  const win = r.winner?.(s) && items.length > 1;
                  return (
                    <td
                      key={s.id}
                      className={`border-b border-border p-2 font-semibold ${
                        win ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      {r.value(s)}
                      {win && r.badge && <span className="ml-1 block text-[10px] font-bold">{r.badge}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 rounded-xl border border-border bg-surface-2 p-3 text-[11px] text-muted-foreground">
        {DISCLAIMER}
      </p>
    </div>
  );
}
