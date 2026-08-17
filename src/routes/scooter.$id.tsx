import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Heart, Scale, ArrowLeft } from "lucide-react";
import { DISCLAIMER, SCOOTERS, byId, fmt, fmtPrice, VERSIONS } from "@/data/scooters";
import { ScooterImage, Stars, VersionPicker, ScooterCard } from "@/components/ScooterCard";
import { useCompare, useFavorites, useHydrated, useRecent, useVersion } from "@/lib/prefs";

export const Route = createFileRoute("/scooter/$id")({
  loader: ({ params }) => {
    const s = byId(params.id);
    if (!s) throw notFound();
    return { name: s.name, brand: s.brand };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Modell nicht gefunden | scootcompare" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} – technische Daten & Vergleich | scootcompare`;
    const description = `Alle Daten zum ${loaderData.name}: Geschwindigkeit pro Version, Motorleistung, Akku, Reichweite, Bremsen, Federung, Ausstattung und ABE-Status.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: DetailPage,
});

function DetailPage() {
  const { id } = Route.useParams();
  const s = byId(id)!;
  const [version, setVersion] = useVersion();
  const fav = useFavorites();
  const cmp = useCompare();
  const recent = useRecent();
  const hydrated = useHydrated();

  useEffect(() => {
    recent.push(s.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.id]);

  const v = s.availableVersions.includes(version) ? version : "free";
  const similar = SCOOTERS.filter(
    (x) => x.id !== s.id && Math.abs(x.price - s.price) < 250 && x.brand !== s.brand,
  ).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link to="/scooter" search={{ q: "", marke: "", kategorie: "" }} className="chip mb-4">
        <ArrowLeft className="size-3.5" /> Zurück zur Übersicht
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <ScooterImage scooter={s} className="h-56 w-full sm:h-80" />
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{s.brand}</p>
          <h1 className="font-display text-2xl font-extrabold sm:text-4xl">{s.model}</h1>
          <div className="mt-2 flex items-center gap-3">
            <p className="font-display text-2xl font-extrabold">{fmtPrice(s.price)}</p>
            <Stars value={s.rating.overall} />
            <span className="chip">{s.year}</span>
          </div>

          <div
            className={`mt-4 rounded-xl border p-3 text-sm font-bold ${
              s.abe ? "border-primary/40 bg-primary/10 text-primary" : "border-warning/40 bg-warning/10 text-warning"
            }`}
          >
            {s.abe ? "🇩🇪 ABE laut Hersteller vorgesehen – 20 km/h, max. 500 W" : "⚠️ Keine deutsche ABE"}
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Version für Daten & Vergleich wählen:</p>
            <VersionPicker value={v} onChange={setVersion} available={s.availableVersions} size="md" />
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={() => cmp.toggle(s.id)} className={`chip flex-1 justify-center ${hydrated && cmp.has(s.id) ? "chip-active" : ""}`}>
              <Scale className="size-4" /> {hydrated && cmp.has(s.id) ? "Im Vergleich" : "+ Zum Vergleich"}
            </button>
            <button onClick={() => fav.toggle(s.id)} className={`chip flex-1 justify-center ${hydrated && fav.has(s.id) ? "chip-active" : ""}`}>
              <Heart className="size-4" /> {hydrated && fav.has(s.id) ? "Favorit" : "♡ Favorisieren"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Block title="Geschwindigkeit je Version">
          <ul className="space-y-2">
            {VERSIONS.map((ver) => (
              <li key={ver.key} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-sm">
                <span>{ver.label}</span>
                <span className="font-bold">
                  {s.availableVersions.includes(ver.key) ? fmt(s.topSpeed[ver.key], "km/h") : "Nicht bekannt"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Werte verschiedener Versionen werden nicht vermischt. Unbekannte Angaben werden als „Nicht bekannt“
            gekennzeichnet.
          </p>
        </Block>

        <Block title="Leistung">
          <Rows
            rows={[
              ["Motoranzahl", `${s.motors}`],
              ["Dauerleistung (gewählte Version)", fmt(s.motorPower[v], "W")],
              ["Peak-Leistung", `${s.peakPower} W`],
              ["Drehmoment", "Nicht bekannt"],
              ["Steigfähigkeit", `${s.climbAngle} %`],
            ]}
          />
        </Block>

        <Block title="Akku">
          <Rows
            rows={[
              ["Spannung", `${s.batteryVoltage} V`],
              ["Kapazität", `${s.batteryAh} Ah`],
              ["Energie", `${s.batteryWh} Wh`],
              ["Ladezeit", `ca. ${s.chargingTime} h`],
              ["Reichweite (Herstellerangabe, Platzhalter)", `${s.range} km`],
              ["entnehmbar", s.removableBattery ? "Ja" : "Nein"],
              ["Schnellladen", s.fastCharge ? "Ja" : "Nein"],
              ["Technologie", "Li-Ion (Zelltyp nicht bekannt)"],
            ]}
          />
        </Block>

        <Block title="Abmessungen & Gewicht">
          <Rows
            rows={[
              ["Maße", s.dimensions],
              ["zusammengeklappt", s.foldedDimensions],
              ["Trittbrettlänge", `${s.deckLength} cm`],
              ["Lenkerhöhe", `${s.handlebarHeight} cm`],
              ["Gewicht", `${s.weight} kg`],
              ["max. Zuladung", `${s.maxLoad} kg`],
              ["Größenklasse", s.sizeClass],
            ]}
          />
        </Block>

        <Block title="Fahrwerk & Bremsen">
          <Rows
            rows={[
              ["Federung", s.suspension],
              ["Reifen", `${s.tireType}, ${s.tireSize} Zoll`],
              ["Bremsen", s.brakes],
              ["ABS", s.abs ? "Ja" : "Nein"],
              ["Wasserschutz", s.waterproofRating],
            ]}
          />
        </Block>

        <Block title="Ausstattung">
          <div className="flex flex-wrap gap-1.5">
            {[
              ["Licht", s.lights],
              ["Blinker", s.indicators],
              ["Bremslicht", s.brakeLight],
              ["Display", s.display],
              ["App", s.app],
              ["Bluetooth", s.bluetooth],
              ["NFC", s.nfc],
              ["Hupe", s.horn],
              ["USB", s.usb],
              ["Tempomat", s.cruiseControl],
              ["Alarm", s.alarm],
            ].map(([label, has]) => (
              <span key={label as string} className={`chip ${has ? "chip-active" : "opacity-50"}`}>
                {has ? "✓" : "–"} {label as string}
              </span>
            ))}
          </div>
        </Block>

        <Block title="Bewertung">
          <Rows
            rows={[
              ["Gesamt", `⭐ ${s.rating.overall.toFixed(1).replace(".", ",")}/5`],
              ["Leistung", stars(s.rating.performance)],
              ["Reichweite", stars(s.rating.range)],
              ["Komfort", stars(s.rating.comfort)],
              ["Qualität", stars(s.rating.quality)],
              ["Preis-Leistung", stars(s.rating.value)],
              ["Ausstattung", stars(s.rating.features)],
            ]}
          />
        </Block>

        <Block title="Vor- & Nachteile">
          <ul className="space-y-1 text-sm">
            {s.pros.map((p) => (
              <li key={p}>✅ {p}</li>
            ))}
            {s.cons.map((c) => (
              <li key={c}>⚠️ {c}</li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Einsatzgebiete: {s.useCases.join(", ")} · Datenstatus: Platzhalter, nicht gegen Herstellerangaben geprüft.
          </p>
        </Block>
      </div>

      <p className="mt-6 rounded-xl border border-border bg-surface-2 p-3 text-[11px] text-muted-foreground">
        {DISCLAIMER}
      </p>

      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-extrabold">Ähnliche Modelle</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((x) => (
              <ScooterCard key={x.id} scooter={x} version={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const stars = (n: number) => "⭐".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card-base p-4">
      <h2 className="mb-3 font-display text-base font-extrabold">{title}</h2>
      {children}
    </section>
  );
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-border text-sm">
      {rows.map(([k, val]) => (
        <div key={k} className="flex items-center justify-between gap-3 py-2">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="text-right font-semibold">{val}</dd>
        </div>
      ))}
    </dl>
  );
}
