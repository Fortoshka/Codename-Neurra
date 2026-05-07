"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import type { AuthFormState } from "@/types/auth";

const initialState: AuthFormState = { error: null, success: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="login-btn auth-submit" type="submit" disabled={pending}>
      {pending ? "Регистрация…" : "Зарегистрироваться"}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <form className="auth-form" action={formAction}>
      <label className="auth-label">
        Имя
        <input
          className="auth-input"
          type="text"
          name="name"
          autoComplete="name"
          required
          minLength={1}
        />
      </label>
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
      <label className="auth-label">
        Пароль
        <input
          className="auth-input"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={6}
        />
      </label>
      {state.error ? <p className="auth-error">{state.error}</p> : null}
      <SubmitButton />
      <p className="auth-switch">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="auth-link">
          Войти
        </Link>
      </p>
    </form>
  );
}
