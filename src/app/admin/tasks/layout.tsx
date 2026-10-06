import { TaskViewToggle } from "@/components/tasks/view-toggle";
import { PageHeader } from "@/components/page-header";
import { NewTaskForm } from "@/components/tasks/new-task-form";

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader
        title="Your"
        accent="tasks"
        subtitle="Urgency comes from the due date: overdue and today are red, soon is amber."
      >
        <TaskViewToggle />
      </PageHeader>
      <div className="flex flex-col gap-5">
        <NewTaskForm />
        {children}
      </div>
    </>
  );
}
