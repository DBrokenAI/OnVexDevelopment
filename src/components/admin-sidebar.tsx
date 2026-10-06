"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLogout, IconMenu2, IconX } from "@tabler/icons-react";
import { ADMIN_NAV } from "@/lib/nav";
import { BrandLockup } from "@/components/brand";
import { logoutAction } from "@/app/(auth)/actions";
import { cn, initials } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  owner: "Owner",
  staff: "Staff",
  customer: "Client",
};

export function AdminSidebar({
  name,
  email,
  role,
}: {
  name: string | null;
  email: string;
  role: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  // While the drawer is open on small screens: Escape closes it, the page
  // behind doesn't scroll, and focus starts on the close button.
  useEffect(() => {
    if (!open) return;
    const menuButton = menuRef.current;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [open]);

  const grouped = ADMIN_NAV.reduce<Record<string, typeof ADMIN_NAV>>((acc, item) => {
    const key = item.section ?? "";
    (acc[key] ||= []).push(item);
    return acc;
  }, {});

  const displayName = name?.trim() || email;

  return (
    <>
      <button
        ref={menuRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="admin-sidebar"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sidebar-bg)] text-white shadow-lg lg:hidden"
      >
        <IconMenu2 size={20} />
      </button>

      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        id="admin-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[240px] shrink-0 flex-col gap-5 overflow-y-auto bg-[var(--sidebar-bg)] p-6 text-[var(--sidebar-ink)] transition-[transform,visibility] duration-200",
          "lg:sticky lg:top-0 lg:h-screen lg:w-[220px] lg:translate-x-0 lg:visible",
          open ? "translate-x-0 visible" : "-translate-x-full invisible",
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <BrandLockup inverse />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-[var(--sidebar-ink)] hover:bg-white/5 hover:text-white lg:hidden"
          >
            <IconX size={18} />
          </button>
        </div>

        <nav aria-label="Main" className="flex flex-col gap-5">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-0.5">
              <div className="px-2.5 pb-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--sidebar-ink-3)]">
                {section}
              </div>
              {items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-[var(--sidebar-ink)] hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon size={16} stroke={1.75} aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="ml-auto rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] text-[var(--on-accent)]">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 px-2.5 pt-3">
          <div
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A9431C] text-xs font-medium text-white"
          >
            {initials(displayName)}
          </div>
          <div className="min-w-0 text-xs leading-tight">
            <div className="truncate text-white" title={email}>
              {displayName}
            </div>
            <div className="text-[var(--sidebar-ink-3)]">{ROLE_LABEL[role] ?? role}</div>
          </div>
          <form action={logoutAction} className="ml-auto">
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--sidebar-ink)] hover:bg-white/5 hover:text-white"
            >
              <IconLogout size={16} />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
