import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { PageHeader } from "@/components/page-header";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { PREVIEW_MODE } from "@/lib/preview";

async function getStats() {
  if (PREVIEW_MODE) return { clients: 11, sites: 14, leads: 5, invoices: 23 };
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
      <div className="text-xs uppercase tracking-[0.12em] text-[var(--ink-3)]">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl">{value}</div>
    </div>
  );
}

export default async function AdminOverview() {
  const profile = await getCurrentProfile();
  const firstName = profile?.full_name?.trim().split(" ")[0];
  const stats = await getStats().catch(() => ({
    clients: 0,
    sites: 0,
    leads: 0,
    invoices: 0,
  }));

  return (
    <>
      <PageHeader
        title={firstName ? `Hi ${firstName},` : "Let's"}
        accent={firstName ? "let's ship." : "ship."}
        subtitle="Here's where things stand today."
      >
        <Link
          href="/admin/tasks"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 text-[13px] font-medium text-[var(--on-primary)] hover:opacity-90"
        >
          <IconPlus size={16} aria-hidden="true" /> New task
        </Link>
      </PageHeader>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Active clients" value={stats.clients} />
          <Stat label="Sites managed" value={stats.sites} />
          <Stat label="Open leads" value={stats.leads} />
          <Stat label="Invoices" value={stats.invoices} />
        </div>

        <div className="rounded-lg border border-dashed border-[var(--line-2)] bg-[var(--surface)] p-6">
          <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink-3)] mb-2">
            Next up
          </div>
          <p className="text-sm text-[var(--ink-2)]">
            Activity feed, recent messages, and overdue tasks will land here.
            See <code className="text-[var(--ink)]">prototype/index.html</code>{" "}
            for the target design.
          </p>
        </div>
      </div>
    </>
  );
}
