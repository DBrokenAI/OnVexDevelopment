import { logoutAction } from "@/app/(auth)/actions";

export function Topbar({
  title,
  email,
  role,
}: {
  title: string;
  email: string;
  role: string;
}) {
  return (
    <header className="flex items-center gap-4 border-b border-[var(--line)] bg-[var(--surface)] px-6 py-3 sticky top-0 z-10">
      <h1 className="font-display text-xl">{title}</h1>
      <div className="ml-auto flex items-center gap-3 text-xs text-[var(--ink-2)]">
        <div className="hidden md:flex flex-col items-end leading-tight">
          <span className="text-[var(--ink)] text-sm">{email}</span>
          <span className="uppercase tracking-[0.1em] text-[10px]">{role}</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-md border border-[var(--line-2)] px-3 py-1.5 text-xs text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
