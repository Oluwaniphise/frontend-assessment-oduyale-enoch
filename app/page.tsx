import type { Metadata } from "next";
import { MovieExplorer } from "@/features/movies/components/movie-explorer";
import { parseMovieFilters } from "@/features/movies/utils/query";
import { getMovieGenres, getMovies } from "@/lib/tmdb/api";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Checkit Movie Explorer",
  description: "Browse, search, and filter popular movies from TMDB.",
};

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const initialFilters = parseMovieFilters(resolvedSearchParams);

  const [initialGenres, initialMovies] = await Promise.all([
    getMovieGenres(),
    getMovies(initialFilters),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <header className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Checkit</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Movie Content Explorer</h1>
        <p className="max-w-2xl text-zinc-700">
          Discover movies with server-rendered content, shareable search state, and performance-focused rendering.
        </p>
      </header>
      <MovieExplorer
        initialFilters={initialFilters}
        initialGenres={initialGenres}
        initialMovies={initialMovies}
      />
    </main>
  );
}
