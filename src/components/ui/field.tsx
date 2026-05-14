import * as React from "react";

export function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--ink-2)]">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-[var(--danger)]">{error}</span>
      ) : hint ? (
        <span className="text-xs text-[var(--ink-3)]">{hint}</span>
      ) : null}
    </label>
  );
}
