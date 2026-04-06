"use client";

import { useParams, useSearchParams } from "next/navigation";

import { MovieDetailClient } from "@/features/movies/components/movie-detail-client";
import { sanitizeReturnTo } from "@/features/movies/utils/query";

export default function MovieDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const movieId = Number.parseInt(params.id, 10);

  if (!Number.isFinite(movieId) || movieId <= 0) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Invalid movie ID</h1>
      </main>
    );
  }

  const returnTo = sanitizeReturnTo(searchParams.get("returnTo") ?? undefined);

  return <MovieDetailClient movieId={movieId} returnTo={returnTo} />;
}