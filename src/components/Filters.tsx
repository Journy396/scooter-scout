import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { BRANDS, USE_CASES, valueScore, type Scooter, type VersionKey } from "@/data/scooters";

export interface FilterState {
  q: string;
  brands: string[];
  priceMin: number;
  priceMax: number;
  speedMin: number;
  rangeMin: number;
  powerMin: number;
  weightMax: number;
  motors: number[];
  useCases: string[];
  tireTypes: string[];
  tireSizes: number[];
  suspension: string[];
  brakes: string[];
  abs: boolean;
  removableBattery: boolean;
  fastCharge: boolean;
  whMin: number;
  sizeClasses: string[];
  features: string[];
  versions: VersionKey[];
  sort: string;
}

export const EMPTY: FilterState = {
  q: "",
  brands: [],
  priceMin: 0,
  priceMax: 7000,
  speedMin: 0,
  rangeMin: 0,
  powerMin: 0,
  weightMax: 60,
  motors: [],
  useCases: [],
  tireTypes: [],
  tireSizes: [],
  suspension: [],
  brakes: [],
  abs: false,
  removableBattery: false,
  fastCharge: false,
  whMin: 0,
  sizeClasses: [],
  features: [],
  versions: [],
  sort: "empfehlung",
};

export const FEATURES: { key: keyof Scooter; label: string }[] = [
  { key: "display", label: "Display" },
  { key: "app", label: "App" },
  { key: "bluetooth", label: "Bluetooth" },
  { key: "nfc", label: "NFC" },
  { key: "indicators", label: "Blinker" },
  { key: "brakeLight", label: "Bremslicht" },
  { key: "horn", label: "Hupe" },
  { key: "lights", label: "Licht" },
  { key: "usb", label: "USB" },
  { key: "alarm", label: "Alarmanlage" },
  { key: "cruiseControl", label: "Tempomat" },
];

export const SORTS = [
  { key: "empfehlung", label: "Empfehlung" },
  { key: "preis-auf", label: "Preis aufsteigend" },
  { key: "preis-ab", label: "Preis absteigend" },
  { key: "reichweite", label: "Reichweite" },
  { key: "speed", label: "Geschwindigkeit" },
  { key: "leistung", label: "Motorleistung" },
  { key: "gewicht", label: "Gewicht" },
  { key: "bewertung", label: "Bewertung" },
  { key: "neu", label: "Neueste Modelle" },
  { key: "pl", label: "Preis-Leistung" },
];

export function matchesQuery(s: Scooter, q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  const tokens = t.split(/\s+/);
  return tokens.every((tok) => {
    if (tok === "abe") return s.abe;
    if (tok === "offroad") return s.useCases.includes("Offroad");
    const under = /^unter(\d+)?$/.exec(tok);
    if (under?.[1]) return s.price < Number(under[1]);
    const km = /^(\d+)km$/.exec(tok);
    if (km) return s.range >= Number(km[1]);
    if (/^\d+$/.test(tok)) {
      const n = Number(tok);
      return s.name.toLowerCase().includes(tok) || s.price <= n || s.range >= n;
    }
    return `${s.brand} ${s.model} ${s.useCases.join(" ")}`.toLowerCase().includes(tok);
  });
}

export function applyFilters(all: Scooter[], f: FilterState) {
  const out = all.filter((s) => {
    if (!matchesQuery(s, f.q)) return false;
    if (f.brands.length && !f.brands.includes(s.brand)) return false;
    if (s.price < f.priceMin || s.price > f.priceMax) return false;
    if ((s.topSpeed.free ?? 0) < f.speedMin) return false;
    if (s.range < f.rangeMin) return false;
    if ((s.motorPower.free ?? 0) < f.powerMin) return false;
    if (s.weight > f.weightMax) return false;
    if (f.motors.length && !f.motors.includes(s.motors)) return false;
    if (f.useCases.length && !f.useCases.some((u) => s.useCases.includes(u))) return false;
    if (f.tireTypes.length && !f.tireTypes.includes(s.tireType)) return false;
    if (f.tireSizes.length && !f.tireSizes.includes(Math.round(s.tireSize))) return false;
    if (f.suspension.length && !f.suspension.includes(s.suspension)) return false;
    if (f.brakes.length && !f.brakes.some((b) => s.brakes.toLowerCase().includes(b.toLowerCase()))) return false;
    if (f.abs && !s.abs) return false;
    if (f.removableBattery && !s.removableBattery) return false;
    if (f.fastCharge && !s.fastCharge) return false;
    if (s.batteryWh < f.whMin) return false;
    if (f.sizeClasses.length && !f.sizeClasses.includes(s.sizeClass)) return false;
    if (f.features.some((key) => !s[key as keyof Scooter])) return false;
    if (f.versions.length && !f.versions.some((v) => s.availableVersions.includes(v))) return false;
    return true;
  });

  const sorted = [...out];
  switch (f.sort) {
    case "preis-auf": sorted.sort((a, b) => a.price - b.price); break;
    case "preis-ab": sorted.sort((a, b) => b.price - a.price); break;
    case "reichweite": sorted.sort((a, b) => b.range - a.range); break;
    case "speed": sorted.sort((a, b) => (b.topSpeed.free ?? 0) - (a.topSpeed.free ?? 0)); break;
    case "leistung": sorted.sort((a, b) => b.peakPower - a.peakPower); break;
    case "gewicht": sorted.sort((a, b) => a.weight - b.weight); break;
    case "bewertung": sorted.sort((a, b) => b.rating.overall - a.rating.overall); break;
    case "neu": sorted.sort((a, b) => b.year - a.year); break;
    case "pl": sorted.sort((a, b) => valueScore(b) - valueScore(a)); break;
    default:
      sorted.sort((a, b) => b.rating.overall * 100 + valueScore(b) - (a.rating.overall * 100 + valueScore(a)));
  }
  return sorted;
}

