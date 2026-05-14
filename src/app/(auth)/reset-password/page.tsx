"use client";

import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "../actions";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    null,
  );
  const errs = state && !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <>
      <h1 className="text-center font-display text-2xl mb-1">Set a new password</h1>
      <p className="text-center text-sm text-[var(--ink-2)] mb-6">
        Enter a new password for your account
      </p>

      <form action={action} className="flex flex-col gap-4">
        <Field label="New password" error={errs.password} hint="At least 8 characters">
          <Input name="password" type="password" autoComplete="new-password" required />
        </Field>
        <Field label="Confirm password" error={errs.confirm}>
          <Input name="confirm" type="password" autoComplete="new-password" required />
        </Field>

        {state && !state.ok && !Object.keys(errs).length && (
          <div className="rounded-md bg-[var(--danger-soft)] px-3 py-2 text-xs text-[var(--danger)]">
            {state.error}
          </div>
        )}

        <Button type="submit" disabled={pending} size="lg" className="w-full">
          {pending ? "Updating..." : "Update password"}
        </Button>
      </form>
    </>
  );
}
