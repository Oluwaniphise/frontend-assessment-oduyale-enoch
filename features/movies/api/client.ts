import type { MovieFilters, TMDBGenre, TMDBListResponse, TMDBMovieDetails, TMDBMovieSummary } from "@/types/tmdb";

function toQueryString(filters: MovieFilters): string {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));

  if (filters.query) {
    params.set("q", filters.query);
  }

  if (filters.genreId) {
    params.set("genre", String(filters.genreId));
  }

  if (filters.year) {
    params.set("year", String(filters.year));
  }

  return params.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export function fetchGenres(): Promise<{ genres: TMDBGenre[] }> {
  return fetchJson<{ genres: TMDBGenre[] }>("/api/genres");
}

export function fetchMovies(filters: MovieFilters): Promise<TMDBListResponse<TMDBMovieSummary>> {
  const query = toQueryString(filters);
  return fetchJson<TMDBListResponse<TMDBMovieSummary>>(`/api/movies?${query}`);
}

export function fetchMovieById(movieId: number): Promise<TMDBMovieDetails> {
  return fetchJson<TMDBMovieDetails>(`/api/movies/${movieId}`);
}
