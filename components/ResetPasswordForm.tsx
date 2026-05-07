"use client";

import { useFormState, useFormStatus } from "react-dom";
import { resetPasswordAction } from "@/app/actions/auth";
import type { AuthFormState } from "@/types/auth";

const initialState: AuthFormState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="login-btn auth-submit" type="submit" disabled={pending}>
      {pending ? "Сохранение…" : "Сменить пароль"}
    </button>
  );
}

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction] = useFormState(resetPasswordAction, initialState);

  return (
    <form className="auth-form" action={formAction}>
      <input type="hidden" name="token" value={token} />
      <label className="auth-label">
        Новый пароль
        <input
          className="auth-input"
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={6}
          required
        />
      </label>
      {state.error ? <p className="auth-error">{state.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
