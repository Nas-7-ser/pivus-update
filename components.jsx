/* PIVUS — Composants de sections. Tout le texte affiché provient du store
 * éditable (window.PIVUS_CONTENT_DEFAULTS, fusionné avec content.json). */
const { useState, useEffect, useRef } = React;

/* ---------- Canvas de champ de vitesses ---------- */
function VelocityCanvas({ fieldKey, colormap, arrows, flow, className }) {
  const ref = useRef(null);
  const inst = useRef(null);
  useEffect(() => {
    const cfg = window.PIVUS_FIELDS[fieldKey] || {};
    const i = new window.PIVUS_VF.VelocityField(ref.current, Object.assign({}, cfg, {
      colormap, showArrows: arrows, bg: [7, 12, 24],
    }));
    i._base = cfg.speed || 1;
    i.speed = i._base * (flow || 1);
    inst.current = i;
    return () => i.destroy();
  }, [fieldKey]);
  useEffect(() => { if (inst.current) inst.current.setColormap(colormap); }, [colormap]);
  useEffect(() => { if (inst.current) inst.current.setArrows(arrows); }, [arrows]);
  useEffect(() => { if (inst.current) inst.current.speed = inst.current._base * (flow || 1); }, [flow]);
  return <canvas ref={ref} className={className} />;
}

const Colorbar = () => (
  <div className="colorbar">
    <div className="bar" />
    <div className="lbls"><span>lent</span><span>rapide</span></div>
  </div>
);

// In edit mode, anchors shouldn't navigate when you click their text to edit it.
function useNoNav() {
  const { editing } = useContent();
  return editing ? (e) => e.preventDefault() : undefined;
}

/* ---------- Language + theme controls (top) ---------- */
function TopControls() {
  const { lang, setLang, theme, toggleTheme } = useContent();
  return (
    <div className="top-controls">
      <div className="lang-switch" role="group" aria-label="Language">
        <button type="button" className={lang === 'fr' ? 'on' : ''} aria-pressed={lang === 'fr'} onClick={() => setLang('fr')}>FR</button>
        <button type="button" className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
      </div>
      <button type="button" className="theme-toggle" onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
        title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}>
        <Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
      </button>
    </div>
  );
}

/* ---------- Navigation ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const stop = useNoNav();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      <a href="/" aria-label="PIVUS"><img className="nav-logo" src="assets/pivus-mark.png" alt="PIVUS" /></a>
      <div className="nav-links">
        <a href="#methode" onClick={stop}><T id="nav.method" /></a>
        <a href="#applications" onClick={stop}><T id="nav.applications" /></a>
        <a href="#offres" onClick={stop}><T id="nav.offers" /></a>
        <a href="/cas-usage"><T id="nav.useCases" /></a>
        <a href="/equipe"><T id="nav.team" /></a>
      </div>
      <div className="nav-actions">
        <TopControls />
        <a href="#contact" onClick={stop} className="btn btn-primary nav-cta"><T id="nav.cta" /></a>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */
function Hero({ tw }) {
  const { content } = useContent();
  const stop = useNoNav();
  const inner = (
    <div className="hero-inner reveal">
      <span className="hero-pill"><span className="dot" /><T id="hero.pill" /></span>
      <h1><T id="hero.titleLine1" /><br /><T id="hero.titleAccent" className="grad" /></h1>
      <p className="hero-sub"><T id="hero.sub" /></p>
      <div className="hero-cta">
        <a href="#contact" onClick={stop} className="btn btn-primary"><T id="hero.ctaPrimary" /> <span className="arr"><Icon name="arrow" size={18} /></span></a>
        <a href="#applications" onClick={stop} className="btn btn-ghost"><T id="hero.ctaSecondary" /></a>
      </div>
      <div className="hero-stats">
        {content.hero.stats.map((s, i) => (
          <div className="hero-stat" key={i}>
            <div className="num"><T id={`hero.stats.${i}.num`} /></div>
            <div className="lab"><T id={`hero.stats.${i}.lab`} /></div>
          </div>
        ))}
      </div>
    </div>
  );
  const canvas = <VelocityCanvas fieldKey="hero" colormap={tw.colormap} arrows={false} flow={tw.flow} className="hero-canvas" />;

  if (tw.heroStyle === 'panel') {
    return (
      <header className="hero panel" id="top">
        <div className="wrap"><div className="hero-grid">{inner}<div className="appRow-media">{canvas}<div className="field-frame" /></div></div></div>
      </header>
    );
  }
  if (tw.heroStyle === 'sobre') {
    return (
      <header className="hero sobre" id="top">
        <div className="wrap">{inner}</div>
        {canvas}
      </header>
    );
  }
  return (
    <header className="hero full" id="top">
      {canvas}
      <div className="hero-grad" />
      <div className="wrap">{inner}</div>
    </header>
  );
}

