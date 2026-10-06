import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalNav } from "@/components/portal-nav";
import { BrandLockup } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentProfile } from "@/lib/supabase/server";
import { PREVIEW_MODE } from "@/lib/preview";
import { logoutAction } from "@/app/(auth)/actions";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "customer" && !PREVIEW_MODE) redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-4 border-b border-[var(--line)] bg-[var(--surface)] px-5 py-3 sm:px-8">
        <Link href="/portal">
          <BrandLockup />
        </Link>
        <div className="ml-auto flex items-center gap-3 text-xs text-[var(--ink-2)]">
          <span className="hidden md:inline text-[var(--ink)]">{profile.email}</span>
          <ThemeToggle />
          <form action={logoutAction}>
            <button
              type="submit"
              className="h-9 rounded-lg border border-[var(--line-2)] px-3 text-xs hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <PortalNav />
      <main className="flex-1 px-5 pb-16 pt-8 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-[1360px]">{children}</div>
      </main>
    </div>
  );
}
