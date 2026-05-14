"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction, type ActionState } from "../actions";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const reset = params.get("reset");
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, null);
  const errs = state && !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <>
      <h1 className="text-center font-display text-2xl mb-1">Welcome back</h1>
      <p className="text-center text-sm text-[var(--ink-2)] mb-6">
        Sign in to your OnVex account
      </p>

      {reset === "ok" && (
        <div className="mb-4 rounded-md bg-[var(--ok-soft)] px-3 py-2 text-xs text-[var(--ok)]">
          Password updated. Sign in with your new password.
        </div>
      )}

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <Field label="Email" error={errs.email}>
          <Input name="email" type="email" autoComplete="email" required placeholder="you@onvex.dev" />
        </Field>
        <Field label="Password" error={errs.password}>
          <Input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
        </Field>

        <div className="text-right text-xs">
          <Link href="/forgot-password" className="text-[var(--accent)] hover:underline">
            Forgot password?
          </Link>
        </div>

        {state && !state.ok && !Object.keys(errs).length && (
          <div className="rounded-md bg-[var(--danger-soft)] px-3 py-2 text-xs text-[var(--danger)]">
            {state.error}
          </div>
        )}

        <Button type="submit" disabled={pending} size="lg" className="w-full">
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--ink-2)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[var(--accent)] hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