/* ---------- Méthode ---------- */
function Method() {
  const { content } = useContent();
  const steps = content.method.steps;
  return (
    <section className="section method" id="methode">
      <div className="wrap">
        <div className="method-head reveal">
          <T as="span" className="eyebrow" id="method.eyebrow" />
          <T as="h2" className="section-title" id="method.title" />
          <T as="p" className="lead" id="method.lead" />
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step reveal" key={i} style={{ transitionDelay: (i * 90) + 'ms' }}>
              <div className="step-ico"><Icon name={s.ico} /></div>
              <div className="step-num"><T id={`method.steps.${i}.n`} /></div>
              <T as="h3" id={`method.steps.${i}.h`} />
              <T as="p" id={`method.steps.${i}.p`} />
            </div>
          ))}
        </div>
        <div className="method-note reveal">
          <Icon name="info" />
          <p><strong><T id="method.noteStrong" /></strong>{' '}<T id="method.noteText" /></p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Applications ---------- */
function Applications({ tw }) {
  const { content } = useContent();
  const apps = content.applications.items;
  return (
    <section className="section" id="applications">
      <div className="wrap">
        <div className="apps-head reveal">
          <T as="span" className="eyebrow" id="applications.eyebrow" />
          <T as="h2" className="section-title" id="applications.title" />
          <T as="p" className="lead" id="applications.lead" />
        </div>
        {apps.map((a, ai) => (
          <div className="appRow reveal" key={a.field}>
            <div className="appRow-media">
              <div className="field-panel">
                <VelocityCanvas fieldKey={a.field} colormap={tw.colormap} arrows={tw.arrows} flow={tw.flow} />
                <div className="field-tag"><T id={`applications.items.${ai}.tag`} /></div>
                <div className="field-frame" />
                <div className="field-cap">
                  <span className="read"><T id={`applications.items.${ai}.readout`} /></span>
                  <Colorbar />
                </div>
              </div>
            </div>
            <div className="appRow-body">
              <div className="idx"><T id={`applications.items.${ai}.idx`} /> / 06</div>
              <T as="h3" id={`applications.items.${ai}.title`} />
              <T as="p" id={`applications.items.${ai}.intro`} />
              <ul className="read-list">
                {a.reads.map((r, i) => (
                  <li key={i}><Icon name="check" size={18} /><span><span className="lead-in"><T id={`applications.items.${ai}.reads.${i}.k`} /> — </span><T id={`applications.items.${ai}.reads.${i}.t`} /></span></li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Produits ---------- */
function Products() {
  const { content } = useContent();
  const items = content.products.items;
  return (
    <section className="section products" id="offres">
      <div className="wrap">
        <div className="products-head reveal">
          <T as="span" className="eyebrow" id="products.eyebrow" />
          <T as="h2" className="section-title" id="products.title" />
          <T as="p" className="lead" id="products.lead" />
        </div>
        <div className="prod-grid">
          {items.map((p, i) => (
            <div className="prod-card reveal" key={i} style={{ transitionDelay: (i * 80) + 'ms' }}>
              <span className="prod-num">{String(i + 1).padStart(2, '0')}</span>
              <T as="span" className="prod-kicker" id={`products.items.${i}.kicker`} />
              <T as="h3" id={`products.items.${i}.title`} />
              <T as="p" id={`products.items.${i}.desc`} />
              <ul className="prod-feat">
                {p.feats.map((f, j) => (<li key={j}><Icon name="check" size={16} /><T id={`products.items.${i}.feats.${j}`} /></li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Positionnement ---------- */
function Positioning() {
  const { content } = useContent();
  const sectors = content.positioning.sectors;
  return (
    <section className="section tight positioning">
      <div className="wrap">
        <div className="pos-grid">
          <div className="reveal">
            <T as="span" className="eyebrow" id="positioning.eyebrow" />
            <T as="h2" id="positioning.title" />
            <T as="p" id="positioning.body" />
          </div>
          <div className="sectors reveal">
            {sectors.map((s, i) => (
              <div className="sector" key={i}>
                <div className="ico"><Icon name={s.ico} size={21} /></div>
                <T as="h4" id={`positioning.sectors.${i}.name`} />
                <T as="p" id={`positioning.sectors.${i}.line`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Vidéo démo (juste après le hero) ---------- */
function VideoDemo() {
  const { content } = useContent();
  const url = (content.video && content.video.url) || '';
  const poster = (content.video && content.video.poster) || '';
  const embed = pvVideoEmbed(url);

  return (
    <section className="section video-demo" id="demo">
      <div className="wrap">
        <div className="video-demo-head reveal">
          <T as="span" className="eyebrow" id="video.eyebrow" />
          <T as="h2" className="section-title" id="video.title" />
          <T as="p" className="lead" id="video.lead" />
        </div>
        <div className="video-demo-media reveal">
          <div className="video-frame">
            {embed ? (
              embed.type === 'video' ? (
                <video controls playsInline poster={poster || undefined} src={embed.src} />
              ) : (
                <iframe
                  src={embed.src}
                  title="Démonstration PIVUS"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )
            ) : (
              <div className="video-ph">
                <div className="video-ph-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p>Vidéo de démonstration à venir</p>
              </div>
            )}
          </div>
          <AdminField id="video.url" label="URL de la vidéo (YouTube, Vimeo ou .mp4)" placeholder="https://www.youtube.com/watch?v=…" />
          <AdminField id="video.poster" label="Image de couverture (optionnel, fichiers .mp4)" placeholder="uploads/poster.jpg" />
        </div>
      </div>
    </section>
  );
}

window.PIVUS_COMPONENTS = { VelocityCanvas, Nav, Hero, Method, Applications, Products, Positioning, VideoDemo, TopControls };
