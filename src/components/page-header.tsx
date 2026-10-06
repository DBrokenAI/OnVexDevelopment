import Link from "next/link";
import { IconBell } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Serif page title with an optional italic accent word, e.g.
 * title="All" accent="sites" → "All *sites*". Pass `accentFirst` to put the
 * accent before the title. Children are page actions, shown before the tools.
 */
export function PageHeader({
  title,
  accent,
  subtitle,
  children,
  tools = true,
}: {
  title: string;
  accent?: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  /** Theme toggle and notifications bell. Off in the portal, whose header has them. */
  tools?: boolean;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div className="min-w-0">
        <h1 className="font-display text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[38px] sm:leading-[1.1]">
          {title}
          {accent ? (
            <>
              {" "}
              <em className="text-[var(--accent)]">{accent}</em>
            </>
          ) : null}
        </h1>
        {subtitle ? <p className="mt-1 text-[13px] text-[var(--ink-2)]">{subtitle}</p> : null}
      </div>
      {children || tools ? (
        <div className="flex flex-wrap items-center gap-3">
          {children}
          {tools ? (
            <>
              <Link
                href="/admin/notifications"
                aria-label="Notifications"
                title="Notifications"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
              >
                <IconBell size={18} />
              </Link>
              <ThemeToggle />
            </>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
