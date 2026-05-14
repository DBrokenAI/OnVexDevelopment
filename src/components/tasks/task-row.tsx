"use client";

import { useTransition } from "react";
import { setTaskStatus, deleteTask } from "@/lib/tasks-actions";
import type { Task } from "@/lib/tasks";
import { getUrgency, URGENCY_BADGE, URGENCY_LABEL } from "@/lib/urgency";
import { cn } from "@/lib/utils";

function formatDue(due: string | null) {
  if (!due) return "—";
  const d = new Date(due);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TaskRow({ task }: { task: Task }) {
  const [pending, start] = useTransition();
  const urgency = getUrgency(task.due_at);
  const done = task.status === "done";

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5",
        done && "opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={done}
        disabled={pending}
        onChange={() =>
          start(async () => {
            await setTaskStatus(task.id, done ? "todo" : "done");
          })
        }
        className="h-4 w-4 cursor-pointer accent-[var(--accent)]"
      />
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm font-medium truncate", done && "line-through")}>
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs text-[var(--ink-2)] truncate">{task.description}</div>
        )}
      </div>
      <div className="hidden sm:block text-xs text-[var(--ink-2)] tabular-nums">
        {formatDue(task.due_at)}
      </div>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
          URGENCY_BADGE[urgency],
        )}
      >
        {URGENCY_LABEL[urgency]}
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await deleteTask(task.id);
          })
        }
        className="text-[var(--ink-3)] hover:text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        aria-label="Delete task"
      >
        ✕
      </button>
    </div>
  );
}
