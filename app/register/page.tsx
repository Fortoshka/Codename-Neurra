import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { StarsBackground } from "@/components/StarsBackground";
import { RegisterForm } from "@/components/RegisterForm";

export default async function RegisterPage() {
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
          <h1 className="auth-title">Регистрация</h1>
          <RegisterForm />
        </main>
      </div>
    </>
  );
}
