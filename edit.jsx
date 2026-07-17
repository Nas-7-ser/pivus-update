/* PIVUS — Édition en ligne + admin (publication EN DIRECT)
 * ----------------------------------------------------------------------------
 * Deux modes, détectés automatiquement :
 *
 *  • MODE LIVE (site déployé avec le backend Netlify) :
 *    - les textes sont chargés depuis /.netlify/functions/content (vus par TOUS),
 *    - la connexion vérifie le mot de passe ADMIN_PASSWORD côté serveur,
 *    - chaque modification est publiée en direct pour tous les visiteurs.
 *
 *  • MODE LOCAL (aperçu, ou déploiement sans backend) :
 *    - repli sur le fichier content-overrides.json + le navigateur,
 *    - connexion via le hachage ci-dessous, export manuel du fichier.
 *
 * Voir DEPLOY-LIVE.md pour activer le mode live.
 * ----------------------------------------------------------------------------
 */
(function () {
const { createContext, useContext, useState, useEffect, useRef, useCallback } = React;

const API_CONTENT = '/.netlify/functions/content';
const API_LOGIN = '/.netlify/functions/login';

/* ---------- Repli local (mode hors-backend) ---------- */
const PIVUS_AUTH = {
  salt: 'pv_s1_a8f3c2e9',
  user: 'admin',
  // SHA-256( salt + ':' + motdepasse ). Défaut local : Pivus!2026
  hash: '368855f0a181da2846566ff2e860c1cd4df90947d34d48d90cd1605dca1c17a4',
  maxAttempts: 5,
};
const SESSION_HOURS = 8;
const LS_CONTENT = 'pivus_content_v1';
const SS_SESSION = 'pivus_admin_session';
const LS_LOCK = 'pivus_admin_lock';

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function isAdminRoute() {
  const p = (location.pathname || '').toLowerCase();
  const h = (location.hash || '').toLowerCase();
  return p.indexOf('admin-pivus') !== -1 || h.indexOf('admin-pivus') !== -1;
}

/* ---------- Session (jeton backend OU marqueur local) ---------- */
function readSessionObj() {
  try {
    const o = JSON.parse(sessionStorage.getItem(SS_SESSION));
    if (!o || !o.exp || Date.now() > o.exp) { sessionStorage.removeItem(SS_SESSION); return null; }
    return o;
  } catch (e) { return null; }
}
function writeSession(token, exp) {
  sessionStorage.setItem(SS_SESSION, JSON.stringify({ token, exp }));
}
function clearSession() { sessionStorage.removeItem(SS_SESSION); }

/* ---------- Verrouillage anti-bruteforce (mode local) ---------- */
function getLock() {
  try { return JSON.parse(localStorage.getItem(LS_LOCK)) || { n: 0, until: 0 }; }
  catch (e) { return { n: 0, until: 0 }; }
}
function setLock(v) { localStorage.setItem(LS_LOCK, JSON.stringify(v)); }

/* ---------- Cache local des overrides ---------- */
function loadLocalOverrides() {
  try { return JSON.parse(localStorage.getItem(LS_CONTENT)) || {}; }
  catch (e) { return {}; }
}
function saveLocalOverrides(o) { localStorage.setItem(LS_CONTENT, JSON.stringify(o)); }

/* ============================================================
 *  Contexte de contenu
 * ============================================================ */
const ContentCtx = createContext(null);

function ContentProvider({ children }) {
  const [base, setBase] = useState({});            // textes publiés (vus par tous)
  const [local, setLocal] = useState(() => loadLocalOverrides()); // modifs en attente (ce navigateur)
  const [auth, setAuth] = useState(() => !!readSessionObj());
  const [editing, setEditing] = useState(false);
  const [backend, setBackend] = useState(false);   // backend live disponible ?
  const [status, setStatus] = useState('idle');    // idle | saving | saved | error
  const debRef = useRef(null);

  // Chargement initial : backend live d'abord, sinon fichier statique.
  useEffect(() => {
    let cancelled = false;
    fetch(API_CONTENT, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no-backend'))))
      .then((j) => { if (!cancelled) { setBackend(true); setBase(j || {}); } })
      .catch(() => {
        fetch('content-overrides.json', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : {}))
          .then((j) => { if (!cancelled) setBase(j || {}); })
          .catch(() => {});
      });
    return () => { cancelled = true; };
  }, []);

  // Lecture : null = « supprimé / revenu au texte d'origine » ; '' = contenu vidé (reste vide).
  const get = useCallback((k, def) => {
    if (Object.prototype.hasOwnProperty.call(local, k)) return local[k] === null ? def : local[k];
    if (Object.prototype.hasOwnProperty.call(base, k)) return base[k];
    return def;
  }, [local, base]);

  const set = useCallback((k, v, def) => {
    setLocal((o) => {
      const n = { ...o };
      if (v === def) {
        // Retour exact au texte d'origine -> on retire l'override (et on annule un override publié).
        if (Object.prototype.hasOwnProperty.call(base, k)) n[k] = null; else delete n[k];
      } else {
        // Toute autre valeur est conservée telle quelle, Y COMPRIS une chaîne vide (suppression du contenu).
        n[k] = v;
      }
      saveLocalOverrides(n);
      return n;
    });
  }, [base]);

  // État fusionné à publier : base + modifications locales (null = clé retirée).
  const merge = useCallback(() => {
    const m = { ...base };
    for (const k in local) {
      if (local[k] === null) delete m[k]; else m[k] = local[k];
    }
    return m;
  }, [base, local]);

  const resetAll = useCallback(() => { setLocal({}); saveLocalOverrides({}); }, []);

  // Publication en direct (backend) : envoie l'ensemble fusionné.
  const publish = useCallback(async (data) => {
    const s = readSessionObj();
    if (!backend || !s || !s.token || s.token === 'local') return false;
    setStatus('saving');
    try {
      const r = await fetch(API_CONTENT, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + s.token },
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error('http ' + r.status);
      setBase(data); setLocal({}); saveLocalOverrides({});
      setStatus('saved');
      setTimeout(() => setStatus((st) => (st === 'saved' ? 'idle' : st)), 2600);
      return true;
    } catch (e) {
      setStatus('error');
      return false;
    }
  }, [backend]);

  // Auto-publication (debounce) après une modification, en mode live connecté.
  useEffect(() => {
    if (!backend || !auth) return;
    const s = readSessionObj();
    if (!s || s.token === 'local') return;
    if (Object.keys(local).length === 0) return;
    clearTimeout(debRef.current);
    debRef.current = setTimeout(() => { publish(merge()); }, 900);
    return () => clearTimeout(debRef.current);
  }, [local, base, backend, auth, publish, merge]);

  const value = {
    get, set, resetAll, publish, merge,
    local, base, auth, setAuth, editing, setEditing,
    backend, setBackend, status,
    count: Object.keys(local).length,
  };
  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
}

/* ============================================================
 *  <Ed> — texte éditable en ligne (robuste : extrait le texte de
 *  n'importe quel children, y compris les wrappers d'édition de la
 *  plateforme). En vue publique sans override, rend les children
 *  d'origine intacts.
 * ============================================================ */
function extractText(node) {
  if (node == null || node === false || node === true) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) return extractText(node.props && node.props.children);
  return '';
}

function Ed({ k, children, as, className }) {
  const ctx = useContext(ContentCtx);
  const def = extractText(children);
  const Tag = as || 'span';
  const editable = ctx.auth && ctx.editing;
  const ref = useRef(null);
  const text = ctx.get(k, def);
  const hasOverride = text !== def;
  const cls = 'ed' + (editable ? ' ed-on' : '') + (className ? ' ' + className : '');

  if (!editable && !hasOverride) {
    return <Tag className={cls} data-ek={k}>{children}</Tag>;
  }

  const onBlur = (e) => {
    const v = e.target.innerText.replace(/\u00a0/g, ' ').trim();
    if (v !== text) ctx.set(k, v, def);
  };
  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.target.blur(); }
    if (e.key === 'Escape') { e.target.innerText = text; e.target.blur(); }
  };

  return (
    <Tag
      ref={ref}
      className={cls}
      data-ek={k}
      contentEditable={editable}
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={editable ? onBlur : undefined}
      onKeyDown={editable ? onKey : undefined}
      onClick={editable ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
      title={editable ? 'Cliquez pour modifier · Entrée pour valider · Échap pour annuler' : undefined}
    >{text}</Tag>
  );
}

