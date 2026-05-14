import Link from "next/link";
import type { Task } from "@/lib/tasks";
import { getUrgency, URGENCY_DOT } from "@/lib/urgency";
import { cn } from "@/lib/utils";

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthMatrix(year: number, month: number): Date[][] {
  // month is 0-indexed. Returns 6 rows of 7 days (Sun-Sat), Sunday-first.
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay()); // back up to Sunday
  const rows: Date[][] = [];
  for (let r = 0; r < 6; r++) {
    const row: Date[] = [];
    for (let c = 0; c < 7; c++) {
      const d = new Date(start);
      d.setDate(start.getDate() + r * 7 + c);
      row.push(d);
    }
    rows.push(row);
  }
  return rows;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({
  tasks,
  year,
  month,
}: {
  tasks: Task[];
  year: number;
  month: number; // 0-indexed
}) {
  const matrix = monthMatrix(year, month);
  const today = ymd(new Date());

  // Group tasks by yyyy-mm-dd in the user's local timezone.
  const byDay = new Map<string, Task[]>();
  for (const t of tasks) {
    if (!t.due_at) continue;
    const key = ymd(new Date(t.due_at));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(t);
  }

  const prevMonth = month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
  const nextMonth = month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
  const monthParam = (y: number, m: number) =>
    `/admin/tasks/calendar?y=${y}&m=${m + 1}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={monthParam(prevMonth.year, prevMonth.month)}
            className="rounded-md border border-[var(--line-2)] px-3 py-1.5 hover:bg-[var(--surface-2)]"
          >
            ‹ Prev
          </Link>
          <Link
            href="/admin/tasks/calendar"
            className="rounded-md border border-[var(--line-2)] px-3 py-1.5 hover:bg-[var(--surface-2)]"
          >
            Today
          </Link>
          <Link
            href={monthParam(nextMonth.year, nextMonth.month)}
            className="rounded-md border border-[var(--line-2)] px-3 py-1.5 hover:bg-[var(--surface-2)]"
          >
            Next ›
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)]">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="bg-[var(--surface-2)] px-2 py-2 text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)]"
          >
            {d}
          </div>
        ))}
        {matrix.flat().map((d) => {
          const key = ymd(d);
          const dayTasks = byDay.get(key) ?? [];
          const inMonth = d.getMonth() === month;
          const isToday = key === today;
          return (
            <Link
              key={key}
              href={`/admin/tasks?date=${key}`}
              className={cn(
                "group min-h-[96px] bg-[var(--surface)] p-1.5 flex flex-col gap-1 hover:bg-[var(--surface-2)] transition-colors",
                !inMonth && "bg-[var(--surface-2)] text-[var(--ink-3)]",
              )}
            >
              <div
                className={cn(
                  "text-xs font-medium",
                  isToday &&
                    "inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-white",
                )}
              >
                {d.getDate()}
              </div>
              <div className="flex flex-col gap-0.5">
                {dayTasks.slice(0, 3).map((t) => {
                  const u = getUrgency(t.due_at);
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-1.5 text-[11px] text-[var(--ink)] truncate"
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", URGENCY_DOT[u])} />
                      <span className={cn("truncate", t.status === "done" && "line-through opacity-60")}>
                        {t.title}
                      </span>
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] text-[var(--ink-3)]">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
