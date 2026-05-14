import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalNav } from "@/components/portal-nav";
import { BrandLockup } from "@/components/brand";
import { getCurrentProfile } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/actions";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "customer") redirect("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-4 border-b border-[var(--line)] bg-[var(--surface)] px-6 py-3">
        <Link href="/portal">
          <BrandLockup />
        </Link>
        <div className="ml-auto flex items-center gap-3 text-xs text-[var(--ink-2)]">
          <span className="hidden md:inline text-[var(--ink)]">{profile.email}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-[var(--line-2)] px-3 py-1.5 text-xs hover:bg-[var(--surface-2)]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <PortalNav />
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}
