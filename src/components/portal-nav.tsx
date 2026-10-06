"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PORTAL_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function PortalNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Portal" className="flex gap-1 overflow-x-auto border-b border-[var(--line)] px-5 sm:px-8">
      {PORTAL_NAV.map((item) => {
        const active =
          item.href === "/portal"
            ? pathname === "/portal"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              active
                ? "border-[var(--accent)] text-[var(--ink)]"
                : "border-transparent text-[var(--ink-2)] hover:text-[var(--ink)]",
            )}
          >
            <Icon size={16} stroke={1.75} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
