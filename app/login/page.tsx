import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { StarsBackground } from "@/components/StarsBackground";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
          <LoginForm />
        </main>
      </div>
    </>
  );
}
