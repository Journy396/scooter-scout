/**
 * E-Scooter Demo-Datenbank.
 *
 * WICHTIG: Alle technischen Werte, Preise und Zulassungsangaben in dieser Datei
 * sind DEMO-/PLATZHALTERDATEN (deterministisch generiert) und keine offiziellen
 * Herstellerangaben. Jeder Datensatz ist mit `verified: false` markiert.
 * Die Struktur ist bewusst so gebaut, dass echte Daten pro Modell einfach
 * ergänzt oder überschrieben werden können (siehe `overrides` unten).
 */

export type VersionKey = "abe" | "eu" | "us" | "free";

export const VERSIONS: { key: VersionKey; label: string; short: string }[] = [
  { key: "abe", label: "🇩🇪 Deutschland / ABE", short: "ABE" },
  { key: "eu", label: "🇪🇺 EU-Version", short: "EU" },
  { key: "us", label: "🇺🇸 US-Version", short: "US" },
  { key: "free", label: "🌍 Freie / offene Version", short: "Frei" },
];

export type Unknown = null;

export interface Scooter {
  id: string;
  brand: string;
  model: string;
  name: string;
  year: number;
  price: number;
  image: string;
  /** km/h pro Version – null = nicht bekannt / nicht verfügbar */
  topSpeed: Record<VersionKey, number | null>;
  /** Dauerleistung in W pro Version (ABE gesetzlich max. 500 W) */
  motorPower: Record<VersionKey, number | null>;
  peakPower: number;
  motors: number;
  range: number;
  batteryVoltage: number;
  batteryAh: number;
  batteryWh: number;
  removableBattery: boolean;
  fastCharge: boolean;
  chargingTime: number;
  weight: number;
  maxLoad: number;
  climbAngle: number;
  tireSize: number;
  tireType: "Luftreifen" | "Tubeless" | "Vollgummi";
  suspension: "Keine" | "Vorderrad" | "Hinterrad" | "Vollfederung" | "Hydraulisch";
  brakes: string;
  abs: boolean;
  dimensions: string;
  foldedDimensions: string;
  deckLength: number;
  handlebarHeight: number;
  sizeClass: "kompakt" | "klein" | "mittel" | "groß";
  lights: boolean;
  indicators: boolean;
  brakeLight: boolean;
  display: boolean;
  app: boolean;
  bluetooth: boolean;
  nfc: boolean;
  horn: boolean;
  usb: boolean;
  cruiseControl: boolean;
  alarm: boolean;
  waterproofRating: string;
  abe: boolean;
  availableVersions: VersionKey[];
  useCases: string[];
  rating: {
    overall: number;
    performance: number;
    range: number;
    comfort: number;
    quality: number;
    value: number;
    features: number;
  };
  pros: string[];
  cons: string[];
  /** false = Platzhalterdaten, noch nicht gegen Herstellerangaben geprüft */
  verified: boolean;
}

export const DISCLAIMER =
  "Technische Daten können je nach Version, Land, Softwarestand und Konfiguration abweichen. Prüfe vor dem Kauf die Angaben des Herstellers und die für dein Land geltenden Vorschriften.";

export const USE_CASES = [
  "Stadt",
  "Pendeln",
  "Alltag",
  "Offroad",
  "Gelände",
  "Langstrecke",
  "Performance",
  "Racing",
  "Freizeit",
  "Hügel / Berge",
];

type BrandSeed = {
  name: string;
  country: string;
  priceMin: number;
  priceMax: number;
  series: string[];
  trims?: string[];
  count?: number;
  abeFriendly?: boolean;
  offroad?: boolean;
};

const T = ["", "Pro", "Max", "Plus", "Pro Max"];

