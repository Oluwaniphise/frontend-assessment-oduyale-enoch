import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MovieDetailClient } from "@/features/movies/components/movie-detail-client";
import { sanitizeReturnTo } from "@/features/movies/utils/query";
import { getMovieDetails } from "@/lib/tmdb/api";
import { getPosterUrl, hasPoster } from "@/lib/tmdb/image";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function resolveMovieId(params: Promise<{ id: string }>): Promise<number> {
  const { id } = await params;
  const parsed = Number.parseInt(id, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    notFound();
  }

  return parsed;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const movieId = await resolveMovieId(params);
  const movie = await getMovieDetails(movieId);

  const description = movie.overview || `Details for ${movie.title}`;
  const image = hasPoster(movie.poster_path) ? getPosterUrl(movie.poster_path, "w500") : undefined;

  return {
    title: `${movie.title} | Checkit Movie Explorer`,
    description,
    openGraph: {
      title: movie.title,
      description,
      images: image ? [image] : [],
      type: "website",
    },
  };
}

export default async function MovieDetailPage({ params, searchParams }: PageProps) {
  const movieId = await resolveMovieId(params);
  const initialMovie = await getMovieDetails(movieId);

  const rawReturnTo = (await searchParams)?.returnTo;
  const returnTo = sanitizeReturnTo(Array.isArray(rawReturnTo) ? rawReturnTo[0] : rawReturnTo);

  return <MovieDetailClient initialMovie={initialMovie} movieId={movieId} returnTo={returnTo} />;
}
