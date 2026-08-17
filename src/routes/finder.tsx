import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DISCLAIMER, SCOOTERS, fmtPrice, valueScore, type Scooter, type VersionKey } from "@/data/scooters";
import { Stars } from "@/components/ScooterCard";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/finder")({
  head: () => ({
    meta: [
      { title: "E-Scooter Finder – welcher E-Scooter passt zu mir? | scootcompare" },
      {
        name: "description",
        content:
          "Beantworte 6 Fragen und erhalte ein Ranking passender E-Scooter mit nachvollziehbarer Begründung – nach Einsatz, Budget, Gewicht, Version und Leistung.",
      },
      { property: "og:title", content: "E-Scooter Finder – welcher Scooter passt zu mir?" },
      { property: "og:description", content: "6 Fragen, ein Ranking: finde in einer Minute passende E-Scooter." },
    ],
  }),
  component: Finder,
});

type Answers = Record<string, string>;

const QUESTIONS: { id: string; q: string; options: string[] }[] = [
  { id: "use", q: "Wofür möchtest du den Scooter hauptsächlich nutzen?", options: ["Stadt", "Pendeln", "Offroad", "Freizeit", "Lange Strecken", "Sport / Performance"] },
  { id: "priority", q: "Was ist dir am wichtigsten?", options: ["Geschwindigkeit", "Reichweite", "Beschleunigung", "Komfort", "Gewicht", "Preis", "Leistung"] },
  { id: "budget", q: "Wie viel möchtest du ausgeben?", options: ["unter 400 €", "400–700 €", "700–1.000 €", "1.000–2.000 €", "2.000 €+"] },
  { id: "weight", q: "Wie wichtig ist dir ein geringes Gewicht?", options: ["Sehr wichtig", "Wichtig", "Egal"] },
  { id: "version", q: "Welche Version möchtest du?", options: ["🇩🇪 Deutschland / ABE", "🇪🇺 EU-Version", "🇺🇸 US-Version", "🌍 Internationale Version", "Alle Versionen"] },
  { id: "power", q: "Wie viel Leistung möchtest du?", options: ["Einsteiger", "Mittelklasse", "Stark", "High Performance", "Extrem"] },
];

const BUDGET: Record<string, [number, number]> = {
  "unter 400 €": [0, 400],
  "400–700 €": [400, 700],
  "700–1.000 €": [700, 1000],
  "1.000–2.000 €": [1000, 2000],
  "2.000 €+": [2000, 99999],
};
const POWER: Record<string, [number, number]> = {
  Einsteiger: [0, 500],
  Mittelklasse: [500, 1000],
  Stark: [1000, 1800],
  "High Performance": [1800, 3000],
  Extrem: [3000, 99999],
};
const VERSION_MAP: Record<string, VersionKey | null> = {
  "🇩🇪 Deutschland / ABE": "abe",
  "🇪🇺 EU-Version": "eu",
  "🇺🇸 US-Version": "us",
  "🌍 Internationale Version": "free",
  "Alle Versionen": null,
};

