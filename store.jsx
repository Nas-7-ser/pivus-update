/* PIVUS — Content store, inline-edit primitive, auth, and routing.
 *
 * Loaded before the section components. Exposes (as shared globals, the way the
 * other PIVUS babel scripts already share React hooks):
 *   - ContentProvider / useContent  : editable content + edit mode state
 *   - T                             : inline-editable text node (shows a pencil
 *                                     and becomes contentEditable in admin mode)
 *   - PIVUS_AUTH                    : login / logout / token helpers
 *   - useRoute                      : tiny path-based router (/, /admin, /cgu, /cgv)
 */

const { createContext, useContext } = React;

/* ---------- path + merge helpers ---------- */
function pvGet(obj, path) {
  return String(path).split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function pvSet(obj, path, value) {
  const keys = String(path).split('.');
  const root = Array.isArray(obj) ? obj.slice() : { ...obj };
  let cur = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const child = cur[k];
    cur[k] = Array.isArray(child) ? child.slice() : { ...(child || {}) };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return root;
}

// Saved content (from server) wins for primitives; defaults fill any gaps so new
// fields added in code keep working even against an older saved content.json.
function pvMerge(base, over) {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) {
    const b = Array.isArray(base) ? base : [];
    const o = Array.isArray(over) ? over : [];
    const len = Math.max(b.length, o.length);
    const out = [];
    for (let i = 0; i < len; i++) out.push(pvMerge(b[i], o[i]));
    return out;
  }
  if (typeof base === 'object' && base !== null && typeof over === 'object') {
    const out = { ...base };
    Object.keys(over).forEach((k) => { out[k] = pvMerge(base[k], over[k]); });
    return out;
  }
  return over;
}

/* ---------- auth ---------- */
const PIVUS_AUTH = {
  getToken() { try { return localStorage.getItem('pivus_admin_token'); } catch (e) { return null; } },
  setToken(t) { try { localStorage.setItem('pivus_admin_token', t); } catch (e) {} },
  clear() { try { localStorage.removeItem('pivus_admin_token'); } catch (e) {} },
  _expired(token) {
    try {
      const p = token.split('.')[1];
      if (!p) return true;
      const pad = p + '='.repeat((4 - (p.length % 4)) % 4);
      const payload = JSON.parse(atob(pad.replace(/-/g, '+').replace(/_/g, '/')));
      return !!(payload.exp && Date.now() > payload.exp);
    } catch (e) { return false; }
  },
  isLoggedIn() {
    const t = PIVUS_AUTH.getToken();
    if (!t) return false;
    if (PIVUS_AUTH._expired(t)) { PIVUS_AUTH.clear(); return false; }
    return true;
  },
  async login(password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      let msg = 'Échec de la connexion';
      try { msg = (await res.json()).error || msg; } catch (e) {}
      throw new Error(msg);
    }
    const data = await res.json();
    PIVUS_AUTH.setToken(data.token);
    return data.token;
  },
  async logout() {
    const t = PIVUS_AUTH.getToken();
    try {
      await fetch('/api/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + t } });
    } catch (e) {}
    PIVUS_AUTH.clear();
  },
};
window.PIVUS_AUTH = PIVUS_AUTH;

/* ---------- content context ---------- */
const PIVUS_CTX = createContext(null);

function useContent() {
  const ctx = useContext(PIVUS_CTX);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

/* ---------- i18n helpers ---------- */
const PIVUS_LANGS = ['fr', 'en'];
// Language-independent values kept identical across every language tree
// (FR is canonical). Editing them mirrors the value into all languages.
const PIVUS_SHARED_RE = [
  /^site\.email$/,
  /^video\.(url|poster)$/,
  /^team\.members\.\d+\.image$/,
  /^useCases\.items\.\d+\.image$/,
];
function pvIsShared(path) { return PIVUS_SHARED_RE.some((re) => re.test(path)); }
function pvClone(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); }

