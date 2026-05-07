"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/utils/db";
import {
  clearSession,
  consumePasswordResetToken,
  createPasswordResetToken,
  createSession,
  getSessionToken,
  hashPassword,
  verifyPassword,
} from "@/utils/auth";
import { sendPasswordResetEmail } from "@/utils/mailer";
import type { AuthFormState } from "@/types/auth";

const registrationEnabled = process.env.REGISTRATION_ENABLED === "true";
const appUrl = (process.env.APP_URL?.trim() || "http://localhost:3000").replace(
  /\/$/,
  ""
);

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getRawString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getRawString(formData, "password");

  if (!email || !password) {
    return { error: "Укажите email и пароль." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "Неверный email или пароль." };
  }

  const validPassword = await verifyPassword(password, user.passwordHash);
  if (!validPassword) {
    return { error: "Неверный email или пароль." };
  }

  await createSession(user.id);
  redirect("/cabinet");
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  if (!registrationEnabled) {
    return { error: "Регистрация временно недоступна." };
  }

  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const password = getRawString(formData, "password");

  if (!name || !email || !password) {
    return { error: "Заполните все поля." };
  }

  if (password.length < 6) {
    return { error: "Пароль должен быть не короче 6 символов." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Пользователь с таким email уже существует." };
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  await createSession(user.id);
  redirect("/cabinet");
}

export async function logoutAction() {
  const token = getSessionToken();
  await clearSession(token);
  redirect("/");
}

export async function requestPasswordResetAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = getString(formData, "email").toLowerCase();
  if (!email) {
    return { error: "Введите email для восстановления." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = await createPasswordResetToken(user.id);
    const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const sent = await sendPasswordResetEmail(user.email, resetUrl);
    if (!sent) {
      return { error: "Сервис отправки писем не настроен." };
    }
  }

  return {
    error: null,
    success: "Если email зарегистрирован, мы отправили ссылку для сброса пароля.",
  };
}

export async function resetPasswordAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const token = getString(formData, "token");
  const password = getRawString(formData, "password");

  if (!token || !password) {
    return { error: "Заполните все поля." };
  }

  if (password.length < 6) {
    return { error: "Пароль должен быть не короче 6 символов." };
  }

  const user = await consumePasswordResetToken(token);

  if (!user) {
    return { error: "Ссылка недействительна или устарела." };
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ]);

  redirect("/login?reset=1");
}
