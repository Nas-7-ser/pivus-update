/* PIVUS — montage de l'application */
const { Nav, Hero, VideoDemo, Method, Applications, Products, Positioning } = window.PIVUS_COMPONENTS;
const { Contact, Footer } = window.PIVUS_CONTACT;
const { ContentProvider, AdminHost } = window.PIVUS_EDIT;

/* Configuration visuelle (modifiable ici si besoin) */
const CONFIG = {
  heroStyle: 'full',   // 'full' | 'panel' | 'sobre'
  colormap: 'turbo',   // 'marine' | 'turbo' | 'mono'
  accent: '#1f8a7a',
  arrows: true,
  flow: 0.5,
};

function App() {
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', CONFIG.accent);
  }, []);

  // Apparition au défilement
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    const id = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    }, 40);
    return () => { clearTimeout(id); io.disconnect(); };
  }, []);

  return (
    <React.Fragment>
      <Nav />
      <Hero tw={CONFIG} />
      <VideoDemo />
      <Method />
      <Applications tw={CONFIG} />
      <Products />
      <Positioning />
      <Contact tw={CONFIG} />
      <Footer />
      <AdminHost />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContentProvider><App /></ContentProvider>
);
