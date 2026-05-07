import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { StarsBackground } from "@/components/StarsBackground";
import { RegisterForm } from "@/components/RegisterForm";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/cabinet");

  const registrationEnabled = process.env.REGISTRATION_ENABLED === "true";
  if (!registrationEnabled) redirect("/register-unavailable");

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
