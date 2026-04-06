import { TMDB_API_BASE_URL, getTmdbToken } from "@/lib/tmdb/config";
import type {
  MovieFilters,
  TMDBGenre,
  TMDBListResponse,
  TMDBMovieDetails,
  TMDBMovieSummary,
} from "@/types/tmdb";

type TmdbFetchOptions = {
  revalidate: number;
};

async function tmdbFetch<T>(
  path: string,
  queryParams: Record<string, string | number | undefined>,
  options: TmdbFetchOptions,
): Promise<T> {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined || value === "") {
      continue;
    }

    params.set(key, String(value));
  }

  const url = `${TMDB_API_BASE_URL}${path}?${params.toString()}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getTmdbToken()}`,
      Accept: "application/json",
    },
    next: {
      revalidate: options.revalidate,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed (${response.status} ${response.statusText})`);
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

export async function getMovieGenres(): Promise<TMDBGenre[]> {
  const payload = await tmdbFetch<{ genres: TMDBGenre[] }>(
    "/genre/movie/list",
    {
      language: "en-US",
    },
    { revalidate: 86_400 },
  );

  return payload.genres;
}

export async function getMovies(filters: MovieFilters): Promise<TMDBListResponse<TMDBMovieSummary>> {
  const hasQuery = filters.query.length > 0;

  if (hasQuery) {
    const payload = await tmdbFetch<TMDBListResponse<TMDBMovieSummary>>(
      "/search/movie",
      {
        query: filters.query,
        page: filters.page,
        year: filters.year ?? undefined,
        include_adult: false,
        language: "en-US",
      },
      { revalidate: 120 },
    );

    return {
      ...payload,
      results: filterResultsByGenre(payload.results, filters.genreId),
    };
  }

  return tmdbFetch<TMDBListResponse<TMDBMovieSummary>>(
    "/discover/movie",
    {
      include_adult: false,
      include_video: false,
      language: "en-US",
      page: filters.page,
      sort_by: "popularity.desc",
      with_genres: filters.genreId ?? undefined,
      primary_release_year: filters.year ?? undefined,
    },
    { revalidate: 300 },
  );
}

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
  return tmdbFetch<TMDBMovieDetails>(
    `/movie/${movieId}`,
    {
      language: "en-US",
    },
    { revalidate: 3_600 },
  );
}
