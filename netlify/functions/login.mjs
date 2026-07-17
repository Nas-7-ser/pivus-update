// PIVUS — Fonction de connexion admin
// Vérifie le mot de passe contre la variable d'environnement ADMIN_PASSWORD
// (configurée dans le tableau de bord Netlify) et renvoie un jeton signé.
import crypto from 'node:crypto';

const PW = process.env.ADMIN_PASSWORD || '';
const SESSION_HOURS = 8;

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  if (!PW) return json({ error: 'admin_password_not_configured' }, 500);

  let body;
  try { body = await req.json(); } catch (e) { body = {}; }
  const password = (body && body.password) || '';

  if (!safeEqual(password, PW)) return json({ error: 'invalid_credentials' }, 401);

  // Jeton : base64url(payload).HMAC-SHA256(payload, ADMIN_PASSWORD)
  const exp = Date.now() + SESSION_HOURS * 3600 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', PW).update(payload).digest('base64url');
  return json({ token: payload + '.' + sig, exp });
};
