import { useCallback, useEffect, useState } from "react";
import type { VersionKey } from "@/data/scooters";

const KEYS = {
  fav: "esc.favorites",
  cmp: "esc.compare",
  recent: "esc.recent",
  version: "esc.version",
  theme: "esc.theme",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("esc-prefs", { detail: key }));
  } catch {
    /* ignore */
  }
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(read(key, fallback));
    const onChange = () => setValue(read(key, fallback));
    window.addEventListener("esc-prefs", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("esc-prefs", onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T) => {
      setValue(next);
      write(key, next);
    },
    [key],
  );

  return [value, set] as const;
}

function useList(key: string, limit = 200) {
  const [list, set] = useStored<string[]>(key, []);
  const has = (id: string) => list.includes(id);
  const toggle = (id: string) => set(has(id) ? list.filter((x) => x !== id) : [id, ...list].slice(0, limit));
  const remove = (id: string) => set(list.filter((x) => x !== id));
  const clear = () => set([]);
  const push = (id: string) => set([id, ...list.filter((x) => x !== id)].slice(0, limit));
  return { list, has, toggle, remove, clear, push, set };
}

export const useFavorites = () => useList(KEYS.fav);
export const useCompare = () => useList(KEYS.cmp, 4);
export const useRecent = () => useList(KEYS.recent, 12);

export function useVersion() {
  return useStored<VersionKey>(KEYS.version, "abe");
}

export function useTheme() {
  const [theme, setTheme] = useStored<"dark" | "light">(KEYS.theme, "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return { theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
