import { NextResponse } from "next/server";

import { getMovieDetails } from "@/lib/tmdb/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const movieId = Number.parseInt(id, 10);

  if (!Number.isFinite(movieId) || movieId <= 0) {
    return NextResponse.json({ message: "Invalid movie id" }, { status: 400 });
  }

  try {
    const movie = await getMovieDetails(movieId);

    return NextResponse.json(movie, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to load movie" },
      { status: 500 },
    );
  }
}
