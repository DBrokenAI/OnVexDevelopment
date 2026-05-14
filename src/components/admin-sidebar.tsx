"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/nav";
import { BrandLockup } from "@/components/brand";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const grouped = ADMIN_NAV.reduce<Record<string, typeof ADMIN_NAV>>((acc, item) => {
    const key = item.section ?? "";
    (acc[key] ||= []).push(item);
    return acc;
  }, {});

  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col gap-5 bg-[#0F172A] text-[#CBD5E1] p-6 sticky top-0 h-screen overflow-y-auto">
      <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
        <BrandLockup />
      </div>

      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="flex flex-col gap-0.5">
          <div className="px-2.5 pb-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
            {section}
          </div>
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-[#CBD5E1] hover:bg-white/5 hover:text-white",
                )}
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
