import { createClient, getCurrentProfile } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();
  const [clients, sites, leads, invoices] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("sites").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
  ]);
  return {
    clients: clients.count ?? 0,
    sites: sites.count ?? 0,
    leads: leads.count ?? 0,
    invoices: invoices.count ?? 0,
  };
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4">
      <div className="text-xs uppercase tracking-[0.12em] text-[var(--ink-3)]">{label}</div>
      <div className="mt-2 font-display text-3xl">{value}</div>
    </div>
  );
}

export default async function AdminOverview() {
  const profile = await getCurrentProfile();
  const stats = await getStats().catch(() => ({ clients: 0, sites: 0, leads: 0, invoices: 0 }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-3xl">
          {`Welcome${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`}
        </h2>
        <p className="text-sm text-[var(--ink-2)]">Here&apos;s where things stand today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Active clients" value={stats.clients} />
        <Stat label="Sites managed" value={stats.sites} />
        <Stat label="Open leads" value={stats.leads} />
        <Stat label="Invoices" value={stats.invoices} />
      </div>

      <div className="rounded-lg border border-dashed border-[var(--line-2)] bg-[var(--surface)] p-6">
        <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink-3)] mb-2">Next up</div>
        <p className="text-sm text-[var(--ink-2)]">
          Activity feed, recent messages, and overdue tasks will land here. See{" "}
          <code className="text-[var(--ink)]">prototype/index.html</code> for the target design.
        </p>
      </div>
    </div>
  );
}
