export default function LoadingMovieDetail() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <div className="mb-6 h-5 w-32 animate-pulse rounded bg-zinc-200" />
      <section className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-[280px_1fr] md:p-6">
        <div className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-200" />
        <div className="space-y-3">
          <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-200" />
          <div className="h-24 w-full animate-pulse rounded bg-zinc-200" />
          <div className="h-28 w-full animate-pulse rounded bg-zinc-200" />
        </div>
      </section>
    </main>
  );
}
