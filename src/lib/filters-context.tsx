import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { EMPTY_FILTERS, type Filters, type Level } from '@/lib/catalog';

type FiltersApi = {
  filters: Filters;
  setQuery: (q: string) => void;
  toggleLevel: (l: Level) => void;
  toggleCert: (id: string) => void;
  onlyCert: (id: string) => void;
  clear: () => void;
};

const FiltersContext = createContext<FiltersApi | null>(null);

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const api = useMemo<FiltersApi>(
    () => ({
      filters,
      setQuery: (query) => setFilters((f) => ({ ...f, query })),
      toggleLevel: (l) => setFilters((f) => ({ ...f, levels: toggle(f.levels, l) })),
      toggleCert: (id) => setFilters((f) => ({ ...f, certs: toggle(f.certs, id) })),
      onlyCert: (id) => setFilters({ ...EMPTY_FILTERS, certs: [id] }),
      clear: () => setFilters(EMPTY_FILTERS),
    }),
    [filters],
  );

  return <FiltersContext.Provider value={api}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used inside FiltersProvider');
  return ctx;
}
