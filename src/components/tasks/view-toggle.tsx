"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function TaskViewToggle() {
  const pathname = usePathname();
  const onCalendar = pathname.startsWith("/admin/tasks/calendar");

  const item = (active: boolean) =>
    cn(
      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
      active
        ? "bg-[var(--surface)] text-[var(--ink)] shadow-sm"
        : "text-[var(--ink-2)] hover:text-[var(--ink)]",
    );

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-[var(--surface-2)] p-1">
      <Link href="/admin/tasks" className={item(!onCalendar)}>
        List
      </Link>
      <Link href="/admin/tasks/calendar" className={item(onCalendar)}>
        Calendar
      </Link>
    </div>
  );
}
