import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md border border-[var(--line-2)] bg-[var(--surface)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[var(--focus)] focus:border-[var(--accent)]",
          className,
        )}
        {...props}
      />
    );
  },
);
