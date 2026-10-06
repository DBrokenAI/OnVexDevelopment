import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { PREVIEW_MODE, previewTasks } from "@/lib/preview";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];

export async function listTasks(): Promise<Task[]> {
  if (PREVIEW_MODE) return previewTasks();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("due_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listTasks error:", error);
    return [];
  }
  return data ?? [];
}
