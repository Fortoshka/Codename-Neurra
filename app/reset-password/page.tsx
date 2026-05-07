import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { StarsBackground } from "@/components/StarsBackground";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/cabinet");

  const { token } = await searchParams;

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
          <h1 className="auth-title">Смена пароля</h1>
          {!token ? (
            <>
              <p className="auth-error">Ссылка недействительна.</p>
              <p className="auth-switch">
                <Link href="/forgot-password" className="auth-link">
                  Запросить новую ссылку
                </Link>
              </p>
            </>
          ) : (
            <ResetPasswordForm token={token} />
          )}
        </main>
      </div>
    </>
  );
}
