import { NextResponse } from "next/server";

import { getMovieGenres } from "@/lib/tmdb/api";

export async function GET() {
  try {
    const genres = await getMovieGenres();

    return NextResponse.json(
      { genres },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to load genres" },
      { status: 500 },
    );
  }
}
