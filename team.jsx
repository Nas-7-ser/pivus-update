/* PIVUS — Page Équipe */
const { useEffect: useEffectTeam } = React;
const { Ed: EdT, EdImg: EdImgT, AdminHost: AdminHostT, ContentProvider: ContentProviderT } = window.PIVUS_EDIT;

const TEAM = [
  { id: 'm1', name: 'Prénom Nom', role: 'Fonction — ex. CEO & Cofondateur', bio: "Courte description : parcours, rôle chez PIVUS, expertise. Deux phrases suffisent." },
  { id: 'm2', name: 'Prénom Nom', role: 'Fonction — ex. CTO & Cofondateur', bio: "Courte description : parcours, rôle chez PIVUS, expertise. Deux phrases suffisent." },
  { id: 'm3', name: 'Prénom Nom', role: 'Fonction — ex. Direction scientifique', bio: "Courte description : parcours, rôle chez PIVUS, expertise. Deux phrases suffisent." },
  { id: 'm4', name: 'Prénom Nom', role: 'Fonction — ex. Ingénieur·e mesure', bio: "Courte description : parcours, rôle chez PIVUS, expertise. Deux phrases suffisent." },
  { id: 'm5', name: 'Prénom Nom', role: 'Fonction — ex. Développement logiciel', bio: "Courte description : parcours, rôle chez PIVUS, expertise. Deux phrases suffisent." },
  { id: 'm6', name: 'Prénom Nom', role: 'Fonction — ex. Développement commercial', bio: "Courte description : parcours, rôle chez PIVUS, expertise. Deux phrases suffisent." },
];

function TeamNav() {
  return (
    <nav className="nav scrolled">
      <a href="index.html" aria-label="PIVUS — accueil"><img className="nav-logo" src={window.__resources ? window.__resources.logo : 'assets/pivus-mark.png'} alt="PIVUS" /></a>
      <div className="nav-links">
        <a href="index.html#methode"><EdT k="nav.methode">Méthode</EdT></a>
        <a href="index.html#applications"><EdT k="nav.applications">Applications</EdT></a>
        <a href="index.html#offres"><EdT k="nav.offres">Offres</EdT></a>
        <a href="equipe.html"><EdT k="nav.equipe">Équipe</EdT></a>
        <a href="index.html#contact" className="btn btn-primary nav-cta"><EdT k="nav.cta">Décrire mon cas</EdT></a>
      </div>
      <a href="index.html#contact" className="btn btn-primary nav-cta nav-burger" style={{ display: 'none' }}>Contact</a>
    </nav>
  );
}

function TeamApp() {
  useEffectTeam(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    const id = setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el)), 40);
    return () => { clearTimeout(id); io.disconnect(); };
  }, []);

  return (
    <React.Fragment>
      <TeamNav />
      <header className="team-hero wrap">
        <span className="eyebrow">// <EdT k="team.eyebrow">Équipe</EdT></span>
        <h1><EdT k="team.title">Les personnes derrière PIVUS</EdT></h1>
        <p className="lead"><EdT k="team.lead">Une équipe qui associe mesure physique, traitement du signal et terrain industriel pour rendre visible le mouvement des liquides.</EdT></p>
      </header>

      <main className="section team-section">
        <div className="wrap">
          <div className="team-grid">
            {TEAM.map((m) => (
              <article className="team-card reveal" key={m.id}>
                <EdImgT k={'team.' + m.id + '.photo'} alt="" placeholder="Photo" />
                <h2 className="team-name"><EdT k={'team.' + m.id + '.name'}>{m.name}</EdT></h2>
                <p className="team-role"><EdT k={'team.' + m.id + '.role'}>{m.role}</EdT></p>
                <p className="team-bio"><EdT k={'team.' + m.id + '.bio'}>{m.bio}</EdT></p>
              </article>
            ))}
          </div>
        </div>
      </main>

      <footer className="legal-foot">© 2026 PIVUS — Tous droits réservés · <a href="index.html">Retour à l'accueil</a></footer>
      <AdminHostT />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ContentProviderT><TeamApp /></ContentProviderT>
);
