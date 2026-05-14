import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Topbar } from "@/components/topbar";
import { getCurrentProfile } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role === "customer") redirect("/portal");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Dashboard" email={profile.email} role={profile.role} />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