function score(s: Scooter, a: Answers) {
  let pts = 0;
  const reasons: string[] = [];
  const add = (n: number, why: string) => {
    pts += n;
    if (n > 0) reasons.push(why);
  };

  const useMap: Record<string, string[]> = {
    Stadt: ["Stadt", "Alltag"],
    Pendeln: ["Pendeln", "Alltag"],
    Offroad: ["Offroad", "Gelände"],
    Freizeit: ["Freizeit"],
    "Lange Strecken": ["Langstrecke"],
    "Sport / Performance": ["Performance", "Racing"],
  };
  const wanted = useMap[a["use"] ?? ""] ?? [];
  if (wanted.some((w) => s.useCases.includes(w))) add(28, `Passend für ${a["use"]}`);

  const [bmin, bmax] = BUDGET[a["budget"] ?? ""] ?? [0, 99999];
  if (s.price >= bmin && s.price <= bmax) add(24, `Im Budget ${a["budget"]}`);
  else if (s.price < bmax * 1.2 && s.price > bmin * 0.8) add(10, "Knapp am Budget");

  const [pmin, pmax] = POWER[a["power"] ?? ""] ?? [0, 99999];
  const cont = s.motorPower.free ?? 0;
  if (cont >= pmin && cont <= pmax) add(16, `Leistungsklasse ${a["power"]}`);

  const v = VERSION_MAP[a["version"] ?? ""] ?? null;
  if (v === null) add(6, "Alle Versionen akzeptiert");
  else if (s.availableVersions.includes(v)) add(14, `${a["version"]} verfügbar`);

  if (a["weight"] === "Sehr wichtig" && s.weight <= 18) add(12, `Nur ${s.weight} kg`);
  else if (a["weight"] === "Wichtig" && s.weight <= 24) add(8, `Moderate ${s.weight} kg`);
  else if (a["weight"] === "Egal") add(4, "Gewicht unwichtig");

  const prio = a["priority"];
  if (prio === "Geschwindigkeit" && (s.topSpeed.free ?? 0) >= 45) add(10, "Hohe Endgeschwindigkeit");
  if (prio === "Reichweite" && s.range >= 60) add(10, `${s.range} km Reichweite`);
  if (prio === "Beschleunigung" && s.peakPower >= 1500) add(10, `${s.peakPower} W Peak`);
  if (prio === "Komfort" && s.suspension !== "Keine") add(10, `Federung: ${s.suspension}`);
  if (prio === "Gewicht" && s.weight <= 20) add(10, "Leichtes Modell");
  if (prio === "Preis" && valueScore(s) > 25) add(10, "Starkes Preis-Leistungs-Verhältnis");
  if (prio === "Leistung" && (s.motorPower.free ?? 0) >= 1000) add(10, "Kräftiger Motor");

  add(Math.round(s.rating.overall * 2), `Bewertung ${s.rating.overall.toFixed(1).replace(".", ",")}/5`);

  return { match: Math.min(99, Math.round((pts / 114) * 100)), reasons: reasons.slice(0, 4) };
}

function Finder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= QUESTIONS.length;

  const results = done
    ? SCOOTERS.map((s) => ({ s, ...score(s, answers) }))
        .sort((a, b) => b.match - a.match)
        .slice(0, 8)
    : [];

  if (done)
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Deine besten Matches</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Basierend auf: {Object.values(answers).join(" · ")}
        </p>
        <button
          onClick={() => {
            setAnswers({});
            setStep(0);
          }}
          className="chip mt-3"
        >
          <RotateCcw className="size-3.5" /> Neu starten
        </button>

        <ol className="mt-6 space-y-3">
          {results.map((r, i) => (
            <li key={r.s.id} className="card-base p-4">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-extrabold text-muted-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase text-muted-foreground">{r.s.brand}</p>
                  <Link to="/scooter/$id" params={{ id: r.s.id }} className="font-bold hover:text-primary">
                    {r.s.model}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{fmtPrice(r.s.price)}</span>
                    <span>{r.s.range} km</span>
                    <span>{r.s.weight} kg</span>
                    <Stars value={r.s.rating.overall} />
                  </div>
                </div>
                <span className="rounded-full bg-primary/15 px-3 py-1 font-display text-sm font-extrabold text-primary">
                  {r.match} %
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {r.reasons.map((why) => (
                  <li key={why} className="chip !text-[11px]">
                    ✓ {why}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-xl border border-border bg-surface-2 p-3 text-[11px] text-muted-foreground">
          {DISCLAIMER}
        </p>
      </div>
    );

  const q = QUESTIONS[step]!;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">
        Frage {step + 1} von {QUESTIONS.length}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-primary transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
      </div>
      <h1 className="mt-6 font-display text-2xl font-extrabold sm:text-3xl">{q.q}</h1>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {q.options.map((o) => (
          <button
            key={o}
            onClick={() => {
              setAnswers({ ...answers, [q.id]: o });
              setStep(step + 1);
            }}
            className="card-base p-4 text-left font-semibold transition-transform hover:-translate-y-0.5 hover:border-primary"
          >
            {o}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="btn-ghost mt-6">
          Zurück
        </button>
      )}
    </div>
  );
}
