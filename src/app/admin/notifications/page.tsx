import { PageHeader } from "@/components/page-header";
import { PushAlertsCard } from "@/components/push-alerts-card";

export default function Page() {
  return (
    <>
      <PageHeader title="Notifications" subtitle="Your inbox of system and client events." />

      <div className="flex max-w-3xl flex-col gap-5">
        <PushAlertsCard />

        <div className="rounded-lg border border-dashed border-[var(--line-2)] bg-[var(--surface)] p-6">
          <div className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--ink-3)]">
            Coming soon
          </div>
          <p className="text-sm text-[var(--ink-2)]">
            Your alert history will be listed here, with a way to choose which events send alerts.
          </p>
        </div>
      </div>
    </>
  );
}