/* ============================================================
 *  Connexion admin (route /admin-pivus)
 * ============================================================ */
function AdminLogin({ onClose }) {
  const ctx = useContext(ContentCtx);
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [lockMsg, setLockMsg] = useState('');

  useEffect(() => {
    const lk = getLock();
    if (lk.until > Date.now()) tick(lk.until);
    function tick(until) {
      const left = Math.ceil((until - Date.now()) / 1000);
      if (left <= 0) { setLockMsg(''); return; }
      setLockMsg('Trop de tentatives. Réessayez dans ' + left + ' s.');
      setTimeout(() => tick(until), 1000);
    }
  }, []);

  const success = () => { ctx.setAuth(true); ctx.setEditing(true); onClose(); };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const lk = getLock();
    if (lk.until > Date.now()) return;
    setBusy(true);

    // 1) Tentative backend live
    try {
      const r = await fetch(API_LOGIN, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: p }),
      });
      if (r.ok) {
        const { token, exp } = await r.json();
        writeSession(token, exp);
        ctx.setBackend(true);
        setLock({ n: 0, until: 0 });
        setBusy(false);
        success();
        return;
      }
      if (r.status === 401) { setBusy(false); registerFail(lk); return; }
      if (r.status === 500) { setBusy(false); setErr('Backend non configuré : définissez ADMIN_PASSWORD sur Netlify (voir DEPLOY-LIVE.md).'); return; }
      // autres statuts -> repli local
    } catch (e) {
      // backend injoignable -> repli local (aperçu / déploiement statique)
    }

    // 2) Repli local (hachage)
    const h = await sha256(PIVUS_AUTH.salt + ':' + p);
    setBusy(false);
    if (u.trim().toLowerCase() === PIVUS_AUTH.user && h === PIVUS_AUTH.hash) {
      writeSession('local', Date.now() + SESSION_HOURS * 3600e3);
      ctx.setBackend(false);
      setLock({ n: 0, until: 0 });
      success();
    } else {
      registerFail(lk);
    }
  };

  function registerFail(lk) {
    const n = (lk.n || 0) + 1;
    const lockNow = n >= PIVUS_AUTH.maxAttempts;
    const until = lockNow ? Date.now() + Math.min(300, 30 * Math.pow(2, n - PIVUS_AUTH.maxAttempts)) * 1000 : 0;
    setLock({ n: lockNow ? 0 : n, until });
    setErr('Identifiants incorrects.' + (n >= 3 && !lockNow ? ' (' + (PIVUS_AUTH.maxAttempts - n) + ' essais restants)' : ''));
    if (lockNow) setLockMsg('Trop de tentatives. Réessayez dans un instant.');
  }

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label="Connexion administrateur">
      <form className="admin-login" onSubmit={submit}>
        <div className="admin-login-mark">
          <img src={window.__resources ? window.__resources.logo : 'assets/pivus-mark.png'} alt="PIVUS" />
        </div>
        <h2>Espace d'administration</h2>
        <p className="admin-login-sub">Accès réservé. Connectez-vous pour modifier le contenu du site.</p>
        <label>Identifiant</label>
        <input value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" autoFocus />
        <label>Mot de passe</label>
        <input type="password" value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" />
        {err && <div className="admin-err">{err}</div>}
        {lockMsg && <div className="admin-lock">{lockMsg}</div>}
        <button type="submit" className="btn btn-primary" disabled={busy || !!lockMsg}>
          {busy ? 'Vérification…' : 'Se connecter'}
        </button>
        <button type="button" className="admin-cancel" onClick={onClose}>Retour au site</button>
      </form>
    </div>
  );
}

