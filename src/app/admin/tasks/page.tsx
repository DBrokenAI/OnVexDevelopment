import { listTasks, type Task } from "@/lib/tasks";
import { getUrgency, URGENCY_LABEL, URGENCY_RANK, type Urgency } from "@/lib/urgency";
import { TaskRow } from "@/components/tasks/task-row";

function groupByUrgency(tasks: Task[]): Array<{ urgency: Urgency; tasks: Task[] }> {
  const buckets = new Map<Urgency, Task[]>();
  for (const t of tasks) {
    const u = getUrgency(t.due_at);
    if (!buckets.has(u)) buckets.set(u, []);
    buckets.get(u)!.push(t);
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => URGENCY_RANK[a] - URGENCY_RANK[b])
    .map(([urgency, tasks]) => ({ urgency, tasks }));
}

export default async function TasksListPage() {
  const tasks = await listTasks();
  const groups = groupByUrgency(tasks);

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--line-2)] bg-[var(--surface)] p-8 text-center">
        <p className="text-sm text-[var(--ink-2)]">
          No tasks yet. Add one above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ urgency, tasks }) => (
        <section key={urgency} className="flex flex-col gap-2">
          <h3 className="text-xs uppercase tracking-[0.14em] text-[var(--ink-3)]">
            {URGENCY_LABEL[urgency]} ({tasks.length})
          </h3>
          <div className="flex flex-col gap-1.5">
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
