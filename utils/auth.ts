import "server-only";

import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "@/utils/db";

const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME?.trim() || "neurra_session";
const sessionTtlEnv = Number(process.env.SESSION_TTL_DAYS ?? 14);
const SESSION_TTL_DAYS = Number.isFinite(sessionTtlEnv) ? sessionTtlEnv : 14;
const RESET_TTL_MINUTES = 60;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getSessionExpiry() {
  const ttlMs = Math.max(1, SESSION_TTL_DAYS) * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ttlMs);
}

async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = getSessionExpiry();
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 255) || null;
  const ipHeader = requestHeaders.get("x-forwarded-for") || "";
  const ip = ipHeader.split(",")[0]?.trim() || requestHeaders.get("x-real-ip");

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      userAgent,
      ip,
    },
  });

  await setSessionCookie(token, expiresAt);
  return token;
}

export async function clearSession(token?: string | null) {
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }
  await clearSessionCookie();
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) {
    await clearSessionCookie();
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: session.id } });
    await clearSessionCookie();
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function createPasswordResetToken(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return token;
}

export async function consumePasswordResetToken(token: string) {
  const tokenHash = hashToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken) return null;
  if (resetToken.usedAt || resetToken.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  });

  return resetToken.user;
}
