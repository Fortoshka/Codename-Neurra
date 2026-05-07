"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestPasswordResetAction } from "@/app/actions/auth";
import type { AuthFormState } from "@/types/auth";

const initialState: AuthFormState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="login-btn auth-submit" type="submit" disabled={pending}>
      {pending ? "Отправка…" : "Отправить ссылку"}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(requestPasswordResetAction, initialState);

  return (
    <form className="auth-form" action={formAction}>
      <label className="auth-label">
        Email
        <input
          className="auth-input"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </label>
      {state.error ? <p className="auth-error">{state.error}</p> : null}
      {state.success ? <p className="auth-success">{state.success}</p> : null}
      <SubmitButton />
    </form>
  );
}
