import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { StarsBackground } from "@/components/StarsBackground";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export default async function ForgotPasswordPage() {
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
          <h1 className="auth-title">Восстановление пароля</h1>
          <p className="auth-description">
            Укажите email, и мы отправим ссылку для сброса пароля.
          </p>
          <ForgotPasswordForm />
          <p className="auth-switch">
            Вспомнили пароль?{" "}
            <Link href="/login" className="auth-link">
              Войти
            </Link>
          </p>
        </main>
      </div>
    </>
  );
}
