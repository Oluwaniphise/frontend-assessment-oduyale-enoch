import type { MovieFilters } from "@/types/tmdb";

type RawSearchParams = Record<string, string | string[] | undefined>;

const MIN_YEAR = 1900;
const MAX_PAGE = 500;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function parseMovieFilters(searchParams: RawSearchParams): MovieFilters {
  const page = Math.min(parsePositiveInt(pickFirst(searchParams.page), 1), MAX_PAGE);
  const query = (pickFirst(searchParams.q) ?? "").trim();

  const genreIdRaw = parsePositiveInt(pickFirst(searchParams.genre), 0);
  const genreId = genreIdRaw > 0 ? genreIdRaw : null;

  const currentYear = new Date().getUTCFullYear();
  const yearRaw = parsePositiveInt(pickFirst(searchParams.year), 0);
  const year = yearRaw >= MIN_YEAR && yearRaw <= currentYear + 1 ? yearRaw : null;

  return {
    page,
    query,
    genreId,
    year,
  };
}

export function filtersToQueryString(filters: MovieFilters): string {
  const params = new URLSearchParams();

  if (filters.query) {
    params.set("q", filters.query);
  }

  if (filters.genreId) {
    params.set("genre", String(filters.genreId));
  }

  if (filters.year) {
    params.set("year", String(filters.year));
  }

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function sanitizeReturnTo(value: string | undefined): string {
  if (!value) {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}
