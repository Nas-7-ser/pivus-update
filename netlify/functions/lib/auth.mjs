import crypto from 'node:crypto';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function secret() {
  return process.env.PIVUS_JWT_SECRET || process.env.PIVUS_ADMIN_PASSWORD || 'pivus-dev-secret-change-me';
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64url');
}

function signToken() {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({ sub: 'admin', exp: Date.now() + TOKEN_TTL_MS }));
  const sig = crypto.createHmac('sha256', secret()).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [header, payload, sig] = parts;
  const expected = crypto.createHmac('sha256', secret()).update(`${header}.${payload}`).digest('base64url');
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.exp || Date.now() > data.exp) return false;
    return data.sub === 'admin';
  } catch {
    return false;
  }
}

function bearer(headers = {}) {
  const auth = headers.authorization || headers.Authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
}

export function issueAuthToken() {
  return signToken();
}

export function isAuthed(headers) {
  return verifyToken(bearer(headers));
}

export function adminPassword() {
  return process.env.PIVUS_ADMIN_PASSWORD || 'pivus2026';
}
