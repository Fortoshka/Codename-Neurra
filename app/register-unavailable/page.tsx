import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { StarsBackground } from "@/components/StarsBackground";

export default async function RegisterUnavailablePage() {
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
          <h1 className="auth-title">Регистрация временно недоступна</h1>
          <p className="auth-description">
            В данный момент проект находится в разработке. Мы разрабатываем сайт,
            готовим надёжную базу данных, договариваемся с поставщиками. Сейчас мы
            временно ограничили регистрацию новых пользователей. Уже созданные
            аккаунты не потеряют доступ к приобретённым услугам. Приносим
            извинения за неудобства!
          </p>
          <div className="auth-actions">
            <Link href="/" className="login-btn auth-submit">
              Вернуться на главную
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
