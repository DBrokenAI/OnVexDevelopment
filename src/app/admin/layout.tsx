import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { getCurrentProfile } from "@/lib/supabase/server";
import { PREVIEW_MODE } from "@/lib/preview";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role === "customer") redirect("/portal");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar name={profile.full_name} email={profile.email} role={profile.role} />
      <main className="min-w-0 flex-1 px-5 pb-16 pt-[72px] sm:px-8 lg:px-10 lg:pt-8">
        <div className="mx-auto w-full max-w-[1360px]">
          {PREVIEW_MODE ? (
            <p className="mb-6 rounded-lg border border-[var(--warn)] bg-[var(--warn-soft)] px-3 py-2 text-xs text-[var(--warn)]">
              Preview mode: sample data, no sign-in. Adding, editing and deleting won&apos;t save.
            </p>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  );
}
