export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="mb-6 h-6 w-40 animate-pulse rounded bg-zinc-200" />
      <div className="mb-8 h-20 animate-pulse rounded-2xl bg-zinc-200" />
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="aspect-[2/3] animate-pulse bg-zinc-200" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
