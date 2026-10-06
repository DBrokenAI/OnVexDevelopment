import type { Database } from "@/lib/supabase/types";
import { dueAtFromDateInput } from "@/lib/urgency";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Task = Database["public"]["Tables"]["tasks"]["Row"];

/**
 * Local design preview: skips sign-in and shows sample data so pages can be
 * reviewed without an account. Only on `npm run dev` with ONVEX_PREVIEW=1 in
 * .env.local — production builds always have NODE_ENV=production, so it can
 * never turn on there.
 */
export const PREVIEW_MODE =
  process.env.NODE_ENV === "development" && process.env.ONVEX_PREVIEW === "1";

const STAMP = "2026-01-01T00:00:00Z";

export const PREVIEW_PROFILE: Profile = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "dan@onvex.dev",
  full_name: "Dan Brown",
  role: "owner",
  avatar_url: null,
  phone: null,
  created_at: STAMP,
  updated_at: STAMP,
};

/** YYYY-MM-DD for today plus `days`, in local time. */
function day(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function task(n: number, title: string, dueInDays: number | null, priority = "normal"): Task {
  return {
    id: `00000000-0000-0000-0000-00000000000${n}`,
    title,
    description: null,
    client_id: null,
    site_id: null,
    assigned_to: null,
    status: "todo",
    priority,
    due_at: dueInDays === null ? null : dueAtFromDateInput(day(dueInDays)),
    created_at: STAMP,
    updated_at: STAMP,
  };
}

export function previewTasks(): Task[] {
  return [
    task(1, "Fix contact form on Papago Plumbing", -1, "high"),
    task(2, "Send Desert Bloom mockups for review", 0, "high"),
    task(3, "Renew SSL for Saguaro Dental", 2),
    task(4, "Monthly report: Mesa Auto Glass", 5),
    task(5, "Quote landing page for new lead", 12, "low"),
    task(6, "Tidy up the SOP for site launches", null, "low"),
  ];
}
