/* PIVUS — Composants de sections */
const { useState, useEffect, useRef } = React;
const { Ed } = window.PIVUS_EDIT;

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
    <div className="lbls"><span><Ed k="cb.low">lent</Ed></span><span><Ed k="cb.high">rapide</Ed></span></div>
  </div>
);

/* ---------- Navigation ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      <a href="#top" aria-label="PIVUS"><img className="nav-logo" src="assets/pivus-mark.png" alt="PIVUS" /></a>
      <div className="nav-links">
        <a href="#methode"><Ed k="nav.methode">Méthode</Ed></a>
        <a href="#applications"><Ed k="nav.applications">Applications</Ed></a>
        <a href="#offres"><Ed k="nav.offres">Offres</Ed></a>
        <a href="#contact" className="btn btn-primary nav-cta"><Ed k="nav.cta">Décrire mon cas</Ed></a>
      </div>
      <a href="#contact" className="btn btn-primary nav-cta nav-burger" style={{ display: 'none' }}>Contact</a>
    </nav>
  );
}

/* ---------- Hero ---------- */
function Hero({ tw }) {
  const inner = (
    <div className="hero-inner reveal">
      <span className="hero-pill"><span className="dot" /><Ed k="hero.pill">Contrôle non destructif des liquides</Ed></span>
      <h1><Ed k="hero.title1">Le mouvement de vos liquides,</Ed><br /><span className="grad"><Ed k="hero.title2">enfin visible.</Ed></span></h1>
      <p className="hero-sub">
        <Ed k="hero.sub">PIVUS mesure par ultrasons le champ de vitesses à l'intérieur d'un liquide — sans contact, sans le toucher. Au laboratoire comme sur votre ligne, vous comprenez enfin ce qui s'y passe vraiment.</Ed>
      </p>
      <div className="hero-cta">
        <a href="#contact" className="btn btn-primary"><Ed k="hero.cta1">Décrivez-nous votre cas</Ed> <span className="arr"><Icon name="arrow" size={18} /></span></a>
        <a href="#applications" className="btn btn-ghost"><Ed k="hero.cta2">Voir les applications</Ed></a>
      </div>
      <div className="hero-stats">
        <div className="hero-stat"><div className="num"><Ed k="hero.stat1n">Sans contact</Ed></div><div className="lab"><Ed k="hero.stat1l">mesure à travers la paroi</Ed></div></div>
        <div className="hero-stat"><div className="num"><Ed k="hero.stat2n">Champ 2D</Ed></div><div className="lab"><Ed k="hero.stat2l">vitesse + direction, en chaque point</Ed></div></div>
        <div className="hero-stat"><div className="num"><Ed k="hero.stat3n">Labo &amp; ligne</Ed></div><div className="lab"><Ed k="hero.stat3l">essais comme production</Ed></div></div>
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
  const steps = [
    { ico: 'wave', n: 'ÉTAPE 01', h: "L'onde traverse le liquide", p: "Une onde ultrasonore est envoyée à travers la paroi. Rien n'est plongé dans le liquide, rien n'est modifié." },
    { ico: 'grid', n: 'ÉTAPE 02', h: 'Le champ de vitesses se reconstruit', p: 'PIVUS calcule la vitesse et la direction en chaque point, et en fait une image 2D animée.' },
    { ico: 'eye', n: 'ÉTAPE 03', h: "Vous lisez l'intérieur", p: 'Frottements, remous, zones mortes, bouchons : ce qui était invisible devient lisible.' },
  ];
  return (
    <section className="section method" id="methode">
      <div className="wrap">
        <div className="method-head reveal">
          <span className="eyebrow">// <Ed k="method.eyebrow">Méthode</Ed></span>
          <h2 className="section-title"><Ed k="method.title">Une mesure par ultrasons, sans rien toucher</Ed></h2>
          <p className="lead">
            <Ed k="method.lead">PIVUS envoie des ondes ultrasonores dans le liquide et reconstruit, point par point, la vitesse et la direction du mouvement. Le résultat : une carte en 2D de tout ce qui circule à l'intérieur.</Ed>
          </p>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step reveal" key={i} style={{ transitionDelay: (i * 90) + 'ms' }}>
              <div className="step-ico"><Icon name={s.ico} /></div>
              <div className="step-num"><Ed k={'method.step' + i + '.n'}>{s.n}</Ed></div>
              <h3><Ed k={'method.step' + i + '.h'}>{s.h}</Ed></h3>
              <p><Ed k={'method.step' + i + '.p'}>{s.p}</Ed></p>
            </div>
          ))}
        </div>
        <div className="method-note reveal">
          <Icon name="info" />
          <p><strong><Ed k="method.note.strong">Une seule condition : que le produit soit liquide.</Ed></strong> <Ed k="method.note.rest">PIVUS s'utilise aussi bien sur une ligne de production qu'au laboratoire ou sur un banc d'essai — sur une large gamme de liquides à forte valeur.</Ed></p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Applications ---------- */
