"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { fetchGenres, fetchMovies } from "@/features/movies/api/client";
import { EmptyState } from "@/features/movies/components/empty-state";
import { MovieCard } from "@/features/movies/components/movie-card";
import { Pagination } from "@/features/movies/components/pagination";
import { SearchFilters } from "@/features/movies/components/search-filters";
import { filtersToQueryString, parseMovieFilters } from "@/features/movies/utils/query";

export function MovieExplorer() {
  const searchParams = useSearchParams();

  const filters = parseMovieFilters({
    page: searchParams.get("page") ?? undefined,
    q: searchParams.get("q") ?? undefined,
    genre: searchParams.get("genre") ?? undefined,
    year: searchParams.get("year") ?? undefined,
  });

  const genresQuery = useQuery({
    queryKey: ["movie-genres"],
    queryFn: fetchGenres,
  });

  const moviesQuery = useQuery({
    queryKey: ["movies", filters.page, filters.query, filters.genreId, filters.year],
    queryFn: () => fetchMovies(filters),
  });

  if (genresQuery.isError || moviesQuery.isError) {
    return (
      <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900">
        <h2 className="text-lg font-semibold">Could not load movies</h2>
        <p className="mt-2 text-sm">Please refresh the page or verify your TMDB configuration.</p>
      </section>
    );
  }

  if (genresQuery.isLoading || moviesQuery.isLoading) {
    return (
      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="aspect-[2/3] animate-pulse bg-zinc-200" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  const genres = genresQuery.data.genres;
  const moviesResponse = moviesQuery.data;
  const totalPages = Math.max(1, Math.min(moviesResponse.total_pages, 500));
  const currentPage = Math.min(filters.page, totalPages);
  const returnTo = filtersToQueryString({ ...filters, page: currentPage });

  return (
    <>
      <SearchFilters genres={genres} />

      {moviesResponse.results.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {moviesResponse.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} genres={genres} returnTo={returnTo} />
            ))}
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            buildHref={(page) => filtersToQueryString({ ...filters, page })}
          />
        </>
      )}
    </>
  );
}
