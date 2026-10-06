export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      // The logo keeps its sienna tile in both themes, so it isn't tied to --accent.
      className="flex items-center justify-center rounded-md bg-[#A9431C]"
    >
      <svg
        width={size * 0.66}
        height={size * 0.66}
        viewBox="0 0 24 24"
        fill="none"
        aria-label="OnVex logo"
      >
        <path
          d="M5 6 L11 12 L5 18"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 6 L19 12 L13 18"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function BrandLockup({
  size = 32,
  inverse = false,
}: {
  size?: number;
  /** Set on dark surfaces like the admin sidebar. */
  inverse?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <BrandMark size={size} />
      <div className="flex flex-col leading-tight">
        <span className="font-display text-lg">OnVex</span>
        <span
          className={
            inverse
              ? "text-[10px] tracking-[0.12em] uppercase text-[var(--sidebar-ink-3)]"
              : "text-[10px] tracking-[0.12em] uppercase text-[var(--ink-3)]"
          }
        >
          Web Development
        </span>
      </div>
    </div>
  );
}