function Applications({ tw }) {
  const apps = window.PIVUS_DATA.applications;
  return (
    <section className="section" id="applications">
      <div className="wrap">
        <div className="apps-head reveal">
          <span className="eyebrow">// <Ed k="apps.eyebrow">Applications</Ed></span>
          <h2 className="section-title"><Ed k="apps.title">Ce que révèle le champ de vitesses</Ed></h2>
          <p className="lead">
            <Ed k="apps.lead">Chaque phénomène laisse une signature dans le mouvement du liquide. Voici les cas que nous savons déjà lire — et autant de pistes à explorer avec vous.</Ed>
          </p>
        </div>
        {apps.map((a) => (
          <div className="appRow reveal" key={a.field}>
            <div className="appRow-media">
              <div className="field-panel">
                <VelocityCanvas fieldKey={a.field} colormap={tw.colormap} arrows={tw.arrows} flow={tw.flow} />
                <div className="field-tag"><Ed k={'app.' + a.field + '.tag'}>{a.tag}</Ed></div>
                <div className="field-frame" />
                <div className="field-cap">
                  <span className="read"><Ed k={'app.' + a.field + '.readout'}>{a.readout}</Ed></span>
                  <Colorbar />
                </div>
              </div>
            </div>
            <div className="appRow-body">
              <div className="idx"><Ed k={'app.' + a.field + '.idx'}>{a.idx}</Ed> / 06</div>
              <h3><Ed k={'app.' + a.field + '.title'}>{a.title}</Ed></h3>
              <p><Ed k={'app.' + a.field + '.intro'}>{a.intro}</Ed></p>
              <ul className="read-list">
                {a.reads.map((r, i) => (
                  <li key={i}><Icon name="check" size={18} /><span><span className="lead-in"><Ed k={'app.' + a.field + '.readk' + i}>{r.k}</Ed> — </span><Ed k={'app.' + a.field + '.read' + i}>{r.t}</Ed></span></li>
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
  const items = window.PIVUS_DATA.products;
  return (
    <section className="section products" id="offres">
      <div className="wrap">
        <div className="products-head reveal">
          <span className="eyebrow">// <Ed k="prod.eyebrow">Offres</Ed></span>
          <h2 className="section-title"><Ed k="prod.title">Trois façons de travailler avec PIVUS</Ed></h2>
          <p className="lead"><Ed k="prod.lead">Achat, location ou prestation : vous choisissez le niveau d'accompagnement.</Ed></p>
        </div>
        <div className="prod-grid">
          {items.map((p, i) => (
            <div className="prod-card reveal" key={i} style={{ transitionDelay: (i * 80) + 'ms' }}>
              <span className="prod-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="prod-kicker"><Ed k={'prod.' + i + '.kicker'}>{p.kicker}</Ed></span>              <h3><Ed k={'prod.' + i + '.title'}>{p.title}</Ed></h3>
              <p><Ed k={'prod.' + i + '.desc'}>{p.desc}</Ed></p>
              <ul className="prod-feat">
                {p.feats.map((f, j) => (<li key={j}><Icon name="check" size={16} /><Ed k={'prod.' + i + '.feat' + j}>{f}</Ed></li>))}
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
  const sectors = window.PIVUS_DATA.sectors;
  return (
    <section className="section tight positioning">
      <div className="wrap">
        <div className="pos-grid">
          <div className="reveal">
            <span className="eyebrow">// <Ed k="pos.eyebrow">Positionnement</Ed></span>
            <h2><Ed k="pos.title">Le contrôle non destructif, appliqué aux liquides</Ed></h2>
            <p>
              <Ed k="pos.body">PIVUS est une entreprise de contrôle non destructif (CND) spécialisée dans les liquides. Nous nous adressons à tous ceux dont les liquides ont de la valeur — et pour qui un défaut invisible coûte cher.</Ed>
            </p>
          </div>
          <div className="sectors reveal">
            {sectors.map((s, i) => (
              <div className="sector" key={i}>
                <div className="ico"><Icon name={s.ico} size={21} /></div>
                <h4><Ed k={'sector.' + i + '.name'}>{s.name}</Ed></h4>
                <p><Ed k={'sector.' + i + '.line'}>{s.line}</Ed></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.PIVUS_COMPONENTS = { VelocityCanvas, Nav, Hero, Method, Applications, Products, Positioning };
