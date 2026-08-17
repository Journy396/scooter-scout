import { Link } from "@tanstack/react-router";
import { Heart, Scale, Star, Gauge, BatteryCharging, Zap, Weight } from "lucide-react";
import { fmt, fmtPrice, type Scooter, type VersionKey, VERSIONS } from "@/data/scooters";
import { useCompare, useFavorites, useHydrated } from "@/lib/prefs";

export function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <Star className="size-3.5 fill-warning text-warning" />
      <span className="text-xs font-bold">{value.toFixed(1).replace(".", ",")}</span>
      <span className="text-xs text-muted-foreground">/5</span>
    </span>
  );
}

export function VersionPicker({
  value,
  onChange,
  available,
  size = "sm",
}: {
  value: VersionKey;
  onChange: (v: VersionKey) => void;
  available?: VersionKey[];
  size?: "sm" | "md";
}) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto">
      {VERSIONS.map((v) => {
        const disabled = available ? !available.includes(v.key) : false;
        return (
          <button
            key={v.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(v.key)}
            title={disabled ? "Für dieses Modell nicht bekannt" : v.label}
            className={`chip ${value === v.key ? "chip-active" : ""} ${
              disabled ? "opacity-40" : ""
            } ${size === "sm" ? "!px-2.5 !py-1 !text-xs" : ""}`}
          >
            {size === "sm" ? v.short : v.label}
          </button>
        );
      })}
    </div>
  );
}

export function ScooterImage({ scooter, className = "" }: { scooter: Scooter; className?: string }) {
  const initials = scooter.brand.slice(0, 2).toUpperCase();
  return (
    <div
      className={`relative grid place-items-center overflow-hidden rounded-xl bg-surface-2 ${className}`}
    >
      <span className="font-display text-4xl font-extrabold text-muted-foreground/40">{initials}</span>
      <span className="absolute bottom-1 right-2 text-[10px] font-semibold text-muted-foreground/70">
        Bild folgt
      </span>
    </div>
  );
}

export function ScooterCard({ scooter: s, version }: { scooter: Scooter; version: VersionKey }) {
  const fav = useFavorites();
  const cmp = useCompare();
  const hydrated = useHydrated();
  const v: VersionKey = s.availableVersions.includes(version) ? version : "free";
  const speed = s.topSpeed[v];
  const power = s.motorPower[v];

  return (
    <article className="card-base group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      <div className="relative p-3">
        <ScooterImage scooter={s} className="h-36 w-full" />
        <button
          onClick={() => fav.toggle(s.id)}
          aria-label="Favorisieren"
          className="absolute right-5 top-5 grid size-9 place-items-center rounded-full border border-border bg-card/90 backdrop-blur"
        >
          <Heart className={`size-4 ${hydrated && fav.has(s.id) ? "fill-primary text-primary" : ""}`} />
        </button>
        <span
          className={`absolute left-5 top-5 rounded-full px-2 py-1 text-[11px] font-bold ${
            s.abe ? "bg-primary/20 text-primary" : "bg-warning/20 text-warning"
          }`}
        >
          {s.abe ? "🇩🇪 ABE" : "⚠️ Keine ABE"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{s.brand}</p>
          <h3 className="text-base font-bold leading-tight">{s.model}</h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-display text-xl font-extrabold">{fmtPrice(s.price)}</p>
          <Stars value={s.rating.overall} />
        </div>

        <dl className="grid grid-cols-2 gap-2 text-xs">
          <Spec icon={<Gauge className="size-3.5" />} label="Speed" value={fmt(speed, "km/h")} />
          <Spec icon={<BatteryCharging className="size-3.5" />} label="Reichweite" value={`${s.range} km`} />
          <Spec icon={<Zap className="size-3.5" />} label="Motor" value={fmt(power, "W")} />
          <Spec icon={<Weight className="size-3.5" />} label="Gewicht" value={`${s.weight} kg`} />
        </dl>

        <p className="text-[11px] text-muted-foreground">
          Akku: {s.batteryVoltage} V / {s.batteryAh} Ah · Peak {s.peakPower} W · {s.useCases.slice(0, 2).join(", ")}
        </p>

        <div className="mt-auto flex gap-2 pt-1">
          <button
            onClick={() => cmp.toggle(s.id)}
            className={`chip flex-1 justify-center ${hydrated && cmp.has(s.id) ? "chip-active" : ""}`}
          >
            <Scale className="size-3.5" />
            {hydrated && cmp.has(s.id) ? "Im Vergleich" : "Vergleichen"}
          </button>
          <Link
            to="/scooter/$id"
            params={{ id: s.id }}
            className="chip flex-1 justify-center !bg-primary !text-primary-foreground !border-transparent"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-2 px-2 py-1.5">
      <dt className="flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