/* ============================================================
 *  Barre d'outils admin
 * ============================================================ */
function AdminBar() {
  const ctx = useContext(ContentCtx);
  if (!ctx.auth) return null;

  const logout = () => { clearSession(); ctx.setAuth(false); ctx.setEditing(false); };
  const reset = () => {
    if (ctx.count === 0) return;
    if (confirm('Annuler les modifications non publiées ?')) ctx.resetAll();
  };
  const publishNow = () => ctx.publish(ctx.merge());
  const exportJson = () => {
    const data = JSON.stringify(ctx.merge(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'content-overrides.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  // Message d'état
  let statusEl;
  if (ctx.backend) {
    if (ctx.status === 'saving') statusEl = <span className="admin-count saving">Publication…</span>;
    else if (ctx.status === 'error') statusEl = <span className="admin-count err">Échec — réessayez</span>;
    else if (ctx.count > 0) statusEl = <span className="admin-count">{ctx.count} modif. à publier</span>;
    else statusEl = <span className="admin-count ok">À jour ✓ — visible par tous</span>;
  } else {
    statusEl = <span className="admin-count warn">Mode local — exportez puis redéployez</span>;
  }

  return (
    <div className={'admin-bar' + (ctx.editing ? ' editing' : '')}>
      <span className="admin-brand">
        <span className="admin-dot" /> ADMIN PIVUS
        <span className={'admin-mode ' + (ctx.backend ? 'live' : 'local')}>{ctx.backend ? 'EN DIRECT' : 'LOCAL'}</span>
      </span>
      <label className="admin-switch">
        <input type="checkbox" checked={ctx.editing} onChange={(e) => ctx.setEditing(e.target.checked)} />
        <span className="admin-switch-ui" /> Mode édition
      </label>
      {statusEl}
      <div className="admin-actions">
        {ctx.backend
          ? <button onClick={publishNow} disabled={ctx.count === 0 || ctx.status === 'saving'} title="Publier maintenant pour tous les visiteurs">Publier</button>
          : <button onClick={exportJson} disabled={ctx.count === 0} title="Télécharger content-overrides.json à redéployer">Exporter</button>}
        <button onClick={reset} disabled={ctx.count === 0} className="ghost">Annuler</button>
        <button onClick={logout} className="ghost">Déconnexion</button>
      </div>
    </div>
  );
}

/* ============================================================
 *  Hôte admin : route + overlay
 * ============================================================ */
function AdminHost() {
  const ctx = useContext(ContentCtx);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const check = () => { if (isAdminRoute() && !readSessionObj()) setShowLogin(true); };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  const close = () => {
    setShowLogin(false);
    if ((location.hash || '').toLowerCase().indexOf('admin') !== -1) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  };

  return (
    <React.Fragment>
      {showLogin && !ctx.auth && <AdminLogin onClose={close} />}
      <AdminBar />
    </React.Fragment>
  );
}

window.PIVUS_EDIT = { ContentProvider, ContentCtx, Ed, AdminHost };
})();
