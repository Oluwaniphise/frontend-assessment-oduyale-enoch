import type { MovieFilters, TMDBGenre, TMDBListResponse, TMDBMovieDetails, TMDBMovieSummary } from "@/types/tmdb";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

function getPublicToken(): string {
  const token = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
  if (!token) {
    throw new Error("NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN is missing.");
  }

  return token;
}

function tmdbUrl(path: string, queryParams: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  return `${TMDB_API_BASE_URL}${path}?${params.toString()}`;
}

async function fetchTmdb<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getPublicToken()}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

function filterResultsByGenre(
  movies: TMDBMovieSummary[],
  genreId: number | null,
): TMDBMovieSummary[] {
  if (!genreId) {
    return movies;
  }

  return movies.filter((movie) => movie.genre_ids.includes(genreId));
}

export async function fetchGenres(): Promise<{ genres: TMDBGenre[] }> {
  const url = tmdbUrl("/genre/movie/list", { language: "en-US" });
  return fetchTmdb<{ genres: TMDBGenre[] }>(url);
}

export async function fetchMovies(
  filters: MovieFilters,
): Promise<TMDBListResponse<TMDBMovieSummary>> {
  if (filters.query) {
    const searchUrl = tmdbUrl("/search/movie", {
      query: filters.query,
      page: filters.page,
      year: filters.year ?? undefined,
      include_adult: false,
      language: "en-US",
    });

    const payload = await fetchTmdb<TMDBListResponse<TMDBMovieSummary>>(searchUrl);

    return {
      ...payload,
      results: filterResultsByGenre(payload.results, filters.genreId),
    };
  }

  const discoverUrl = tmdbUrl("/discover/movie", {
    include_adult: false,
    include_video: false,
    language: "en-US",
    page: filters.page,
    sort_by: "popularity.desc",
    with_genres: filters.genreId ?? undefined,
    primary_release_year: filters.year ?? undefined,
  });

  return fetchTmdb<TMDBListResponse<TMDBMovieSummary>>(discoverUrl);
}

export function fetchMovieById(movieId: number): Promise<TMDBMovieDetails> {
  return fetchTmdb<TMDBMovieDetails>(
    tmdbUrl(`/movie/${movieId}`, {
      language: "en-US",
    }),
  );
}