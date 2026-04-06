import type { Metadata } from "next";
import { MovieExplorer } from "@/features/movies/components/movie-explorer";

export const metadata: Metadata = {
  title: "Checkit Movie Explorer",
  description: "Browse, search, and filter popular movies from TMDB.",
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <header className="mb-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Checkit</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Movie Content Explorer</h1>
        <p className="max-w-2xl text-zinc-700">
          Discover movies with React Query, shareable search state, and performance-focused rendering.
        </p>
      </header>
      <MovieExplorer />
    </main>
  );
}
