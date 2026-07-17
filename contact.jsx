/* PIVUS — Contact (formulaire détaillé) + Footer */
const { Ed } = window.PIVUS_EDIT;

function Contact({ tw }) {
  const [form, setForm] = useState({ nom: '', email: '', societe: '', secteur: '', liquide: '', stade: 'Les deux', message: '' });
  const [errs, setErrs] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.nom.trim()) er.nom = 'Requis';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) er.email = 'Email invalide';
    if (form.message.trim().length < 10) er.message = 'Décrivez votre cas en quelques mots';
    setErrs(er);
    if (Object.keys(er).length === 0) setSent(true);
  };

  return (
    <section className="section contact" id="contact">
      <div className="contact-canvas"><VelocityCanvas fieldKey="hero" colormap={tw.colormap} arrows={false} flow={tw.flow} /></div>
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-intro reveal">
            <span className="eyebrow">// <Ed k="contact.eyebrow">Parlons-en</Ed></span>
            <h2><Ed k="contact.title">Un problème avec un liquide&nbsp;? Décrivez-le-nous.</Ed></h2>
            <p>
              <Ed k="contact.body">Nous cherchons des cas concrets. Dites-nous ce qui vous bloque avec l'un de vos liquides — même si vous ne savez pas encore si c'est mesurable. Nous étudions ensemble si notre méthode peut vous aider.</Ed>
            </p>
            <ul className="contact-points">
              <li><span className="n">01</span><span><Ed k="contact.pt1">On lit votre problème et on évalue la faisabilité.</Ed></span></li>
              <li><span className="n">02</span><span><Ed k="contact.pt2">On vous dit franchement si le champ de vitesses peut aider.</Ed></span></li>
              <li><span className="n">03</span><span><Ed k="contact.pt3">Si oui, on définit ensemble un premier essai.</Ed></span></li>
            </ul>
          </div>

          <div className="form-card reveal">
            {sent ? (
              <div className="form-success">
                <div className="check"><Icon name="check" size={30} /></div>
                <h3><Ed k="contact.success.title">Bien reçu, merci&nbsp;!</Ed></h3>
                <p><Ed k="contact.success.body">Nous étudions votre cas et revenons vers vous sous 48&nbsp;h ouvrées.</Ed></p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="form-row">
                  <div className={'field' + (errs.nom ? ' err' : '')}>
                    <label><Ed k="form.label.nom">Nom</Ed> <span className="req">*</span></label>
                    <input value={form.nom} onChange={set('nom')} placeholder="Votre nom" />
                    {errs.nom && <span className="err-msg">{errs.nom}</span>}
                  </div>
                  <div className={'field' + (errs.email ? ' err' : '')}>
                    <label><Ed k="form.label.email">Email</Ed> <span className="req">*</span></label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="vous@societe.com" />
                    {errs.email && <span className="err-msg">{errs.email}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label><Ed k="form.label.societe">Société</Ed></label>
                    <input value={form.societe} onChange={set('societe')} placeholder="Nom de la société" />
                  </div>
                  <div className="field">
                    <label><Ed k="form.label.secteur">Secteur</Ed></label>
                    <select value={form.secteur} onChange={set('secteur')}>
                      <option value="">Sélectionner…</option>
                      {window.PIVUS_DATA.sectorOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label><Ed k="form.label.liquide">Type de liquide</Ed></label>
                  <input value={form.liquide} onChange={set('liquide')} placeholder="ex. lait, crème, solvant, sirop, gel…" />
                </div>
                <div className="field">
                  <label><Ed k="form.label.stade">À quel stade&nbsp;?</Ed></label>
                  <div className="seg">
                    {['Laboratoire', 'Production', 'Les deux'].map((o) => (
                      <button type="button" key={o} className={form.stade === o ? 'on' : ''} onClick={() => setForm((f) => ({ ...f, stade: o }))}><Ed k={'form.stade.' + o}>{o}</Ed></button>
                    ))}
                  </div>
                </div>
                <div className={'field' + (errs.message ? ' err' : '')}>
                  <label><Ed k="form.label.message">Votre problème ou votre question</Ed> <span className="req">*</span></label>
                  <textarea value={form.message} onChange={set('message')} placeholder="Décrivez ce qui vous bloque : dépôt qui revient, nettoyage interminable, mélange irrégulier, bouchon récurrent…" />
                  {errs.message && <span className="err-msg">{errs.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary form-submit"><Ed k="form.submit">Envoyer mon cas</Ed> <span className="arr"><Icon name="arrow" size={18} /></span></button>
                <p className="form-foot"><Ed k="form.foot">Réponse sous 48&nbsp;h ouvrées · Vos informations restent confidentielles.</Ed></p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <img className="footer-logo" src="assets/pivus-mark.png" alt="PIVUS" />
            <p className="footer-tag"><Ed k="footer.tag">Le contrôle non destructif appliqué aux liquides. Mesure ultrasonore du champ de vitesses, sans contact.</Ed></p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5><Ed k="footer.nav.title">Navigation</Ed></h5>
              <a href="#methode"><Ed k="footer.nav.1">Méthode</Ed></a>
              <a href="#applications"><Ed k="footer.nav.2">Applications</Ed></a>
              <a href="#offres"><Ed k="footer.nav.3">Offres</Ed></a>
              <a href="#contact"><Ed k="footer.nav.4">Contact</Ed></a>
            </div>
            <div className="footer-col">
              <h5><Ed k="footer.contact.title">Contact</Ed></h5>
              <a href="mailto:contact@pivus.fr"><Ed k="footer.email">contact@pivus.fr</Ed></a>
              <a href="tel:+33000000000"><Ed k="footer.phone">+33 (0)0 00 00 00 00</Ed></a>
              <span><Ed k="footer.address">Adresse — à compléter</Ed></span>
            </div>
            <div className="footer-col">
              <h5><Ed k="footer.legal.title">Légal</Ed></h5>
              <a href="mentions-legales.html"><Ed k="footer.legal.1">Mentions légales</Ed></a>
              <a href="cgv.html"><Ed k="footer.legal.2">CGV</Ed></a>
              <a href="cgu.html"><Ed k="footer.legal.3">CGU</Ed></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span><Ed k="footer.copy">© 2026 PIVUS — Tous droits réservés.</Ed></span>
          <span><Ed k="footer.meta">Deeptech · Instrumentation · CND des liquides</Ed></span>
        </div>
      </div>
    </footer>
  );
}

window.PIVUS_CONTACT = { Contact, Footer };
