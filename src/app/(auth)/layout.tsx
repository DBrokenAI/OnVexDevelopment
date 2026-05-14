import { BrandLockup } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--bg)]">
      <div className="w-full max-w-[400px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <BrandLockup />
        </div>
        {children}
      </div>
    </div>
  );
}
