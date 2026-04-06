"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-zinc-950">Something went wrong</h1>
      <p className="mt-3 text-zinc-700">
        We couldn&apos;t load data from TMDB right now. Please retry or check your API token configuration.
      </p>
      <p className="mt-2 text-xs text-zinc-500">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
      >
        Try again
      </button>
    </main>
  );
}