const BRAND_SEEDS: BrandSeed[] = [
  {
    name: "NAVEE",
    country: "China",
    priceMin: 349,
    priceMax: 1499,
    abeFriendly: true,
    series: ["S40", "S60", "S65", "S65C", "V25", "V40", "V50", "ST3", "GT3", "XT5", "UT5", "N65"],
    trims: T,
    count: 26,
  },
  {
    name: "Segway-Ninebot",
    country: "USA / China",
    priceMin: 329,
    priceMax: 2499,
    abeFriendly: true,
    series: ["E2", "E45", "F2", "F40", "F65", "D38", "G2", "GT1", "GT2", "P65", "P100", "ZT3"],
    trims: T,
    count: 28,
  },
  {
    name: "Xiaomi",
    country: "China",
    priceMin: 299,
    priceMax: 999,
    abeFriendly: true,
    series: ["Mi 3", "Mi 4", "Mi 4 Lite", "Elite", "5", "Ultra"],
    trims: ["", "Pro", "Max", "Plus", "Pro 2", "Lite"],
    count: 22,
  },
  {
    name: "KuKirin",
    country: "China",
    priceMin: 329,
    priceMax: 1899,
    offroad: true,
    series: ["S1", "S3", "S4", "M4", "M5", "G2", "G3", "G4", "G Max", "H1"],
    trims: T,
    count: 26,
  },
  {
    name: "Teverun",
    country: "China",
    priceMin: 899,
    priceMax: 3999,
    offroad: true,
    series: ["Fighter Eleven", "Fighter Supreme", "Blade Mini", "Blade GT", "Blade X", "Blade 10"],
    trims: T,
    count: 20,
  },
  {
    name: "Dualtron",
    country: "Südkorea",
    priceMin: 1899,
    priceMax: 6499,
    offroad: true,
    series: ["Mini", "City", "Victor", "Thunder", "Storm", "X", "Ultra", "Achilleus"],
    trims: ["", "Pro", "Limited", "Evo", "II"],
    count: 24,
  },
  {
    name: "Kaabo",
    country: "China",
    priceMin: 699,
    priceMax: 4299,
    offroad: true,
    series: ["Mantis", "Mantis King", "Wolf Warrior", "Wolf King", "Skywalker"],
    trims: ["", "Pro", "GT", "GTR", "10"],
    count: 20,
  },
  {
    name: "Apollo",
    country: "Kanada",
    priceMin: 699,
    priceMax: 3499,
    series: ["Air", "City", "Explore", "Ghost", "Phantom", "Pro"],
    trims: ["", "Pro", "2024", "2025", "X"],
    count: 20,
  },
  {
    name: "VMAX",
    country: "Schweiz",
    priceMin: 499,
    priceMax: 2299,
    abeFriendly: true,
    series: ["VX2", "VX4", "VX5", "R25", "R45", "T15"],
    trims: ["", "Pro", "GT", "Extended", "ST"],
    count: 20,
  },
  {
    name: "NIU",
    country: "China",
    priceMin: 399,
    priceMax: 1399,
    abeFriendly: true,
    series: ["KQi1", "KQi2", "KQi3", "KQi 300", "KQi Air", "KQi 100"],
    trims: ["", "Pro", "Max", "Sport", "X"],
    count: 20,
  },
  {
    name: "Inmotion",
    country: "China",
    priceMin: 599,
    priceMax: 3299,
    series: ["S1", "Air", "Climber", "RS", "L9", "M5"],
    trims: ["", "Pro", "Max", "GT"],
    count: 18,
  },
  {
    name: "Nami",
    country: "China",
    priceMin: 2199,
    priceMax: 5499,
    offroad: true,
    series: ["Burn-E", "Klima", "Blast", "Viper"],
    trims: ["", "2 Max", "3", "Pro", "GT"],
    count: 16,
  },
  {
    name: "iScooter",
    country: "China",
    priceMin: 249,
    priceMax: 1199,
    series: ["i9", "i10", "i11", "E9", "E10", "iX3", "iX5", "iX6"],
    trims: ["", "Pro", "Max", "Plus"],
    count: 22,
  },
  {
    name: "EVERCROSS",
    country: "China",
    priceMin: 279,
    priceMax: 1099,
    series: ["EV85", "EV10K", "H5", "H7", "HB24", "HB25", "H9"],
    trims: ["", "Pro", "Max", "Plus"],
    count: 22,
  },
  {
    name: "Rovoron",
    country: "Europa",
    priceMin: 899,
    priceMax: 3499,
    offroad: true,
    series: ["Eagle", "Zephyr", "Rider", "Corsa"],
    trims: ["", "Pro", "GT", "Max", "Sport"],
    count: 16,
  },
  {
    name: "RCB",
    country: "China",
    priceMin: 259,
    priceMax: 999,
    series: ["D7", "D8", "D9", "P10", "P20", "R10", "R20"],
    trims: ["", "Pro", "Max", "Plus"],
    count: 22,
  },
  {
    name: "Joyor",
    country: "Spanien",
    priceMin: 399,
    priceMax: 1799,
    abeFriendly: true,
    series: ["A1", "A3", "A5", "S5", "S8", "S10", "Y8", "Y10"],
    trims: ["", "Pro", "Max"],
    count: 20,
  },
  {
    name: "Ausom",
    country: "China",
    priceMin: 449,
    priceMax: 1699,
    offroad: true,
    series: ["Gallop", "Leopard", "Falcon", "Nomad"],
    trims: ["", "Pro", "Max", "Plus"],
    count: 14,
  },
  {
    name: "RAGE Mechanics",
    country: "Deutschland",
    priceMin: 899,
    priceMax: 3299,
    offroad: true,
    series: ["Hurrikan", "Tornado", "Sirocco", "Monsun"],
    trims: ["", "Pro", "GT", "Max"],
    count: 14,
  },
  {
    name: "Pure Electric",
    country: "UK",
    priceMin: 399,
    priceMax: 1299,
    abeFriendly: true,
    series: ["Air 3", "Air 4", "Advance", "Flex"],
    trims: ["", "Pro", "Max", "Flex"],
    count: 14,
  },
  {
    name: "Acer",
    country: "Taiwan",
    priceMin: 329,
    priceMax: 899,
    abeFriendly: true,
    series: ["ES Series 3", "ES Series 5", "Predator Extreme", "ES Series 1"],
    trims: ["", "Pro", "Advance"],
    count: 12,
  },
  {
    name: "Eleglide",
    country: "China",
    priceMin: 279,
    priceMax: 899,
    series: ["S1", "S3", "D1", "Coozy"],
    trims: ["", "Pro", "Plus"],
    count: 12,
  },
  {
    name: "Beeper",
    country: "Frankreich",
    priceMin: 349,
    priceMax: 1199,
    series: ["Road", "Cross", "Speed", "City"],
    trims: ["", "Pro", "Max"],
    count: 12,
  },
  {
    name: "SoFlow",
    country: "Deutschland",
    priceMin: 349,
    priceMax: 999,
    abeFriendly: true,
    series: ["SO1", "SO2", "SO3", "SO4"],
    trims: ["", "Pro", "Air"],
    count: 12,
  },
  {
    name: "Bluetran",
    country: "China",
    priceMin: 1799,
    priceMax: 4999,
    offroad: true,
    series: ["Lightning", "Phantom", "Challenger"],
    trims: ["", "Pro", "GT", "Max"],
    count: 12,
  },
  {
    name: "Zero",
    country: "China",
    priceMin: 799,
    priceMax: 3499,
    offroad: true,
    series: ["8", "9", "10", "10X", "11X"],
    trims: ["", "Pro", "X"],
    count: 14,
  },
  {
    name: "Iconbit",
    country: "Europa",
    priceMin: 299,
    priceMax: 999,
    series: ["Kick", "Tracer", "Urban"],
    trims: ["", "Pro", "Max"],
    count: 10,
  },
  {
    name: "Trittbrett",
    country: "Deutschland",
    priceMin: 599,
    priceMax: 1499,
    abeFriendly: true,
    series: ["Kalle", "Paul", "Hans"],
    trims: ["", "Pro", "Cargo"],
    count: 9,
  },
  {
    name: "Streetbooster",
    country: "Deutschland",
    priceMin: 399,
    priceMax: 1199,
    abeFriendly: true,
    series: ["One", "Two", "Sirius", "Pegasus"],
    trims: ["", "Pro"],
    count: 8,
  },
  {
    name: "Egret",
    country: "Deutschland",
    priceMin: 599,
    priceMax: 1899,
    abeFriendly: true,
    series: ["Ten", "Pro", "X", "Eight"],
    trims: ["", "V4", "SE"],
    count: 10,
  },
];

