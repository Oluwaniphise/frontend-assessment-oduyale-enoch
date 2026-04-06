"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { fetchMovieById } from "@/features/movies/api/client";
import { formatDate, formatRuntime } from "@/features/movies/utils/format";
import { getPosterUrl, hasPoster } from "@/lib/tmdb/image";
import type { TMDBMovieDetails } from "@/types/tmdb";

type MovieDetailClientProps = {
  movieId: number;
  returnTo: string;
};

export function MovieDetailClient({ movieId, returnTo }: MovieDetailClientProps) {
  const query = useQuery({
    queryKey: ["movie-detail", movieId],
    queryFn: () => fetchMovieById(movieId),
  });

  if (query.isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-zinc-200" />
        <section className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-[280px_1fr] md:p-6">
          <div className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-200" />
          <div className="space-y-3">
            <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
            <div className="h-24 w-full animate-pulse rounded bg-zinc-200" />
          </div>
        </section>
      </main>
    );
  }

  if (query.isError || !query.data) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Could not load movie</h1>
        <p className="mt-2 text-zinc-700">Please go back and try again.</p>
      </main>
    );
  }

  const movie: TMDBMovieDetails = query.data;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-600">
        <ol className="flex items-center gap-2">
          <li>
            <Link href={returnTo} className="hover:text-zinc-900 hover:underline">
              Movies
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-zinc-900">{movie.title}</li>
        </ol>
      </nav>

      <article className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-[280px_1fr] md:p-6">
        <div className="relative mx-auto aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-xl bg-zinc-100">
          {hasPoster(movie.poster_path) ? (
            <Image
              src={getPosterUrl(movie.poster_path, "w500")}
              alt={`${movie.title} poster`}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-zinc-600">
              Poster unavailable
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Movie detail</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">{movie.title}</h1>
          {movie.tagline ? <p className="mt-2 text-zinc-600">{movie.tagline}</p> : null}

          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm text-zinc-700 md:grid-cols-3">
            <div>
              <dt className="font-medium text-zinc-500">Release date</dt>
              <dd>{formatDate(movie.release_date)}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Runtime</dt>
              <dd>{formatRuntime(movie.runtime)}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Rating</dt>
              <dd>{movie.vote_average.toFixed(1)} ({movie.vote_count.toLocaleString()} votes)</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Language</dt>
              <dd>{movie.original_language.toUpperCase()}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Status</dt>
              <dd>{movie.status}</dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-500">Genres</dt>
              <dd>{movie.genres.map((genre) => genre.name).join(", ") || "N/A"}</dd>
            </div>
          </dl>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-zinc-900">Overview</h2>
            <p className="mt-2 leading-7 text-zinc-700">{movie.overview || "No overview available."}</p>
          </section>
        </div>
      </article>
    </main>
  );
}