function Section({ title, children, open: initial = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [open, setOpen] = useState(initial);
  return (
    <div className="border-b border-border py-3">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-sm font-bold">
        {title}
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Chips<T extends string | number>({
  options,
  selected,
  onToggle,
  suffix = "",
}: {
  options: T[];
  selected: T[];
  onToggle: (v: T) => void;
  suffix?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button key={String(o)} onClick={() => onToggle(o)} className={`chip ${selected.includes(o) ? "chip-active" : ""}`}>
          {o}
          {suffix}
        </button>
      ))}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs font-semibold">
        <span>{label}</span>
        <span className="text-primary">
          {value} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--primary)]"
      />
    </label>
  );
}

export function FilterPanel({ f, set }: { f: FilterState; set: (n: FilterState) => void }) {
  const toggle = <K extends keyof FilterState>(key: K, value: FilterState[K] extends (infer U)[] ? U : never) => {
    const arr = f[key] as unknown as unknown[];
    set({ ...f, [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] } as FilterState);
  };

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between pb-2">
        <p className="font-display font-extrabold">Filter</p>
        <button onClick={() => set({ ...EMPTY, q: f.q, sort: f.sort })} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
          Zurücksetzen
        </button>
      </div>

      <Section title="Preis" open>
        <div className="flex gap-2">
          <input
            type="number"
            value={f.priceMin || ""}
            placeholder="Min €"
            onChange={(e) => set({ ...f, priceMin: Number(e.target.value) || 0 })}
            className="w-full rounded-lg border border-border bg-surface-2 px-2 py-1.5"
          />
          <input
            type="number"
            value={f.priceMax === 7000 ? "" : f.priceMax}
            placeholder="Max €"
            onChange={(e) => set({ ...f, priceMax: Number(e.target.value) || 7000 })}
            className="w-full rounded-lg border border-border bg-surface-2 px-2 py-1.5"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { l: "unter 400 €", a: 0, b: 400 },
            { l: "400–700 €", a: 400, b: 700 },
            { l: "700–1.000 €", a: 700, b: 1000 },
            { l: "1.000–2.000 €", a: 1000, b: 2000 },
            { l: "über 2.000 €", a: 2000, b: 7000 },
          ].map((p) => (
            <button
              key={p.l}
              onClick={() => set({ ...f, priceMin: p.a, priceMax: p.b })}
              className={`chip ${f.priceMin === p.a && f.priceMax === p.b ? "chip-active" : ""}`}
            >
              {p.l}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Zulassung / Version" open>
        <Chips
          options={["abe", "eu", "us", "free"] as VersionKey[]}
          selected={f.versions}
          onToggle={(v) => toggle("versions", v as never)}
        />
        <p className="text-[11px] text-muted-foreground">
          ABE-Versionen sind auf 20 km/h und 500 W Dauerleistung begrenzt.
        </p>
      </Section>

      <Section title="Geschwindigkeit (offene Version)">
        <Slider label="mindestens" value={f.speedMin} min={0} max={110} step={5} unit="km/h" onChange={(n) => set({ ...f, speedMin: n })} />
        <Chips options={[20, 45, 60, 80, 100]} selected={[]} onToggle={(n) => set({ ...f, speedMin: n })} suffix="+ km/h" />
      </Section>

      <Section title="Reichweite">
        <Slider label="mindestens" value={f.rangeMin} min={0} max={140} step={5} unit="km" onChange={(n) => set({ ...f, rangeMin: n })} />
        <Chips options={[30, 50, 80, 120]} selected={[]} onToggle={(n) => set({ ...f, rangeMin: n })} suffix="+ km" />
      </Section>

      <Section title="Leistung & Motoren">
        <Slider label="Dauerleistung ab" value={f.powerMin} min={0} max={4000} step={100} unit="W" onChange={(n) => set({ ...f, powerMin: n })} />
        <Chips options={[1, 2]} selected={f.motors} onToggle={(n) => toggle("motors", n as never)} suffix=" Motor(en)" />
      </Section>

      <Section title="Gewicht">
        <Slider label="maximal" value={f.weightMax} min={10} max={60} step={1} unit="kg" onChange={(n) => set({ ...f, weightMax: n })} />
      </Section>

      <Section title="Einsatzgebiet">
        <Chips options={USE_CASES} selected={f.useCases} onToggle={(v) => toggle("useCases", v as never)} />
      </Section>

      <Section title="Reifen">
        <Chips options={["Luftreifen", "Tubeless", "Vollgummi"]} selected={f.tireTypes} onToggle={(v) => toggle("tireTypes", v as never)} />
        <Chips options={[8, 9, 10, 11, 12, 13]} selected={f.tireSizes} onToggle={(v) => toggle("tireSizes", v as never)} suffix=" Zoll" />
      </Section>

      <Section title="Federung">
        <Chips
          options={["Keine", "Vorderrad", "Hinterrad", "Vollfederung", "Hydraulisch"]}
          selected={f.suspension}
          onToggle={(v) => toggle("suspension", v as never)}
        />
      </Section>

      <Section title="Bremsen">
        <Chips
          options={["Trommel", "Scheibe", "Hydraulisch", "E-Bremse"]}
          selected={f.brakes}
          onToggle={(v) => toggle("brakes", v as never)}
        />
        <Toggle label="ABS" value={f.abs} onChange={(v) => set({ ...f, abs: v })} />
      </Section>

      <Section title="Akku">
        <Slider label="Kapazität ab" value={f.whMin} min={0} max={3000} step={100} unit="Wh" onChange={(n) => set({ ...f, whMin: n })} />
        <Toggle label="entnehmbarer Akku" value={f.removableBattery} onChange={(v) => set({ ...f, removableBattery: v })} />
        <Toggle label="Schnellladen" value={f.fastCharge} onChange={(v) => set({ ...f, fastCharge: v })} />
      </Section>

      <Section title="Größe">
        <Chips
          options={["kompakt", "klein", "mittel", "groß"]}
          selected={f.sizeClasses}
          onToggle={(v) => toggle("sizeClasses", v as never)}
        />
      </Section>

      <Section title="Ausstattung">
        <div className="flex flex-wrap gap-1.5">
          {FEATURES.map((ft) => (
            <button
              key={ft.key as string}
              onClick={() => toggle("features", ft.key as never)}
              className={`chip ${f.features.includes(ft.key as string) ? "chip-active" : ""}`}
            >
              {ft.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Marke">
        <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
          {BRANDS.map((b) => (
            <label key={b.slug} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 hover:bg-surface-2">
              <input
                type="checkbox"
                checked={f.brands.includes(b.name)}
                onChange={() => toggle("brands", b.name as never)}
                className="accent-[var(--primary)]"
              />
              <span className="flex-1">{b.name}</span>
              <span className="text-xs text-muted-foreground">{b.count}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--primary)]" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function MobileFilterButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-ghost w-full lg:hidden">
      <SlidersHorizontal className="size-4" />
      Filter{count > 0 ? ` (${count})` : ""}
    </button>
  );
}

export function MobileFilterSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative ml-auto h-full w-[92%] max-w-sm overflow-y-auto bg-background p-4 pb-24">
        <button onClick={onClose} className="mb-2 ml-auto flex size-9 items-center justify-center rounded-full border border-border">
          <X className="size-4" />
        </button>
        {children}
        <div className="sticky bottom-0 mt-4 bg-background pt-2">
          <button onClick={onClose} className="btn-primary w-full">
            Ergebnisse anzeigen
          </button>
        </div>
      </div>
    </div>
  );
}

export function useActiveFilterCount(f: FilterState) {
  return useMemo(() => {
    let n = 0;
    const keys = Object.keys(EMPTY) as (keyof FilterState)[];
    for (const k of keys) {
      if (k === "q" || k === "sort") continue;
      const a = f[k];
      const b = EMPTY[k];
      if (Array.isArray(a)) n += a.length ? 1 : 0;
      else if (a !== b) n += 1;
    }
    return n;
  }, [f]);
}
