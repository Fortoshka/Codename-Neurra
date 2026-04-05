import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { StarsBackground } from "@/components/StarsBackground";
import { LogoutButton } from "@/components/LogoutButton";

export default async function CabinetPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rows, error } = await supabase
    .from("purchased_services")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    (profile?.name && profile.name.trim()) ||
    (typeof user.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    profile?.email ||
    user.email ||
    "Пользователь";

  return (
    <>
      <StarsBackground />
      <div className="container cabinet-page">
        <header className="header header--viewport cabinet-header">
          <div className="cabinet-nav-group">
            <Link href="/" className="login-btn">
              На главную
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="cabinet-main">
          <h1 className="cabinet-user-name">{displayName}</h1>
          <h2 className="cabinet-section-title">Приобретённые услуги</h2>
          {error ? <p className="auth-error">{error.message}</p> : null}
          <div className="table-wrap">
            <table className="purchases-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>id</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {!rows?.length ? (
                  <tr>
                    <td colSpan={3} className="empty-cell">
                      Нет записей
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td className="mono">{row.id}</td>
                      <td>
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString("ru-RU")
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
