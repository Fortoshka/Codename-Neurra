import "server-only";

import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST?.trim();
const smtpPort = Number(process.env.SMTP_PORT ?? 0);
const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.trim();
const smtpFrom = process.env.SMTP_FROM?.trim();

function getTransport() {
  if (!smtpHost || !smtpPort || !smtpFrom) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transport = getTransport();
  if (!transport || !smtpFrom) {
    return false;
  }

  await transport.sendMail({
    from: smtpFrom,
    to,
    subject: "Сброс пароля Neurra",
    text: `Чтобы сбросить пароль, перейдите по ссылке: ${resetUrl}`,
    html: `<p>Чтобы сбросить пароль, перейдите по ссылке:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  return true;
}
