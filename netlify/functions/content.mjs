// PIVUS — Fonction de contenu
//   GET  : renvoie les textes publiés (public, lu par tous les visiteurs)
//   POST : enregistre les textes (réservé admin, jeton requis) -> visible par tous
// Stockage : Netlify Blobs (aucune base de données à gérer).
import { getStore } from '@netlify/blobs';
import crypto from 'node:crypto';

const PW = process.env.ADMIN_PASSWORD || '';
const STORE = 'pivus-content';
const KEY = 'overrides';

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

function verifyToken(token) {
  if (!PW || !token) return false;
  const parts = String(token).split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac('sha256', PW).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && Date.now() < exp;
  } catch (e) { return false; }
}

export default async (req) => {
  const store = getStore(STORE);

  if (req.method === 'GET') {
    const data = await store.get(KEY, { type: 'json' }).catch(() => null);
    return json(data || {});
  }

  if (req.method === 'POST') {
    const auth = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (!verifyToken(auth)) return json({ error: 'unauthorized' }, 401);

    let body;
    try { body = await req.json(); } catch (e) { body = null; }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json({ error: 'invalid_body' }, 400);
    }
    // Garde-fous : clés/valeurs texte, taille raisonnable
    const clean = {};
    for (const k of Object.keys(body)) {
      if (typeof body[k] === 'string' && k.length < 120) clean[k] = body[k].slice(0, 5000);
    }
    await store.setJSON(KEY, clean);
    return json({ ok: true, count: Object.keys(clean).length });
  }

  return json({ error: 'method_not_allowed' }, 405);
};
