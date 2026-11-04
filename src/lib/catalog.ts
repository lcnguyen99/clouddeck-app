import data from '@/data/aws-services.json';

export type Level = 'Beginner' | 'Intermediate' | 'Expert';

export type Certification = {
  id: string;
  code: string;
  name: string;
  tier: 'Foundational' | 'Associate' | 'Professional' | 'Specialty';
};

export type Category = {
  id: string;
  name: string;
  /** Short label drawn on the placeholder icon. */
  abbr: string;
  color: string;
  description: string;
};

export type Service = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  level: Level;
  definition: string;
  usedFor: string[];
  scenario: { company: string; story: string };
  certifications: string[];
};

export const LEVELS = data.levels as Level[];
export const CERTIFICATIONS = data.certifications as Certification[];
export const CATEGORIES = data.categories as Category[];
export const SERVICES = data.services as Service[];

const categoryById = new Map(CATEGORIES.map((c) => [c.id, c]));
const serviceById = new Map(SERVICES.map((s) => [s.id, s]));
const certById = new Map(CERTIFICATIONS.map((c) => [c.id, c]));

export const getCategory = (id: string) => categoryById.get(id);
export const getService = (id: string) => serviceById.get(id);
export const getCertification = (id: string) => certById.get(id);

export const LEVEL_COLORS: Record<Level, string> = {
  Beginner: '#16A34A',
  Intermediate: '#D97706',
  Expert: '#DC2626',
};

export type Filters = {
  query: string;
  levels: Level[];
  certs: string[];
};

export const EMPTY_FILTERS: Filters = { query: '', levels: [], certs: [] };

export const hasActiveFilters = (f: Filters) =>
  f.query.trim() !== '' || f.levels.length > 0 || f.certs.length > 0;

/** Level and certification filters are OR within a group, AND across groups. */
export function filterServices(services: Service[], f: Filters): Service[] {
  const q = f.query.trim().toLowerCase();
  return services.filter((s) => {
    if (f.levels.length && !f.levels.includes(s.level)) return false;
    if (f.certs.length && !s.certifications.some((c) => f.certs.includes(c))) return false;
    if (q) {
      const haystack = `${s.name} ${s.shortName} ${s.definition}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export const servicesInCategory = (categoryId: string) =>
  SERVICES.filter((s) => s.category === categoryId);
