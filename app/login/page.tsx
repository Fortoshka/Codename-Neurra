import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { StarsBackground } from "@/components/StarsBackground";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; reset?: string }>;
}) {
  const { registered, reset } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect("/cabinet");

  return (
    <>
      <StarsBackground />
      <div className="container auth-page">
        <header className="header header--viewport">
          <Link href="/" className="login-btn">
            На главную
          </Link>
        </header>
        <main className="auth-card-wrap">
          <h1 className="auth-title">Вход</h1>
          {registered === "1" ? (
            <p className="auth-success">
              Аккаунт создан. Подтвердите email по ссылке из письма (если включено в
              проекте), затем войдите.
            </p>
          ) : null}
          {reset === "1" ? (
            <p className="auth-success">Пароль обновлён. Войдите с новым паролем.</p>
          ) : null}
          <LoginForm />
        </main>
      </div>
    </>
  );
}
