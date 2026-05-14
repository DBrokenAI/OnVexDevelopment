import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];

export async function listTasks(): Promise<Task[]> {
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
