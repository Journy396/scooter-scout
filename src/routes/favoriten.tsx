import { createFileRoute, Link } from "@tanstack/react-router";
import { byId, type Scooter } from "@/data/scooters";
import { ScooterCard } from "@/components/ScooterCard";
import { useCompare, useFavorites, useHydrated, useRecent, useVersion } from "@/lib/prefs";

export const Route = createFileRoute("/favoriten")({
  head: () => ({
    meta: [
      { title: "Meine Scooter – Favoriten & Vergleiche | scootcompare" },
      {
        name: "description",
        content:
          "Deine gespeicherten E-Scooter: Favoriten, aktueller Vergleich und zuletzt angesehene Modelle – lokal im Browser gespeichert.",
      },
      { property: "og:title", content: "Meine Scooter – Favoriten & Vergleiche" },
      { property: "og:description", content: "Favoriten und Vergleiche ohne Registrierung speichern." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const fav = useFavorites();
  const cmp = useCompare();
  const recent = useRecent();
  const hydrated = useHydrated();
  const [version] = useVersion();

  if (!hydrated) return <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground">Lädt…</div>;

  const resolve = (ids: string[]) => ids.map(byId).filter(Boolean) as Scooter[];
  const favs = resolve(fav.list);
  const comparing = resolve(cmp.list);
  const recents = resolve(recent.list);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Meine Scooter</h1>
      <p className="mt-1 text-sm text-muted-foreground">Lokal in diesem Browser gespeichert – ohne Registrierung.</p>

      <Group title={`Favoriten (${favs.length})`} items={favs} version={version} />
      <Group title={`Aktueller Vergleich (${comparing.length})`} items={comparing} version={version} />
      <Group title={`Zuletzt angesehen (${recents.length})`} items={recents} version={version} />

      {favs.length === 0 && recents.length === 0 && (
        <Link to="/scooter" search={{ q: "", marke: "", kategorie: "" }} className="btn-primary mt-6">
          Scooter entdecken
        </Link>
      )}
    </div>
  );
}

function Group({ title, items, version }: { title: string; items: Scooter[]; version: ReturnType<typeof useVersion>[0] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-extrabold">{title}</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((s) => (
          <ScooterCard key={s.id} scooter={s} version={version} />
        ))}
      </div>
    </section>
  );
}
