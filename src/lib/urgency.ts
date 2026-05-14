export type Urgency = "overdue" | "urgent" | "high" | "normal" | "low" | "none";

const MS_PER_DAY = 86_400_000;

function daysUntil(due: Date, now: Date): number {
  // Compare midnight-to-midnight in local time so "today" is 0, not -0.x.
  const a = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((a - b) / MS_PER_DAY);
}

export function getUrgency(dueAt: string | Date | null | undefined, now: Date = new Date()): Urgency {
  if (!dueAt) return "none";
  const due = typeof dueAt === "string" ? new Date(dueAt) : dueAt;
  if (Number.isNaN(due.getTime())) return "none";
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
