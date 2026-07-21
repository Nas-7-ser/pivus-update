import { adminPassword, isAuthed, issueAuthToken } from './lib/auth.mjs';
import { currentRecipient, loadContent, saveContent } from './lib/content.mjs';
import { sendEmail, smtpConfigured } from './lib/mail.mjs';

function json(status, payload) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(payload),
  };
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
}

function routePath(event) {
  const raw = event.path || event.rawUrl || '';
  try {
    const u = new URL(raw, 'http://localhost');
    return u.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return String(raw).split('?')[0].replace(/\/+$/, '') || '/';
  }
}

export async function handler(event) {
  const method = (event.httpMethod || 'GET').toUpperCase();
  const path = routePath(event);
  const headers = event.headers || {};

  if (path === '/api/health' && method === 'GET') {
    return json(200, { ok: true, runtime: 'netlify' });
  }

  if (path === '/api/content' && method === 'GET') {
    const data = await loadContent();
    return json(200, data);
  }

  if (path === '/api/login' && method === 'POST') {
    const body = parseBody(event);
    if (String(body.password || '') !== adminPassword()) {
      return json(401, { error: 'Mot de passe incorrect' });
    }
    return json(200, { token: issueAuthToken() });
  }

  if (path === '/api/logout' && method === 'POST') {
    // JWT is stateless — client drops the token.
    return json(200, { ok: true });
  }

  if (path === '/api/content' && method === 'POST') {
    if (!isAuthed(headers)) return json(401, { error: 'Non autorisé' });
    const body = parseBody(event);
    const content = body.content ?? body;
    try {
      await saveContent(content);
      return json(200, { ok: true });
    } catch (err) {
      return json(500, { error: `Échec de l'enregistrement: ${err.message}` });
    }
  }

  if (path === '/api/email-status' && method === 'GET') {
    if (!isAuthed(headers)) return json(401, { error: 'Non autorisé' });
    const data = await loadContent();
    return json(200, {
      smtp_configured: smtpConfigured(),
      recipient: currentRecipient(data),
    });
  }

  if (path === '/api/test-email' && method === 'POST') {
    if (!isAuthed(headers)) return json(401, { error: 'Non autorisé' });
    const data = await loadContent();
    const recipient = currentRecipient(data);
    if (!smtpConfigured()) {
      return json(200, {
        ok: true,
        emailed: false,
        recipient,
        message: "SMTP non configuré — le formulaire utilise mailto:. Configurez PIVUS_SMTP_HOST pour activer l'envoi depuis l'admin.",
      });
    }
    const body = [
      "Ceci est un email de test envoyé depuis l'administration du site PIVUS.",
      'Si vous recevez ce message, l\'envoi d\'emails fonctionne correctement.',
      '',
      `Envoyé le : ${new Date().toISOString()}`,
    ].join('\n');
    try {
      await sendEmail({ to: recipient, subject: "PIVUS — Test d'envoi d'email", body });
      return json(200, {
        ok: true,
        emailed: true,
        recipient,
        message: `Email de test envoyé à ${recipient}. Vérifiez la boîte de réception.`,
      });
    } catch (err) {
      return json(200, {
        ok: false,
        emailed: false,
        recipient,
        message: `Échec de l'envoi : ${err.message}`,
      });
    }
  }

  return json(404, { error: 'Not found' });
}
