/* PIVUS — App + Tweaks + montage */
const { Nav, Hero, Method, Applications, Products, Positioning } = window.PIVUS_COMPONENTS;
const { Contact, Footer } = window.PIVUS_CONTACT;
const { ContentProvider, AdminHost } = window.PIVUS_EDIT;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroStyle": "Plein écran",
  "colormap": "Turbo",
  "accent": "#1f8a7a",
  "arrows": true,
  "flow": 0.5
}/*EDITMODE-END*/;

const HERO_MAP = { 'Plein écran': 'full', 'Panneau': 'panel', 'Sobre': 'sobre' };

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // accent dynamique
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  // révélation au scroll (re-scan quand le hero change de structure)
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    const id = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    }, 40);
    return () => { clearTimeout(id); io.disconnect(); };
  }, [t.heroStyle]);

  const tw = {
    heroStyle: HERO_MAP[t.heroStyle] || 'full',
    colormap: (t.colormap || 'Marine').toLowerCase(),
    accent: t.accent,
    arrows: !!t.arrows,
    flow: t.flow,
  };

  return (
    <React.Fragment>
      <Nav />
      <Hero tw={tw} />
      <Method />
      <Applications tw={tw} />
      <Products />
      <Positioning />
      <Contact tw={tw} />
      <Footer />
      <AdminHost />

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContentProvider><App /></ContentProvider>
);
