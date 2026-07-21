import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getStore } from '@netlify/blobs';

const require = createRequire(import.meta.url);
const BLOB_KEY = 'content';
const STORE_NAME = 'pivus-content';
const LOCAL_FILE = join(dirname(fileURLToPath(import.meta.url)), '../../../content.json');

let seedCache = null;

function loadSeed() {
  if (seedCache) return seedCache;
  try {
    seedCache = require('../../../content.json');
  } catch {
    seedCache = {};
  }
  return seedCache;
}

function blobStore() {
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

function isBlobError(err) {
  return err && (err.name === 'MissingBlobsEnvironmentError' || /Netlify Blobs/.test(String(err.message)));
}

export async function loadContent() {
  try {
    const store = blobStore();
    const saved = await store.get(BLOB_KEY, { type: 'json' });
    if (saved && typeof saved === 'object' && Object.keys(saved).length) return saved;
  } catch (err) {
    if (!isBlobError(err)) throw err;
  }
  try {
    return require('../../../content.json');
  } catch {
    return loadSeed();
  }
}

export async function saveContent(data) {
  try {
    const store = blobStore();
    await store.setJSON(BLOB_KEY, data);
    return;
  } catch (err) {
    if (!isBlobError(err)) throw err;
  }
  writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function currentRecipient(data) {
  const fallback = process.env.PIVUS_CONTACT_TO || 'team@pivus-systems.com';
  const site = (data?.fr || {}).site || data?.site || {};
  const email = String(site.email || '').trim();
  return email.includes('@') ? email : fallback;
}
