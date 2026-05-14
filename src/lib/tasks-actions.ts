"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
});

export type TaskActionState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
  | null;

function flatten(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const k = String(issue.path[0] ?? "_");
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

export async function createTask(
  _prev: TaskActionState,
  formData: FormData,
): Promise<TaskActionState> {
  const parsed = createSchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    due_date: formData.get("due_date") ?? "",
    priority: formData.get("priority") ?? "normal",
  });

  if (!parsed.success) {
    return { ok: false, error: "Please fix the errors below.", fieldErrors: flatten(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    title: parsed.data.title.trim(),
    description: parsed.data.description?.trim() || null,
    priority: parsed.data.priority,
    due_at: parsed.data.due_date ? new Date(parsed.data.due_date).toISOString() : null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/tasks/calendar");
  return { ok: true };
}

export async function setTaskStatus(id: string, status: "todo" | "doing" | "done") {
  const supabase = await createClient();
  await supabase.from("tasks").update({ status }).eq("id", id);
  revalidatePath("/admin/tasks");
  revalidatePath("/admin/tasks/calendar");
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/admin/tasks");
  revalidatePath("/admin/tasks/calendar");
}