// Align a list of objects from FR (canonical) into another language, enforcing
// FR's item count/order while keeping each language's own translatable fields.
// `sharedKeys` are copied from FR (e.g. images); everything else falls back to
// FR only when the target language has no value yet.
function pvAlignList(srcArr, dstArr, sharedKeys) {
  const src = Array.isArray(srcArr) ? srcArr : [];
  const dst = Array.isArray(dstArr) ? dstArr : [];
  return src.map((s, i) => {
    const d = dst[i] && typeof dst[i] === 'object' ? dst[i] : {};
    const out = { ...s, ...d };
    sharedKeys.forEach((k) => { out[k] = s[k] !== undefined ? s[k] : (d[k] || ''); });
    return out;
  });
}

// Sync shared values + list structures (team, use cases) from FR into the other
// languages so images/emails/video stay identical and counts stay aligned.
function pvMirrorShared(store) {
  const src = store.fr;
  PIVUS_LANGS.forEach((L) => {
    if (L === 'fr') return;
    const t = store[L];
    if (src.site) t.site = pvClone(src.site);
    t.video = { ...(t.video || {}), url: (src.video || {}).url || '', poster: (src.video || {}).poster || '' };
    if (!t.team) t.team = {};
    t.team.members = pvAlignList((src.team || {}).members, (t.team || {}).members, ['image']);
    if (!t.useCases) t.useCases = {};
    t.useCases.items = pvAlignList((src.useCases || {}).items, (t.useCases || {}).items, ['image']);
  });
  return store;
}

