"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import type { AuthFormState } from "@/types/auth";

const initialState: AuthFormState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="login-btn auth-submit" type="submit" disabled={pending}>
      {pending ? "Вход…" : "Войти"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form className="auth-form" action={formAction}>
      <label className="auth-label">
        Логин (email)
        <input
          className="auth-input"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </label>
      <label className="auth-label">
        Пароль
        <input
          className="auth-input"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error ? <p className="auth-error">{state.error}</p> : null}
      <SubmitButton />
      <p className="auth-help">
        <Link href="/forgot-password" className="auth-link">
          Забыли пароль?
        </Link>
      </p>
      <p className="auth-switch">
        Нет аккаунта?{" "}
        <Link href="/register-unavailable" className="auth-link">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
