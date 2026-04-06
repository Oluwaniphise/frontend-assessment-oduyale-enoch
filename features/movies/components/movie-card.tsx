import Link from "next/link";
import Image from "next/image";

import { getPosterUrl, hasPoster } from "@/lib/tmdb/image";
import type { TMDBGenre, TMDBMovieSummary } from "@/types/tmdb";

type MovieCardProps = {
  movie: TMDBMovieSummary;
  genres: TMDBGenre[];
  returnTo: string;
};

function formatYear(releaseDate: string): string {
  if (!releaseDate) {
    return "Unknown year";
  }

  return releaseDate.slice(0, 4);
}

function formatLanguage(language: string): string {
  if (!language) {
    return "N/A";
  }

  return language.toUpperCase();
}

export function MovieCard({ movie, genres, returnTo }: MovieCardProps) {
  const genreNames = movie.genre_ids
    .slice(0, 2)
    .map((genreId) => genres.find((genre) => genre.id === genreId)?.name)
    .filter(Boolean)
    .join(" � ");

  const posterExists = hasPoster(movie.poster_path);

  return (
    <article className="group rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={{ pathname: `/movies/${movie.id}`, query: { returnTo } }}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl bg-zinc-100">
          {posterExists ? (
            <Image
              src={getPosterUrl(movie.poster_path, "w500")}
              alt={`${movie.title} poster`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-600">
              Poster unavailable
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <h2 className="line-clamp-1 text-lg font-semibold text-zinc-900">{movie.title}</h2>

        <p className="line-clamp-2 text-sm text-zinc-700">{movie.overview || "No overview available."}</p>

        <dl className="grid grid-cols-2 gap-2 text-xs text-zinc-600">
          <div>
            <dt className="font-medium text-zinc-500">Year</dt>
            <dd>{formatYear(movie.release_date)}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500">Rating</dt>
            <dd>{movie.vote_average.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500">Language</dt>
            <dd>{formatLanguage(movie.original_language)}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-500">Genres</dt>
            <dd className="line-clamp-1">{genreNames || "N/A"}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
