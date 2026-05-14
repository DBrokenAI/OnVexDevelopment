"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type ActionState } from "../actions";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(signupAction, null);
  const errs = state && !state.ok ? state.fieldErrors ?? {} : {};

  if (state?.ok) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl mb-2">Check your inbox</h1>
        <p className="text-sm text-[var(--ink-2)] mb-6">
          We sent a confirmation link to your email. Click it to finish creating your account.
        </p>
        <Link href="/login">
          <Button size="lg" className="w-full">
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center font-display text-2xl mb-1">Create your account</h1>
      <p className="text-center text-sm text-[var(--ink-2)] mb-6">Get started in under 2 minutes</p>

      <form action={action} className="flex flex-col gap-4">
        <Field label="Full name" error={errs.full_name}>
          <Input name="full_name" type="text" autoComplete="name" required />
        </Field>
        <Field label="Work email" error={errs.email}>
          <Input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </Field>
        <Field
          label="Password"
          error={errs.password}
          hint="At least 8 characters"
        >
          <Input name="password" type="password" autoComplete="new-password" required />
        </Field>

        {state && !state.ok && !Object.keys(errs).length && (
          <div className="rounded-md bg-[var(--danger-soft)] px-3 py-2 text-xs text-[var(--danger)]">
            {state.error}
          </div>
        )}

        <Button type="submit" disabled={pending} size="lg" className="w-full">
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[10px] text-[var(--ink-3)]">
        By signing up, you agree to our Terms and Privacy Policy.
      </p>

      <p className="mt-4 text-center text-xs text-[var(--ink-2)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--accent)] hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
