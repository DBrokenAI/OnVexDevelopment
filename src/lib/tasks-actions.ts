"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
});

const idSchema = z.string().uuid("Invalid task id");
const statusSchema = z.enum(["todo", "doing", "done"]);

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

// Tasks are staff/owner only. RLS enforces this too; this is defence in depth.
async function requireStaff(): Promise<string | null> {
  const profile = await getCurrentProfile();
  if (!profile) return "You must be signed in.";
  if (profile.role === "customer") return "You don't have permission to do that.";
  return null;
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

  const denied = await requireStaff();
  if (denied) return { ok: false, error: denied };

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

export async function setTaskStatus(id: string, status: string): Promise<TaskActionState> {
  const parsed = z.object({ id: idSchema, status: statusSchema }).safeParse({ id, status });
  if (!parsed.success) {
    return { ok: false, error: "Invalid task update.", fieldErrors: flatten(parsed.error) };
  }

  const denied = await requireStaff();
  if (denied) return { ok: false, error: denied };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("id");

  if (error) {
    return { ok: false, error: error.message };
  }
  if (!data?.length) {
    return { ok: false, error: "Task not found." };
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/tasks/calendar");
  return { ok: true };
}

export async function deleteTask(id: string): Promise<TaskActionState> {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) {
    return { ok: false, error: "Invalid task id." };
  }

  const denied = await requireStaff();
  if (denied) return { ok: false, error: denied };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", parsed.data)
    .select("id");

  if (error) {
    return { ok: false, error: error.message };
  }
  if (!data?.length) {
    return { ok: false, error: "Task not found." };
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/admin/tasks/calendar");
  return { ok: true };
}