/* deterministischer PRNG, damit Demo-Daten stabil bleiben */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rngFor(seed: string) {
  let s = hash(seed);
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <X,>(r: () => number, arr: X[]) => arr[Math.floor(r() * arr.length)]!;
const between = (r: () => number, a: number, b: number, step = 1) =>
  Math.round((a + r() * (b - a)) / step) * step;

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildScooter(brand: BrandSeed, model: string): Scooter {
  const name = `${brand.name} ${model}`;
  const r = rngFor(name);
  const price = between(r, brand.priceMin, brand.priceMax, 10) - 1;
  const priceIdx = (price - brand.priceMin) / Math.max(1, brand.priceMax - brand.priceMin);

  const motors = price > 2600 ? (r() > 0.6 ? 2 : 2) : price > 1500 ? (r() > 0.5 ? 2 : 1) : 1;
  const contPerMotor =
    price < 400 ? 350 : price < 700 ? 500 : price < 1000 ? 800 : price < 2000 ? 1200 : 1800;
  const cont = contPerMotor * motors;
  const peak = Math.round(cont * (1.8 + r() * 0.7) / 50) * 50;

  const abeAllowed = !!brand.abeFriendly && price < 1600 && r() < 0.72;
  const abe = abeAllowed || (price < 900 && r() < 0.3);

  const freeSpeed = Math.min(
    110,
    Math.max(25, Math.round((20 + priceIdx * 45 + (motors > 1 ? 20 : 0) + r() * 12) / 5) * 5),
  );

  const range = Math.round((20 + priceIdx * 90 + (motors > 1 ? 15 : 0) + r() * 15) / 5) * 5;
  const voltage = pick(r, motors > 1 || price > 1800 ? [60, 60, 72, 84] : price > 900 ? [48, 48, 52] : [36, 36, 48]);
  const ah = Math.round((range * (voltage < 48 ? 0.35 : 0.28)) * 10) / 10;
  const wh = Math.round(voltage * ah);
  const weight = Math.round(
    12 + priceIdx * 30 + (motors > 1 ? 12 : 0) + r() * 4,
  );

  const suspension: Scooter["suspension"] =
    price < 400
      ? pick(r, ["Keine", "Vorderrad"])
      : price < 900
        ? pick(r, ["Vorderrad", "Hinterrad", "Vollfederung"])
        : price < 2000
          ? pick(r, ["Vollfederung", "Vollfederung", "Hinterrad"])
          : "Hydraulisch";

  const brakes =
    price < 400
      ? pick(r, ["Trommelbremse vorne + E-Bremse", "E-Bremse + Scheibenbremse hinten"])
      : price < 1000
        ? pick(r, ["Scheibenbremse vorne + hinten", "Scheibenbremse hinten + E-Bremse"])
        : "Hydraulische Scheibenbremse vorne + hinten";

  const tireSize = pick(
    r,
    price < 500 ? [8, 8.5, 9, 10] : price < 1200 ? [9, 10, 10, 11] : [10, 11, 11, 12, 13],
  );
  const tireType: Scooter["tireType"] =
    price < 400 ? pick(r, ["Vollgummi", "Luftreifen"]) : pick(r, ["Luftreifen", "Tubeless", "Tubeless"]);

  const useCases: string[] = [];
  if (weight < 20) useCases.push("Stadt", "Pendeln");
  if (price < 900) useCases.push("Alltag", "Freizeit");
  if (brand.offroad && price > 900) useCases.push("Offroad", "Gelände", "Hügel / Berge");
  if (range >= 70) useCases.push("Langstrecke");
  if (freeSpeed >= 60) useCases.push("Performance");
  if (freeSpeed >= 85) useCases.push("Racing");
  if (useCases.length === 0) useCases.push("Stadt", "Alltag");

  const rate = (base: number) => Math.round(Math.min(5, Math.max(2.6, base + (r() - 0.5) * 0.6)) * 10) / 10;
  const performance = rate(3 + priceIdx * 1.9);
  const rangeScore = rate(3 + (range / 120) * 1.8);
  const comfort = rate(suspension === "Keine" ? 3 : suspension === "Hydraulisch" ? 4.7 : 4);
  const quality = rate(3.3 + priceIdx * 1.4);
  const value = rate(4.4 - priceIdx * 0.8);
  const features = rate(3.2 + priceIdx * 1.5);
  const overall =
    Math.round(((performance + rangeScore + comfort + quality + value + features) / 6) * 10) / 10;

  const availableVersions: VersionKey[] = [];
  if (abe) availableVersions.push("abe");
  availableVersions.push("eu");
  if (r() > 0.45) availableVersions.push("us");
  availableVersions.push("free");

  const euSpeed = Math.min(freeSpeed, 25);

  return {
    id: slug(name),
    brand: brand.name,
    model,
    name,
    year: 2023 + Math.floor(r() * 3),
    price,
    image: "",
    topSpeed: {
      abe: abe ? 20 : null,
      eu: euSpeed,
      us: availableVersions.includes("us") ? Math.min(freeSpeed, 32) : null,
      free: freeSpeed,
    },
    motorPower: {
      // Gesetzliche Grenze für ABE-Fahrzeuge in Deutschland: max. 500 W Dauerleistung
      abe: abe ? Math.min(500, cont) : null,
      eu: Math.min(1000, cont),
      us: availableVersions.includes("us") ? cont : null,
      free: cont,
    },
    peakPower: peak,
    motors,
    range,
    batteryVoltage: voltage,
    batteryAh: ah,
    batteryWh: wh,
    removableBattery: r() > 0.75,
    fastCharge: price > 900 && r() > 0.4,
    chargingTime: Math.round(3 + (wh / 500) * 3),
    weight,
    maxLoad: weight < 20 ? 100 : weight < 30 ? 120 : 150,
    climbAngle: Math.round(10 + priceIdx * 25),
    tireSize,
    tireType,
    suspension,
    brakes,
    abs: price > 1300 && r() > 0.5,
    dimensions: `${between(r, 108, 135)} × ${between(r, 45, 62)} × ${between(r, 110, 132)} cm`,
    foldedDimensions: `${between(r, 108, 135)} × ${between(r, 45, 62)} × ${between(r, 48, 62)} cm`,
    deckLength: between(r, 42, 62),
    handlebarHeight: between(r, 100, 132),
    sizeClass: weight < 16 ? "kompakt" : weight < 22 ? "klein" : weight < 32 ? "mittel" : "groß",
    lights: true,
    indicators: price > 700 && r() > 0.45,
    brakeLight: r() > 0.35,
    display: r() > 0.12,
    app: r() > 0.3,
    bluetooth: r() > 0.35,
    nfc: price > 800 && r() > 0.6,
    horn: r() > 0.4,
    usb: r() > 0.7,
    cruiseControl: r() > 0.35,
    alarm: price > 900 && r() > 0.55,
    waterproofRating: pick(r, ["IP54", "IP55", "IPX4", "IPX5", "Nicht bekannt"]),
    abe,
    availableVersions,
    useCases: [...new Set(useCases)],
    rating: { overall, performance, range: rangeScore, comfort, quality, value, features },
    pros: [
      range >= 60 ? "Große Reichweite für die Klasse" : "Kompakt und alltagstauglich",
      suspension !== "Keine" ? `Federung: ${suspension}` : "Geringes Gewicht",
      abe ? "Straßenzulassung (ABE) laut Hersteller vorgesehen" : "Sportlich ausgelegt",
    ],
    cons: [
      weight > 28 ? "Hohes Gewicht beim Tragen" : "Begrenzte Offroad-Eignung",
      abe ? "In der ABE-Version auf 20 km/h und 500 W begrenzt" : "Keine deutsche ABE",
    ],
    verified: false,
  };
}

function buildAll(): Scooter[] {
  const out: Scooter[] = [];
  for (const brand of BRAND_SEEDS) {
    const trims = brand.trims ?? T;
    const names: string[] = [];
    for (const trim of trims) {
      for (const s of brand.series) {
        const model = trim ? `${s} ${trim}` : s;
        if (!names.includes(model)) names.push(model);
      }
    }
    for (const model of names.slice(0, brand.count ?? 20)) {
      out.push(buildScooter(brand, model));
    }
  }
  return out;
}

export const SCOOTERS: Scooter[] = buildAll();

export const BRANDS = BRAND_SEEDS.map((b) => ({
  name: b.name,
  slug: slug(b.name),
  country: b.country,
  count: SCOOTERS.filter((s) => s.brand === b.name).length,
  priceFrom: Math.min(...SCOOTERS.filter((s) => s.brand === b.name).map((s) => s.price)),
})).sort((a, b) => a.name.localeCompare(b.name));

export const byId = (id: string) => SCOOTERS.find((s) => s.id === id);
export const brandBySlug = (s: string) => BRANDS.find((b) => b.slug === s);

export const speedFor = (s: Scooter, v: VersionKey) => s.topSpeed[v];
export const powerFor = (s: Scooter, v: VersionKey) => s.motorPower[v];
export const fmtPrice = (p: number) => `${p.toLocaleString("de-DE")} €`;
export const fmt = (v: number | null | undefined, unit = "") =>
  v === null || v === undefined ? "Nicht bekannt" : `${v}${unit ? " " + unit : ""}`;

/** Preis-Leistungs-Score (Demo-Heuristik) */
export const valueScore = (s: Scooter) =>
  Math.round(((s.range * 1.5 + (s.topSpeed.free ?? 20) * 2 + s.motorPower.free! / 20) / s.price) * 1000);

export const CATEGORIES = [
  { slug: "stadt", label: "🏙️ Beste E-Scooter für die Stadt", filter: (s: Scooter) => s.useCases.includes("Stadt") && s.weight < 24, sort: (a: Scooter, b: Scooter) => b.rating.overall - a.rating.overall },
  { slug: "pendler", label: "🛣️ Beste E-Scooter für Pendler", filter: (s: Scooter) => s.range >= 45 && s.weight < 30, sort: (a: Scooter, b: Scooter) => b.rating.overall - a.rating.overall },
  { slug: "offroad", label: "🏕️ Beste Offroad-E-Scooter", filter: (s: Scooter) => s.useCases.includes("Offroad"), sort: (a: Scooter, b: Scooter) => b.peakPower - a.peakPower },
  { slug: "schnell", label: "⚡ Schnellste E-Scooter", filter: () => true, sort: (a: Scooter, b: Scooter) => (b.topSpeed.free ?? 0) - (a.topSpeed.free ?? 0) },
  { slug: "leistung", label: "💪 Leistungsstärkste E-Scooter", filter: () => true, sort: (a: Scooter, b: Scooter) => b.peakPower - a.peakPower },
  { slug: "reichweite", label: "🔋 Größte Reichweite", filter: () => true, sort: (a: Scooter, b: Scooter) => b.range - a.range },
  { slug: "unter-500", label: "💰 Beste E-Scooter unter 500 €", filter: (s: Scooter) => s.price < 500, sort: (a: Scooter, b: Scooter) => b.rating.overall - a.rating.overall },
  { slug: "preis-leistung", label: "🔥 Bestes Preis-Leistungs-Verhältnis", filter: () => true, sort: (a: Scooter, b: Scooter) => valueScore(b) - valueScore(a) },
  { slug: "leicht", label: "🪶 Leichte E-Scooter", filter: (s: Scooter) => s.weight <= 18, sort: (a: Scooter, b: Scooter) => a.weight - b.weight },
  { slug: "premium", label: "🏆 Premium E-Scooter", filter: (s: Scooter) => s.price >= 2000, sort: (a: Scooter, b: Scooter) => b.rating.overall - a.rating.overall },
  { slug: "abe", label: "🇩🇪 Beste E-Scooter mit ABE", filter: (s: Scooter) => s.abe, sort: (a: Scooter, b: Scooter) => b.rating.overall - a.rating.overall },
];
