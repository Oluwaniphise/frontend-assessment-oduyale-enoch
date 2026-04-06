const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function getTmdbToken(): string {
  const token = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "TMDB token is missing. Set TMDB_API_READ_ACCESS_TOKEN (preferred) or NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN.",
    );
  }

  return token.trim();
}

export { TMDB_API_BASE_URL, TMDB_IMAGE_BASE_URL, getTmdbToken };
