import { TMDB_IMAGE_BASE_URL } from "@/lib/tmdb/config";

const FALLBACK_POSTER = "/placeholder-poster.svg";

export function getPosterUrl(path: string | null, size: "w342" | "w500" = "w342"): string {
  if (!path) {
    return FALLBACK_POSTER;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function hasPoster(path: string | null): boolean {
  return Boolean(path);
}
