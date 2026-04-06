"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { TMDBGenre } from "@/types/tmdb";

type SearchFiltersProps = {
  genres: TMDBGenre[];
};

const DEBOUNCE_MS = 400;

function updateQueryParams(
  searchParams: URLSearchParams,
  patch: Record<string, string | null>,
): URLSearchParams {
  const next = new URLSearchParams(searchParams);

  Object.entries(patch).forEach(([key, value]) => {
    if (!value) {
      next.delete(key);
      return;
    }

    next.set(key, value);
  });

  return next;
}

export function SearchFilters({ genres }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");

  const selectedGenre = searchParams.get("genre") ?? "";
  const selectedYear = searchParams.get("year") ?? "";

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQuery = searchParams.get("q") ?? "";

      if (query === currentQuery) {
        return;
      }

      const next = updateQueryParams(new URLSearchParams(searchParams), {
        q: query.trim() || null,
        page: null,
      });

      const href = next.toString() ? `${pathname}?${next.toString()}` : pathname;
      router.replace(href, { scroll: false });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [pathname, query, router, searchParams]);

  const years = useMemo(() => {
    const currentYear = new Date().getUTCFullYear();
    const values: number[] = [];

    for (let year = currentYear; year >= currentYear - 30; year -= 1) {
      values.push(year);
    }

    return values;
  }, []);

  function handleImmediateFilter(key: "genre" | "year", value: string) {
    const next = updateQueryParams(new URLSearchParams(searchParams), {
      [key]: value || null,
      page: null,
    });

    const href = next.toString() ? `${pathname}?${next.toString()}` : pathname;
    router.replace(href, { scroll: false });
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-zinc-900">Search and filter</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Search by title
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Inception"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Genre
          <select
            value={selectedGenre}
            onChange={(event) => handleImmediateFilter("genre", event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900"
          >
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700">
          Release year
          <select
            value={selectedYear}
            onChange={(event) => handleImmediateFilter("year", event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-900"
          >
            <option value="">Any year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}