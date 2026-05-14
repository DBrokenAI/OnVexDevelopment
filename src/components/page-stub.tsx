export function PageStub({
  title,
  description,
  notes,
}: {
  title: string;
  description: string;
  notes?: string[];
}) {
  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-3xl mb-1">{title}</h2>
      <p className="text-sm text-[var(--ink-2)] mb-6">{description}</p>

      <div className="rounded-lg border border-dashed border-[var(--line-2)] bg-[var(--surface)] p-6">
        <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink-3)] mb-2">
          Coming soon
        </div>
        <p className="text-sm text-[var(--ink-2)]">
          This page is a placeholder. The data layer and UI for this section will be wired up next.
        </p>
        {notes && notes.length > 0 && (
          <ul className="mt-4 list-disc pl-5 text-xs text-[var(--ink-2)] space-y-1">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
