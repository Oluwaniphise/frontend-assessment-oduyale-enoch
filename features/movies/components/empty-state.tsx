export function EmptyState() {
  return (
    <section className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      <h2 className="text-xl font-semibold text-zinc-900">No movies found</h2>
      <p className="mt-2 text-zinc-700">
        Try a different search keyword, remove filters, or choose another year.
      </p>
    </section>
  );
}
