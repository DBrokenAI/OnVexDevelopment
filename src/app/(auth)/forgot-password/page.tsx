"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type ActionState } from "../actions";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    forgotPasswordAction,
    null,
  );
  const errs = state && !state.ok ? state.fieldErrors ?? {} : {};

  if (state?.ok) {
    return (
      <div className="text-center">
        <h1 className="font-display text-2xl mb-2">Check your inbox</h1>
        <p className="text-sm text-[var(--ink-2)] mb-6">
          If an account exists with that email, we just sent a reset link.
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
      <h1 className="text-center font-display text-2xl mb-1">Reset your password</h1>
      <p className="text-center text-sm text-[var(--ink-2)] mb-6">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <form action={action} className="flex flex-col gap-4">
        <Field label="Email" error={errs.email}>
          <Input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        </Field>

        <Button type="submit" disabled={pending} size="lg" className="w-full">
          {pending ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-[var(--ink-2)]">
        Remember it?{" "}
        <Link href="/login" className="text-[var(--accent)] hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
