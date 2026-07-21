/* PIVUS — App: routing (/, /admin, /cgu, /cgv), admin login + edit bar,
 * legal pages, tweaks + montage. */
const { Nav, Hero, Method, Applications, Products, Positioning, VideoDemo, TopControls } = window.PIVUS_COMPONENTS;
const { Contact, Footer } = window.PIVUS_CONTACT;

// Tiny UI-string translator for the few labels that live in code (not content).
function useTr() {
  const { lang } = useContent();
  return (fr, en) => (lang === 'en' ? en : fr);
}

// Keep the currently-focused editable field from blurring (and eating the click)
// when an admin control button is pressed. Without this, clicking delete/move
// while a text field is active does nothing.
const noBlur = (e) => e.preventDefault();

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroStyle": "Plein écran",
  "colormap": "Turbo",
  "accent": "#1f8a7a",
  "arrows": true,
  "flow": 0.5
}/*EDITMODE-END*/;

const HERO_MAP = { 'Plein écran': 'full', 'Panneau': 'panel', 'Sobre': 'sobre' };

/* ---------- Landing ---------- */
function Landing({ tw, t, setTweak }) {
  return (
    <React.Fragment>
      <Nav />
      <Hero tw={tw} />
      <VideoDemo />
      <Method />
      <Applications tw={tw} />
      <Products />
      <Positioning />
      <Contact tw={tw} />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Mise en scène" />
        <TweakRadio label="Style du hero" value={t.heroStyle}
          options={['Plein écran', 'Panneau', 'Sobre']}
          onChange={(v) => setTweak('heroStyle', v)} />
        <TweakSlider label="Intensité du flux" value={t.flow} min={0.5} max={1.7} step={0.1}
          onChange={(v) => setTweak('flow', v)} />

        <TweakSection label="Champs de vitesses" />
        <TweakRadio label="Colormap" value={t.colormap}
          options={['Marine', 'Turbo', 'Mono']}
          onChange={(v) => setTweak('colormap', v)} />
        <TweakToggle label="Vecteurs vitesse" value={t.arrows}
          onChange={(v) => setTweak('arrows', v)} />

        <TweakSection label="Identité" />
        <TweakColor label="Accent" value={t.accent}
          options={['#2f6df0', '#19b3c4', '#5a7bff', '#1f8a7a']}
          onChange={(v) => setTweak('accent', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

/* ---------- Legal pages (CGU / CGV) ---------- */
function LegalPage({ which }) {
  const { content } = useContent();
  const tr = useTr();
  const data = content.legal[which];
  return (
    <main className="legal">
      <header className="legal-top">
        <a href="/" aria-label="PIVUS"><img className="nav-logo" src="assets/pivus-mark.png" alt="PIVUS" /></a>
        <div className="legal-top-right">
          <TopControls />
          <a href="/" className="legal-back"><Icon name="arrow" size={16} /> {tr("Retour à l'accueil", 'Back to home')}</a>
        </div>
      </header>
      <div className="legal-hero">
        <div className="wrap">
          <span className="eyebrow">{tr('// Légal', '// Legal')}</span>
          <T as="h1" className="legal-title" id={`legal.${which}.title`} />
          <T as="p" className="legal-subtitle" id={`legal.${which}.subtitle`} />
          <T as="p" className="legal-updated" id={`legal.${which}.updated`} />
        </div>
      </div>
      <div className="wrap legal-content">
        {data.blocks.map((b, i) => (
          <section className="legal-block" key={i}>
            <T as="h2" id={`legal.${which}.blocks.${i}.h`} />
            <T as="p" id={`legal.${which}.blocks.${i}.p`} />
          </section>
        ))}
      </div>
      <Footer />
    </main>
  );
}

/* ---------- Équipe ---------- */
function TeamPage() {
  const { content, editing, addMember, removeMember, moveMember } = useContent();
  const tr = useTr();
  const members = content.team.members;
  return (
    <main className="legal team-page">
      <header className="legal-top">
        <a href="/" aria-label="PIVUS"><img className="nav-logo" src="assets/pivus-mark.png" alt="PIVUS" /></a>
        <div className="legal-top-right">
          <TopControls />
          <a href="/" className="legal-back"><Icon name="arrow" size={16} /> {tr("Retour à l'accueil", 'Back to home')}</a>
        </div>
      </header>
      <div className="legal-hero">
        <div className="wrap">
          <T as="span" className="eyebrow" id="team.eyebrow" />
          <T as="h1" className="legal-title" id="team.title" />
          <T as="p" className="legal-subtitle" id="team.lead" />
        </div>
      </div>
      <div className="wrap team-grid-wrap">
        <div className="team-grid">
          {members.map((m, i) => (
            <article className="team-card reveal" key={i}>
              {editing && (
                <div className="team-card-tools">
                  <button type="button" onMouseDown={noBlur} onClick={() => moveMember(i, -1)} disabled={i === 0}
                    title={tr('Monter', 'Move up')} aria-label={tr('Monter', 'Move up')}><Icon name="chevronUp" size={15} /></button>
                  <button type="button" onMouseDown={noBlur} onClick={() => moveMember(i, 1)} disabled={i === members.length - 1}
                    title={tr('Descendre', 'Move down')} aria-label={tr('Descendre', 'Move down')}><Icon name="chevronDown" size={15} /></button>
                  <button type="button" className="danger" onMouseDown={noBlur}
                    onClick={() => { if (window.confirm(tr('Supprimer ce membre ?', 'Delete this member?'))) removeMember(i); }}
                    title={tr('Supprimer', 'Delete')} aria-label={tr('Supprimer', 'Delete')}><Icon name="trash" size={15} /></button>
                </div>
              )}
              <MediaImage id={`team.members.${i}.image`} alt={m.name} className="team-photo" />
              <T as="h3" className="team-name" id={`team.members.${i}.name`} />
              <T as="p" className="team-role" id={`team.members.${i}.role`} />
              <T as="p" className="team-bio" id={`team.members.${i}.bio`} />
            </article>
          ))}
          {editing && (
            <button type="button" className="team-add" onMouseDown={noBlur} onClick={addMember}>
              <Icon name="plus" size={22} />
              <span>{tr('Ajouter un membre', 'Add a member')}</span>
            </button>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

/* ---------- Cas d'usage (blog) : liste ---------- */
const UC_BASE = '/cas-usage';
const UC_NEW_FR = {
  image: '', tag: 'Secteur', date: '2026',
  title: "Nouveau cas d'usage",
  description: 'Résumé court du cas — visible sur la carte de la liste.',
  blocks: [
    { h: 'Le contexte', p: 'Décrivez la situation de départ et le problème rencontré.' },
    { h: 'La mesure', p: 'Expliquez ce que PIVUS a mesuré et observé.' },
    { h: 'Le résultat', p: "Présentez le bénéfice concret obtenu." },
  ],
};
const UC_NEW_EN = {
  image: '', tag: 'Sector', date: '2026',
  title: 'New use case',
  description: 'Short summary of the case — shown on the list card.',
  blocks: [
    { h: 'The context', p: 'Describe the starting situation and the problem encountered.' },
    { h: 'The measurement', p: 'Explain what PIVUS measured and observed.' },
    { h: 'The result', p: 'Present the concrete benefit obtained.' },
  ],
};
const UC_NEW_BLOCK_FR = { h: 'Sous-titre', p: 'Nouveau paragraphe. Cliquez pour le modifier.' };
const UC_NEW_BLOCK_EN = { h: 'Subheading', p: 'New paragraph. Click to edit it.' };

function UseCasesPage() {
  const { content, editing, addListItem, removeListItem, moveListItem } = useContent();
  const tr = useTr();
  const uc = content.useCases || {};
  const items = uc.items || [];
  const go = (i) => (e) => { if (e) e.preventDefault(); pvGoto(UC_BASE + '/' + i); };

  return (
    <main className="legal uc-page">
      <header className="legal-top">
        <a href="/" aria-label="PIVUS"><img className="nav-logo" src="assets/pivus-mark.png" alt="PIVUS" /></a>
        <div className="legal-top-right">
          <TopControls />
          <a href="/" className="legal-back"><Icon name="arrow" size={16} /> {tr("Retour à l'accueil", 'Back to home')}</a>
        </div>
      </header>
      <div className="legal-hero">
        <div className="wrap">
          <T as="span" className="eyebrow" id="useCases.eyebrow" />
          <T as="h1" className="legal-title" id="useCases.title" />
          <T as="p" className="legal-subtitle" id="useCases.lead" />
        </div>
      </div>
      <div className="wrap uc-grid-wrap">
        {items.length === 0 && !editing && (
          <p className="uc-empty">{tr('Aucun cas d\u2019usage pour le moment.', 'No use case yet.')}</p>
        )}
        <div className="uc-grid">
          {items.map((it, i) => (
            <article className="uc-card reveal" key={i}>
              {editing && (
                <div className="team-card-tools">
                  <button type="button" onMouseDown={noBlur} onClick={() => moveListItem('useCases.items', i, -1)} disabled={i === 0}
                    title={tr('Monter', 'Move up')} aria-label={tr('Monter', 'Move up')}><Icon name="chevronUp" size={15} /></button>
                  <button type="button" onMouseDown={noBlur} onClick={() => moveListItem('useCases.items', i, 1)} disabled={i === items.length - 1}
                    title={tr('Descendre', 'Move down')} aria-label={tr('Descendre', 'Move down')}><Icon name="chevronDown" size={15} /></button>
                  <button type="button" className="danger" onMouseDown={noBlur}
                    onClick={() => { if (window.confirm(tr('Supprimer ce cas ?', 'Delete this case?'))) removeListItem('useCases.items', i); }}
                    title={tr('Supprimer', 'Delete')} aria-label={tr('Supprimer', 'Delete')}><Icon name="trash" size={15} /></button>
                </div>
              )}
              <div className={'uc-card-media' + (editing ? '' : ' clickable')} onClick={editing ? undefined : go(i)}>
                <MediaImage id={`useCases.items.${i}.image`} alt={it.title} className="uc-cover" />
              </div>
              <div className="uc-card-body">
                <div className="uc-meta">
                  <Icon name="tag" size={13} />
                  <T as="span" id={`useCases.items.${i}.tag`} />
                  <span className="uc-dot">·</span>
                  <T as="span" id={`useCases.items.${i}.date`} />
                </div>
                <T as="h3" className="uc-card-title" id={`useCases.items.${i}.title`} />
                <T as="p" className="uc-card-desc" id={`useCases.items.${i}.description`} />
                {editing ? (
                  <div className="uc-card-actions">
                    <span className="uc-readmore"><T as="span" id="useCases.readMore" /> <Icon name="arrow" size={16} /></span>
                    <button type="button" className="uc-open-btn" onMouseDown={noBlur} onClick={go(i)}>
                      <Icon name="arrow" size={15} /> {tr('Ouvrir / Modifier', 'Open / Edit')}
                    </button>
                  </div>
                ) : (
                  <a className="uc-readmore" href={UC_BASE + '/' + i} onClick={go(i)}><T as="span" id="useCases.readMore" /> <Icon name="arrow" size={16} /></a>
                )}
              </div>
            </article>
          ))}
          {editing && (
            <button type="button" className="team-add uc-add" onMouseDown={noBlur} onClick={() => addListItem('useCases.items', UC_NEW_FR, UC_NEW_EN)}>
              <Icon name="plus" size={22} />
              <span>{tr('Ajouter un cas', 'Add a case')}</span>
            </button>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

/* ---------- Cas d'usage (blog) : article ---------- */
function UseCasePage({ index }) {
  const { content, editing, addListItem, removeListItem, moveListItem } = useContent();
  const tr = useTr();
  const uc = content.useCases || {};
  const items = uc.items || [];
  const it = items[index];

  const header = (
    <header className="legal-top">
      <a href="/" aria-label="PIVUS"><img className="nav-logo" src="assets/pivus-mark.png" alt="PIVUS" /></a>
      <div className="legal-top-right">
        <TopControls />
        <a href={UC_BASE} className="legal-back" onClick={(e) => { e.preventDefault(); pvGoto(UC_BASE); }}>
          <Icon name="arrow" size={16} /> <T as="span" id="useCases.backToList" />
        </a>
      </div>
    </header>
  );

  if (!it) {
    return (
      <main className="legal uc-post">
        {header}
        <div className="legal-hero"><div className="wrap">
          <T as="p" className="legal-subtitle" id="useCases.notFound" />
          <a href={UC_BASE} className="btn btn-primary" onClick={(e) => { e.preventDefault(); pvGoto(UC_BASE); }} style={{ marginTop: 18 }}>
            <T as="span" id="useCases.backToList" />
          </a>
        </div></div>
        <Footer />
      </main>
    );
  }

  const blocks = it.blocks || [];
  const bpath = `useCases.items.${index}.blocks`;

  return (
    <main className="legal uc-post">
      {header}
      <div className="legal-hero">
        <div className="wrap">
          <div className="uc-post-meta">
            <Icon name="tag" size={14} />
            <T as="span" id={`useCases.items.${index}.tag`} />
            <span className="uc-dot">·</span>
            <span className="uc-metalabel"><T as="span" id="useCases.metaLabel" /></span>{' '}
            <T as="span" id={`useCases.items.${index}.date`} />
          </div>
          <T as="h1" className="legal-title" id={`useCases.items.${index}.title`} />
          <T as="p" className="legal-subtitle" id={`useCases.items.${index}.description`} />
        </div>
      </div>
      <div className="wrap uc-post-wrap">
        <div className="uc-post-cover">
          <MediaImage id={`useCases.items.${index}.image`} alt={it.title} className="uc-post-img" />
        </div>
        <article className="uc-post-body">
          {blocks.map((b, i) => (
            <section className="legal-block uc-block" key={i}>
              {editing && (
                <div className="uc-block-tools">
                  <button type="button" onMouseDown={noBlur} onClick={() => moveListItem(bpath, i, -1)} disabled={i === 0}
                    title={tr('Monter', 'Move up')} aria-label={tr('Monter', 'Move up')}><Icon name="chevronUp" size={15} /></button>
                  <button type="button" onMouseDown={noBlur} onClick={() => moveListItem(bpath, i, 1)} disabled={i === blocks.length - 1}
                    title={tr('Descendre', 'Move down')} aria-label={tr('Descendre', 'Move down')}><Icon name="chevronDown" size={15} /></button>
                  <button type="button" className="danger" onMouseDown={noBlur}
                    onClick={() => { if (window.confirm(tr('Supprimer ce paragraphe ?', 'Delete this paragraph?'))) removeListItem(bpath, i); }}
                    title={tr('Supprimer', 'Delete')} aria-label={tr('Supprimer', 'Delete')}><Icon name="trash" size={15} /></button>
                </div>
              )}
              <T as="h2" id={`${bpath}.${i}.h`} />
              <T as="p" id={`${bpath}.${i}.p`} />
            </section>
          ))}
          {editing && (
            <button type="button" className="uc-block-add" onMouseDown={noBlur} onClick={() => addListItem(bpath, UC_NEW_BLOCK_FR, UC_NEW_BLOCK_EN)}>
              <Icon name="plus" size={18} />
              <span>{tr('Ajouter un paragraphe', 'Add a paragraph')}</span>
            </button>
          )}
        </article>
      </div>
      <Footer />
    </main>
  );
}

/* ---------- Admin login ---------- */
function Login() {
  const { setLoggedIn } = useContent();
  const [pw, setPw] = React.useState('');
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      await PIVUS_AUTH.login(pw);
      setLoggedIn(true);
    } catch (ex) {
      setErr(ex.message || 'Échec de la connexion');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <img className="admin-login-logo" src="assets/pivus-mark.png" alt="PIVUS" />
        <h1>Espace d'administration</h1>
        <p>Connectez-vous pour modifier le contenu du site.</p>
        <div className={'field' + (err ? ' err' : '')}>
          <label>Mot de passe</label>
          <input type="password" value={pw} autoFocus
            onChange={(e) => setPw(e.target.value)} placeholder="••••••••" />
          {err && <span className="err-msg">{err}</span>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </button>
        <a href="/" className="admin-login-back">← Retour au site</a>
      </form>
    </div>
  );
}

/* ---------- Admin edit bar ---------- */
function AdminBar() {
  const { content, dirty, save, preview, setPreview, setLoggedIn } = useContent();
  const [status, setStatus] = React.useState('');
  const [statusFull, setStatusFull] = React.useState('');
  const [smtp, setSmtp] = React.useState(null);

  const refreshStatus = React.useCallback(() => {
    const tok = PIVUS_AUTH.getToken();
    fetch('/api/email-status', { headers: { Authorization: 'Bearer ' + tok } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setSmtp(d); })
      .catch(() => {});
  }, []);

  React.useEffect(() => { refreshStatus(); }, [refreshStatus]);

  const flash = (short, full) => {
    setStatus(short);
    setStatusFull(full || short);
    setTimeout(() => { setStatus(''); setStatusFull(''); }, 6000);
  };

  const doSave = async () => {
    setStatus('Enregistrement…'); setStatusFull('');
    try {
      await save();
      flash('Enregistré ✓');
      refreshStatus();
    } catch (e) {
      flash(e.message || "Échec de l'enregistrement");
    }
  };

  const doTestEmail = async () => {
    if (dirty && !window.confirm("Le test utilise l'email enregistré. Enregistrer d'abord vos modifications ?\n\n(Annuler pour tester l'email actuellement enregistré.)")) {
      // user chose to test the already-saved email
    } else if (dirty) {
      try { await save(); refreshStatus(); } catch (e) { flash(e.message || 'Échec'); return; }
    }
    setStatus('Test en cours…'); setStatusFull('');
    try {
      const tok = PIVUS_AUTH.getToken();
      const res = await fetch('/api/test-email', { method: 'POST', headers: { Authorization: 'Bearer ' + tok } });
      const d = await res.json();
      const short = d.emailed ? 'Email de test envoyé ✓' : (d.ok ? 'SMTP non configuré' : "Échec de l'envoi");
      flash(short, d.message);
    } catch (e) {
      flash("Échec du test", String(e));
    }
  };

  const doLogout = async () => {
    if (dirty && !window.confirm('Des modifications ne sont pas enregistrées. Se déconnecter quand même ?')) return;
    await PIVUS_AUTH.logout();
    setLoggedIn(false);
    window.location.href = '/';
  };

  const savedEmail = smtp ? smtp.recipient : ((content.site && content.site.email) || '');
  const liveEmail = (content.site && content.site.email) || '';
  const emailChanged = !!smtp && liveEmail && liveEmail !== savedEmail;

  return (
    <div className="admin-bar">
      <div className="admin-bar-left">
        <span className="admin-dot" />
        <strong>Mode édition</strong>
        <span className="admin-hint">Cliquez sur un texte pour le modifier.</span>
      </div>
      <div className="admin-bar-right">
        <span className="admin-email" title={
          (smtp && smtp.smtp_configured
            ? "SMTP configuré — les emails sont réellement envoyés."
            : "SMTP non configuré — les messages sont enregistrés dans ./submissions.")
          + "\nDestinataire enregistré : " + savedEmail
          + (emailChanged ? "\n⚠ Email modifié non enregistré (" + liveEmail + ") — Enregistrez pour l'appliquer." : "")
        }>
          <span className={'admin-mail-dot' + (smtp && smtp.smtp_configured ? ' ok' : ' off')} />
          {emailChanged ? (liveEmail + ' •') : savedEmail}
        </span>
        <button type="button" className="admin-toggle" onClick={doTestEmail}>Tester l'email</button>
        <a className="admin-link" href="/">Accueil</a>
        <a className="admin-link" href="/cas-usage">Cas d'usage</a>
        <a className="admin-link" href="/equipe">Équipe</a>
        <a className="admin-link" href="/cgu">CGU</a>
        <a className="admin-link" href="/cgv">CGV</a>
        <button type="button" className={'admin-toggle' + (preview ? ' on' : '')} onClick={() => setPreview((p) => !p)}>
          {preview ? 'Aperçu : activé' : 'Aperçu'}
        </button>
        {status && <span className="admin-status" title={statusFull}>{status}</span>}
        <button type="button" className="btn btn-primary admin-save" onClick={doSave} disabled={!dirty}>
          {dirty ? 'Enregistrer' : 'À jour'}
        </button>
        <button type="button" className="admin-logout" onClick={doLogout}>Déconnexion</button>
      </div>
    </div>
  );
}

/* ---------- Site shell ---------- */
function Site() {
  const { loaded, loggedIn, editing, lang } = useContent();
  const [route] = useRoute();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // accent dynamique
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  // body flag so admin styling (visible reveals, bar offset) can apply
  React.useEffect(() => {
    document.body.classList.toggle('pv-admin', loggedIn);
    document.body.classList.toggle('pv-editing', editing);
  }, [loggedIn, editing]);

  // révélation au scroll — re-scan when structure/route/content changes
  React.useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    const id = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    }, 40);
    return () => { clearTimeout(id); io.disconnect(); };
  }, [t.heroStyle, route, loaded, loggedIn, lang]);

  const tw = {
    heroStyle: HERO_MAP[t.heroStyle] || 'full',
    colormap: (t.colormap || 'Marine').toLowerCase(),
    accent: t.accent,
    arrows: !!t.arrows,
    flow: t.flow,
  };

  let page;
  if (route.name === 'admin' && !loggedIn) {
    page = <Login />;
  } else if (route.name === 'cgu') {
    page = <LegalPage which="cgu" />;
  } else if (route.name === 'cgv') {
    page = <LegalPage which="cgv" />;
  } else if (route.name === 'equipe') {
    page = <TeamPage />;
  } else if (route.name === 'usecases') {
    page = <UseCasesPage />;
  } else if (route.name === 'usecase') {
    page = <UseCasePage index={route.id} />;
  } else {
    page = <Landing tw={tw} t={t} setTweak={setTweak} />;
  }

  return (
    <React.Fragment>
      {loggedIn && <AdminBar />}
      {page}
    </React.Fragment>
  );
}

function App() {
  return (
    <ContentProvider>
      <Site />
    </ContentProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
