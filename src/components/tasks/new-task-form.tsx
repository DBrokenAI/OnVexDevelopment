"use client";

import { Suspense, useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { createTask, type TaskActionState } from "@/lib/tasks-actions";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Inner() {
  const params = useSearchParams();
  const presetDate = params.get("date") ?? "";
  const [state, action, pending] = useActionState<TaskActionState, FormData>(createTask, null);
  const errs = state && !state.ok ? state.fieldErrors ?? {} : {};
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4"
    >
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
        <Field label="New task" error={errs.title}>
          <Input
            name="title"
            placeholder="What needs to happen?"
            required
            autoComplete="off"
          />
        </Field>
        <Field label="Due date" error={errs.due_date}>
          <Input name="due_date" type="date" defaultValue={presetDate} />
        </Field>
        <Field label="Priority" error={errs.priority}>
          <select
            name="priority"
            defaultValue="normal"
            className="h-10 w-full rounded-md border border-[var(--line-2)] bg-[var(--surface)] px-3 text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </Field>
        <Button type="submit" disabled={pending} className="md:mb-0.5">
          {pending ? "Adding..." : "Add task"}
        </Button>
      </div>
      {state && !state.ok && !Object.keys(errs).length && (
        <div className="mt-3 rounded-md bg-[var(--danger-soft)] px-3 py-2 text-xs text-[var(--danger)]">
          {state.error}
        </div>
      )}
    </form>
  );
}

export function NewTaskForm() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
