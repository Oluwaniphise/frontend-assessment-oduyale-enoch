const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function getTmdbToken(): string {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "TMDB_API_READ_ACCESS_TOKEN is missing. Add it to your environment variables.",
    );
  }

  return token;
}

export { TMDB_API_BASE_URL, TMDB_IMAGE_BASE_URL, getTmdbToken };
