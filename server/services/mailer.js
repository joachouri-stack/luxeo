/* ============================================
   MAILER — Nodemailer SMTP wrapper
   ============================================ */
import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Configuration SMTP incomplète (SMTP_HOST / SMTP_USER / SMTP_PASS).');
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL si 465, sinon STARTTLS
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });

  return transporter;
}

export async function verifyMailer() {
  try {
    const t = getTransporter();
    await t.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/**
 * Envoie l'email principal à info@luxeo.pro avec pièces jointes.
 */
export async function sendQuoteEmail({ to, replyTo, subject, html, attachments }) {
  const t = getTransporter();
  const from = process.env.SMTP_FROM || `"Luxeo Composer" <${process.env.SMTP_USER}>`;

  return t.sendMail({
    from,
    to,
    replyTo,
    subject,
    html,
    attachments,
  });
}

/**
 * Email de confirmation simple au client.
 */
export async function sendClientConfirmation({ to, prenom, html }) {
  const t = getTransporter();
  const from = process.env.SMTP_FROM || `"Luxeo" <${process.env.SMTP_USER}>`;
  return t.sendMail({
    from,
    to,
    subject: 'Votre demande de devis Luxeo a bien été reçue',
    html,
  });
}
