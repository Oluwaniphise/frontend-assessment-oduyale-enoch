import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MovieCard } from "@/features/movies/components/movie-card";
import type { TMDBGenre, TMDBMovieSummary } from "@/types/tmdb";

const genres: TMDBGenre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
];

const baseMovie: TMDBMovieSummary = {
  id: 1,
  title: "Test Movie",
  overview: "A movie used for tests.",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  release_date: "2020-07-01",
  vote_average: 7.4,
  vote_count: 100,
  popularity: 50,
  original_language: "en",
  genre_ids: [28, 12],
};

describe("MovieCard", () => {
  it("renders image, metadata, and detail link", () => {
    render(<MovieCard movie={baseMovie} genres={genres} returnTo="/?page=2" />);

    expect(screen.getByRole("heading", { name: "Test Movie" })).toBeInTheDocument();
    expect(screen.getByAltText("Test Movie poster")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
    expect(screen.getByText("7.4")).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movies/1?returnTo=%2F%3Fpage%3D2");
  });

  it("shows fallback text when poster is missing", () => {
    render(
      <MovieCard
        movie={{ ...baseMovie, id: 2, poster_path: null }}
        genres={genres}
        returnTo="/"
      />,
    );

    expect(screen.getByText("Poster unavailable")).toBeInTheDocument();
  });
});
