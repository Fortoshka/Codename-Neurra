"use client";

import { useFormStatus } from "react-dom";
import { logoutAction } from "@/app/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="login-btn" disabled={pending}>
      {pending ? "Выход…" : "Выйти"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <SubmitButton />
    </form>
  );
}
