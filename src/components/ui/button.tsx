import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50",
  ghost:
    "bg-transparent text-[var(--ink)] border border-[var(--line-2)] hover:bg-[var(--surface-2)] disabled:opacity-50",
  danger: "bg-[var(--danger)] text-white hover:opacity-90 disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-opacity",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
