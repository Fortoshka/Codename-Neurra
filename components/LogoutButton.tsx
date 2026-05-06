"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoading(false);
    router.refresh();
    router.push("/");
  }

  return (
    <button
      type="button"
      className="login-btn"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Выход…" : "Выйти"}
    </button>
  );
}
