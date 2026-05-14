import { TaskViewToggle } from "@/components/tasks/view-toggle";
import { NewTaskForm } from "@/components/tasks/new-task-form";

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Tasks</h2>
          <p className="text-sm text-[var(--ink-2)]">
            Urgency is computed from the due date — overdue and today are red, soon is amber.
          </p>
        </div>
        <TaskViewToggle />
      </div>
      <NewTaskForm />
      {children}
    </div>
  );
}
