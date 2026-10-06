export type Urgency = "overdue" | "urgent" | "high" | "normal" | "low" | "none";

const MS_PER_DAY = 86_400_000;

/**
 * Due dates are calendar days. They're stored as noon UTC on that day, so the
 * YYYY-MM-DD prefix is the day in every US timezone. Reading the prefix (rather
 * than converting the instant to local time) keeps server and browser agreeing.
 */
export function parseDueDate(dueAt: string | Date | null | undefined): Date | null {
  if (!dueAt) return null;
  if (dueAt instanceof Date) {
    return Number.isNaN(dueAt.getTime())
      ? null
      : new Date(dueAt.getFullYear(), dueAt.getMonth(), dueAt.getDate());
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dueAt);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

/** Value to store in tasks.due_at for a YYYY-MM-DD date input. */
export function dueAtFromDateInput(date: string): string {
  return `${date}T12:00:00Z`;
}

function daysUntil(due: Date, now: Date): number {
  // Compare midnight-to-midnight in local time so "today" is 0, not -0.x.
  const a = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((a - b) / MS_PER_DAY);
}

export function getUrgency(dueAt: string | Date | null | undefined, now: Date = new Date()): Urgency {
  const due = parseDueDate(dueAt);
  if (!due) return "none";
  const days = daysUntil(due, now);
  if (days < 0) return "overdue";
  if (days === 0) return "urgent";
  if (days <= 3) return "high";
  if (days <= 7) return "normal";
  return "low";
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  overdue: "Overdue",
  urgent: "Today",
  high: "Soon",
  normal: "This week",
  low: "Later",
  none: "No date",
};

// Tailwind-friendly classes that work with the CSS var palette in globals.css.
export const URGENCY_BADGE: Record<Urgency, string> = {
  overdue: "bg-[var(--danger-soft)] text-[var(--danger)]",
  urgent: "bg-[var(--danger-soft)] text-[var(--danger)]",
  high: "bg-[var(--warn-soft)] text-[var(--warn)]",
  normal: "bg-[var(--info-soft)] text-[var(--info)]",
  low: "bg-[var(--surface-2)] text-[var(--ink-2)]",
  none: "bg-[var(--surface-2)] text-[var(--ink-3)]",
};

export const URGENCY_DOT: Record<Urgency, string> = {
  overdue: "bg-[var(--danger)]",
  urgent: "bg-[var(--danger)]",
  high: "bg-[var(--warn)]",
  normal: "bg-[var(--info)]",
  low: "bg-[var(--ink-3)]",
  none: "bg-[var(--ink-3)]",
};

// Sort order for grouping (lower = more urgent).
export const URGENCY_RANK: Record<Urgency, number> = {
  overdue: 0,
  urgent: 1,
  high: 2,
  normal: 3,
  low: 4,
  none: 5,
};