function ContentProvider({ children }) {
  const defaultsFR = window.PIVUS_CONTENT_DEFAULTS;
  const defaultsEN = window.PIVUS_CONTENT_EN || window.PIVUS_CONTENT_DEFAULTS;

  const [lang, setLangState] = React.useState(() => {
    try { return localStorage.getItem('pivus_lang') === 'en' ? 'en' : 'fr'; } catch (e) { return 'fr'; }
  });
  const [theme, setThemeState] = React.useState(() => {
    try { return localStorage.getItem('pivus_theme') === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; }
  });
  const [store, setStore] = React.useState(() =>
    pvMirrorShared({ fr: pvClone(defaultsFR), en: pvClone(defaultsEN) })
  );
  const [loaded, setLoaded] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(PIVUS_AUTH.isLoggedIn());
  const [preview, setPreview] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('pivus_theme', theme); } catch (e) {}
  }, [theme]);
  React.useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('pivus_lang', lang); } catch (e) {}
  }, [lang]);

  React.useEffect(() => {
    let alive = true;
    fetch('/api/content')
      .then((r) => (r.ok ? r.json() : {}))
      .then((saved) => {
        if (!alive) return;
        saved = saved || {};
        const bilingual = !!(saved.fr || saved.en);
        const frSaved = bilingual ? (saved.fr || {}) : (Object.keys(saved).length ? saved : {});
        const enSaved = bilingual ? (saved.en || {}) : {};
        const next = pvMirrorShared({
          fr: pvMerge(defaultsFR, frSaved),
          en: pvMerge(defaultsEN, enSaved),
        });
        setStore(next);
        setLoaded(true);
      })
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);

  const setLang = React.useCallback((l) => setLangState(l === 'en' ? 'en' : 'fr'), []);
  const setTheme = React.useCallback((t) => setThemeState(t === 'light' ? 'light' : 'dark'), []);
  const toggleTheme = React.useCallback(() => setThemeState((t) => (t === 'light' ? 'dark' : 'light')), []);

  const update = React.useCallback((path, value) => {
    setStore((prev) => {
      const next = { fr: prev.fr, en: prev.en };
      if (pvIsShared(path)) {
        PIVUS_LANGS.forEach((L) => { next[L] = pvSet(next[L], path, value); });
      } else {
        next[lang] = pvSet(next[lang], path, value);
      }
      return next;
    });
    setDirty(true);
  }, [lang]);

  const addMember = React.useCallback(() => {
    setStore((prev) => {
      const next = { fr: prev.fr, en: prev.en };
      const frM = { image: '', name: 'Prénom Nom', role: 'Poste / fonction', bio: 'Courte description du parcours et du rôle. À personnaliser.' };
      const enM = { image: '', name: 'First Last', role: 'Role / position', bio: 'Short description of the background and role. To be personalized.' };
      next.fr = pvSet(next.fr, 'team.members', [...((next.fr.team && next.fr.team.members) || []), frM]);
      next.en = pvSet(next.en, 'team.members', [...((next.en.team && next.en.team.members) || []), enM]);
      return next;
    });
    setDirty(true);
  }, []);

  const removeMember = React.useCallback((i) => {
    setStore((prev) => {
      const next = { fr: prev.fr, en: prev.en };
      PIVUS_LANGS.forEach((L) => {
        const arr = ((next[L].team && next[L].team.members) || []).slice();
        arr.splice(i, 1);
        next[L] = pvSet(next[L], 'team.members', arr);
      });
      return next;
    });
    setDirty(true);
  }, []);

  const moveMember = React.useCallback((i, dir) => {
    setStore((prev) => {
      const len = ((prev.fr.team && prev.fr.team.members) || []).length;
      const j = i + dir;
      if (j < 0 || j >= len) return prev;
      const next = { fr: prev.fr, en: prev.en };
      PIVUS_LANGS.forEach((L) => {
        const arr = ((next[L].team && next[L].team.members) || []).slice();
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        next[L] = pvSet(next[L], 'team.members', arr);
      });
      return next;
    });
    setDirty(true);
  }, []);

  // Generic list CRUD on any array path, applied to every language so structure
  // stays aligned. `frItem`/`enItem` are the per-language default new entries.
  const addListItem = React.useCallback((path, frItem, enItem) => {
    setStore((prev) => {
      const next = { fr: prev.fr, en: prev.en };
      next.fr = pvSet(next.fr, path, [...(pvGet(next.fr, path) || []), pvClone(frItem)]);
      next.en = pvSet(next.en, path, [...(pvGet(next.en, path) || []), pvClone(enItem || frItem)]);
      return next;
    });
    setDirty(true);
  }, []);

  const removeListItem = React.useCallback((path, i) => {
    setStore((prev) => {
      const next = { fr: prev.fr, en: prev.en };
      PIVUS_LANGS.forEach((L) => {
        const arr = (pvGet(next[L], path) || []).slice();
        arr.splice(i, 1);
        next[L] = pvSet(next[L], path, arr);
      });
      return next;
    });
    setDirty(true);
  }, []);

  const moveListItem = React.useCallback((path, i, dir) => {
    setStore((prev) => {
      const len = (pvGet(prev.fr, path) || []).length;
      const j = i + dir;
      if (j < 0 || j >= len) return prev;
      const next = { fr: prev.fr, en: prev.en };
      PIVUS_LANGS.forEach((L) => {
        const arr = (pvGet(next[L], path) || []).slice();
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        next[L] = pvSet(next[L], path, arr);
      });
      return next;
    });
    setDirty(true);
  }, []);

  const save = React.useCallback(async () => {
    const token = PIVUS_AUTH.getToken();
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ content: store }),
    });
    if (!res.ok) {
      if (res.status === 401) { setLoggedIn(false); PIVUS_AUTH.clear(); }
      let msg = "Échec de l'enregistrement";
      try { msg = (await res.json()).error || msg; } catch (e) {}
      throw new Error(msg);
    }
    setDirty(false);
  }, [store]);

  const editing = loggedIn && !preview;
  const content = store[lang];

  const value = {
    content, loaded, dirty, editing, loggedIn, preview, lang, theme,
    update, save, setLoggedIn, setPreview, setDirty,
    setLang, setTheme, toggleTheme,
    addMember, removeMember, moveMember,
    addListItem, removeListItem, moveListItem,
  };
  return React.createElement(PIVUS_CTX.Provider, { value }, children);
}

