import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { StarsBackground } from "@/components/StarsBackground";
import { LogoutButton } from "@/components/LogoutButton";

export default async function CabinetPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  let rows = [] as Array<{ id: string; name: string; createdAt: Date }>;
  let errorMessage: string | null = null;

  try {
    rows = await prisma.purchasedService.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    errorMessage = "Не удалось загрузить услуги. Попробуйте позже.";
  }

  const displayName = user.name?.trim() || user.email || "Пользователь";

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
          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
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
                        {row.createdAt
                          ? row.createdAt.toLocaleString("ru-RU")
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
