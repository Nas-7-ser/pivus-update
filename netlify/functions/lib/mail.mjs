import nodemailer from 'nodemailer';

export function smtpConfigured() {
  return !!process.env.PIVUS_SMTP_HOST;
}

function transporter() {
  const host = process.env.PIVUS_SMTP_HOST;
  if (!host) return null;
  const port = Number(process.env.PIVUS_SMTP_PORT || '587');
  const user = process.env.PIVUS_SMTP_USER;
  const pass = process.env.PIVUS_SMTP_PASS;
  const secure = process.env.PIVUS_SMTP_TLS === '0';
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

export async function sendEmail({ to, subject, body, replyTo }) {
  const tx = transporter();
  if (!tx) return false;
  const from = process.env.PIVUS_SMTP_FROM || process.env.PIVUS_SMTP_USER || to;
  await tx.sendMail({
    from,
    to,
    subject,
    text: body,
    replyTo: replyTo || undefined,
  });
  return true;
}