/* ---------- inline-editable text ---------- */
// Renders plain text normally. In admin mode it is NOT editable by default:
// it shows a pencil affordance and only becomes contentEditable when clicked
// (opt-in per element), so clicks don't interfere with nearby buttons/links.
// Commits on blur, cancels on Escape.
function T({ id, as = 'span', className, style, placeholder, multiline = true }) {
  const { content, editing, update } = useContent();
  const [active, setActive] = React.useState(false);
  const ref = React.useRef(null);
  const raw = pvGet(content, id);
  const val = raw == null ? '' : String(raw);
  const ph = placeholder || 'Texte à compléter…';

  // Focus + place caret at the end when a field is activated.
  React.useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    el.focus();
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {}
  }, [active]);

  if (!editing) {
    // View mode: expand dynamic tokens (e.g. {email}) from the global site
    // settings so a single value stays in sync across the whole site.
    const display = val.replace(/\{email\}/g, pvGet(content, 'site.email') || '');
    return React.createElement(as, { className, style }, display);
  }

  const cls = 'pv-editable' + (className ? ' ' + className : '');

  // Admin, not currently editing this element: plain text + click-to-edit.
  if (!active) {
    return React.createElement(as, {
      className: cls,
      style,
      title: 'Cliquer pour modifier',
      'data-pv-empty': ph,
      onClick: (e) => { e.preventDefault(); e.stopPropagation(); setActive(true); },
    }, val);
  }

  // Active: this element only is contentEditable.
  return React.createElement(as, {
    ref,
    className: cls + ' pv-active',
    style,
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    'data-pv-empty': ph,
    onBlur: (e) => {
      // textContent (not innerText) so CSS text-transform/letter-spacing does not
      // leak into the stored value.
      const txt = e.currentTarget.textContent.replace(/\s+/g, ' ').trim();
      if (txt !== val) update(id, txt);
      setActive(false);
    },
    onKeyDown: (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.currentTarget.blur(); }
      if (!multiline && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
    },
  }, val);
}

/* ---------- routing ---------- */
// Returns { name, id? }. Client-side routes fall back to the SPA shell server-side.
function pvRoute() {
  const p = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  if (p === '/admin') return { name: 'admin' };
  if (p === '/cgu') return { name: 'cgu' };
  if (p === '/cgv') return { name: 'cgv' };
  if (p === '/equipe' || p === '/team') return { name: 'equipe' };
  if (p === '/cas-usage' || p === '/use-cases') return { name: 'usecases' };
  const m = p.match(/^\/(?:cas-usage|use-cases)\/(\d+)$/);
  if (m) return { name: 'usecase', id: Number(m[1]) };
  return { name: 'home' };
}

// Global client-side navigation (keeps React state — e.g. unsaved admin edits).
function pvGoto(path) {
  if (path === window.location.pathname) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

function useRoute() {
  const [route, setRoute] = React.useState(pvRoute());
  React.useEffect(() => {
    const on = () => setRoute(pvRoute());
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  const navigate = React.useCallback((path) => {
    if (path === window.location.pathname) return;
    window.history.pushState({}, '', path);
    setRoute(pvRoute());
    window.scrollTo(0, 0);
  }, []);
  return [route, navigate];
}

/* ---------- admin-only media fields (URL / path) ---------- */
function AdminField({ id, label, placeholder }) {
  const { content, editing, update } = useContent();
  if (!editing) return null;
  const val = pvGet(content, id) || '';
  return (
    <div className="pv-admin-field">
      <label>{label}</label>
      <input
        type="text"
        value={val}
        placeholder={placeholder}
        onChange={(e) => update(id, e.target.value)}
      />
    </div>
  );
}

function MediaImage({ id, alt, className }) {
  const { content } = useContent();
  const src = String(pvGet(content, id) || '').trim();
  return (
    <div className="pv-media-wrap">
      {src ? (
        <img src={src} alt={alt} className={className} />
      ) : (
        <div className={className + ' pv-img-ph'} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="11" r="2" />
            <path d="M21 16l-5.5-5.5a1.5 1.5 0 0 0-2.1 0L7 17" />
          </svg>
          <span>Photo à ajouter</span>
        </div>
      )}
      <AdminField id={id} label="URL de la photo" placeholder="uploads/nom.png ou https://…" />
    </div>
  );
}

function pvVideoEmbed(url) {
  const u = String(url || '').trim();
  if (!u) return null;
  let m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (m) return { type: 'iframe', src: 'https://www.youtube.com/embed/' + m[1] };
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { type: 'iframe', src: 'https://player.vimeo.com/video/' + m[1] };
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(u)) return { type: 'video', src: u };
  if (/youtube\.com\/embed|player\.vimeo\.com/.test(u)) return { type: 'iframe', src: u };
  return { type: 'iframe', src: u };
}

Object.assign(window, {
  ContentProvider, useContent, T, useRoute, pvGoto, pvGet, pvSet,
  AdminField, MediaImage, pvVideoEmbed,
});
