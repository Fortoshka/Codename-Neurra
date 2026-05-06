"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error: signError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });
    setLoading(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    if (data.session) {
      router.refresh();
      router.push("/cabinet");
      return;
    }
    router.push("/login?registered=1");
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-label">
        Имя
        <input
          className="auth-input"
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </label>
      {error ? <p className="auth-error">{error}</p> : null}
      <button className="login-btn auth-submit" type="submit" disabled={loading}>
        {loading ? "Регистрация…" : "Зарегистрироваться"}
      </button>
      <p className="auth-switch">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="auth-link">
          Войти
        </Link>
      </p>
    </form>
  );
}
