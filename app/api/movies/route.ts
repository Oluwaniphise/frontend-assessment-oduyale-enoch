import { NextRequest, NextResponse } from "next/server";

import { parseMovieFilters } from "@/features/movies/utils/query";
import { getMovies } from "@/lib/tmdb/api";

export async function GET(request: NextRequest) {
  try {
    const filters = parseMovieFilters({
      page: request.nextUrl.searchParams.get("page") ?? undefined,
      q: request.nextUrl.searchParams.get("q") ?? undefined,
      genre: request.nextUrl.searchParams.get("genre") ?? undefined,
      year: request.nextUrl.searchParams.get("year") ?? undefined,
    });

    const movies = await getMovies(filters);

    return NextResponse.json(movies, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to load movies" },
      { status: 500 },
    );
  }
}
