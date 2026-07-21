import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getStore } from '@netlify/blobs';
import seed from '../../../content.json' with { type: 'json' };

const BLOB_KEY = 'content';
const STORE_NAME = 'pivus-content';

function localFilePath() {
  try {
    return join(dirname(fileURLToPath(import.meta.url)), '../../../content.json');
  } catch {
    return join(process.cwd(), 'content.json');
  }
}

function blobStore() {
  return getStore({ name: STORE_NAME });
}

export async function loadContent() {
  try {
    const store = blobStore();
    const saved = await store.get(BLOB_KEY, { type: 'json' });
    if (saved && typeof saved === 'object' && Object.keys(saved).length) return saved;
  } catch {
    // Missing Blobs env (local) or transient Blobs errors → fall back to seed.
  }
  return seed && typeof seed === 'object' ? seed : {};
}

export async function saveContent(data) {
  try {
    const store = blobStore();
    await store.setJSON(BLOB_KEY, data);
    return;
  } catch (err) {
    // Local/dev fallback only — Lambda filesystem is read-only aside from /tmp.
    try {
      writeFileSync(localFilePath(), JSON.stringify(data, null, 2), 'utf8');
      return;
    } catch {
      throw err;
    }
  }
}

export function currentRecipient(data) {
  const fallback = process.env.PIVUS_CONTACT_TO || 'team@pivus-systems.com';
  const site = (data?.fr || {}).site || data?.site || {};
  const email = String(site.email || '').trim();
  return email.includes('@') ? email : fallback;
}
