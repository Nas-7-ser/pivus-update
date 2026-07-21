/* PIVUS — Contact (formulaire détaillé) + Footer */

function Contact({ tw }) {
  const { content, lang } = useContent();
  const en = lang === 'en';
  const [form, setForm] = useState({
    nom: '', email: '', societe: '', secteur: '', liquide: '',
    stade: en ? 'Both' : 'Les deux', message: '',
  });
  const [errs, setErrs] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Sector list follows positioning.sectors (admin-editable) + "Autre/Other".
  const sectorOptions = React.useMemo(() => {
    const names = ((content.positioning && content.positioning.sectors) || []).map((s) => s.name);
    return [...names, en ? 'Other' : 'Autre'];
  }, [content.positioning, en]);

  const stadeOpts = en
    ? ['Laboratory', 'Production', 'Both']
    : ['Laboratoire', 'Production', 'Les deux'];

  // Validate, then open the visitor's email app with every field pre-filled.
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.nom.trim()) er.nom = en ? 'Required' : 'Requis';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) er.email = en ? 'Invalid email' : 'Email invalide';
    if (form.message.trim().length < 10) er.message = en ? 'Describe your case in a few words' : 'Décrivez votre cas en quelques mots';
    setErrs(er);
    if (Object.keys(er).length !== 0) return;

    const to = (content.site && content.site.email) || '';
    const subject = (en ? 'PIVUS case — ' : 'Nouveau cas PIVUS — ') + (form.societe || form.nom);
    const body = [
      (en ? 'Name' : 'Nom') + ' : ' + form.nom,
      'Email : ' + form.email,
      (en ? 'Company' : 'Société') + ' : ' + form.societe,
      (en ? 'Sector' : 'Secteur') + ' : ' + form.secteur,
      (en ? 'Type of liquid' : 'Type de liquide') + ' : ' + form.liquide,
      (en ? 'Stage' : 'Stade') + ' : ' + form.stade,
      '',
      (en ? 'Message' : 'Message') + ' :',
      form.message,
    ].join('\r\n');

    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    setSent(true);
  };

  return (
    <section className="section contact" id="contact">
      <div className="contact-canvas"><VelocityCanvas fieldKey="hero" colormap={tw.colormap} arrows={false} flow={tw.flow} /></div>
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-intro reveal">
            <T as="span" className="eyebrow" id="contact.eyebrow" />
            <T as="h2" id="contact.title" />
            <T as="p" id="contact.body" />
            <ul className="contact-points">
              {content.contact.points.map((p, i) => (
                <li key={i}><span className="n">{String(i + 1).padStart(2, '0')}</span><T id={`contact.points.${i}`} /></li>
              ))}
            </ul>
            <p className="contact-email">
              <Icon name="info" size={16} />
              <a href={'mailto:' + content.site.email} onClick={useNoNav()}><T id="site.email" /></a>
            </p>
          </div>

          <div className="form-card reveal">
            {sent ? (
              <div className="form-success">
                <div className="check"><Icon name="check" size={30} /></div>
                <T as="h3" id="contact.successTitle" />
                <T as="p" id="contact.successBody" />
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="form-row">
                  <div className={'field' + (errs.nom ? ' err' : '')}>
                    <label><T id="contact.labels.nom" /> <span className="req">*</span></label>
                    <input value={form.nom} onChange={set('nom')} placeholder="Votre nom" />
                    {errs.nom && <span className="err-msg">{errs.nom}</span>}
                  </div>
                  <div className={'field' + (errs.email ? ' err' : '')}>
                    <label><T id="contact.labels.email" /> <span className="req">*</span></label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="vous@societe.com" />
                    {errs.email && <span className="err-msg">{errs.email}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label><T id="contact.labels.societe" /></label>
                    <input value={form.societe} onChange={set('societe')} placeholder="Nom de la société" />
                  </div>
                  <div className="field">
                    <label><T id="contact.labels.secteur" /></label>
                    <select value={form.secteur} onChange={set('secteur')}>
                      <option value="">{en ? 'Select…' : 'Sélectionner…'}</option>
                      {sectorOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label><T id="contact.labels.liquide" /></label>
                  <input value={form.liquide} onChange={set('liquide')} placeholder={en ? 'e.g. milk, cream, solvent, syrup, gel…' : 'ex. lait, crème, solvant, sirop, gel…'} />
                </div>
                <div className="field">
                  <label><T id="contact.labels.stade" /></label>
                  <div className="seg">
                    {stadeOpts.map((o) => (
                      <button type="button" key={o} className={form.stade === o ? 'on' : ''} onClick={() => setForm((f) => ({ ...f, stade: o }))}>{o}</button>
                    ))}
                  </div>
                </div>
                <div className={'field' + (errs.message ? ' err' : '')}>
                  <label><T id="contact.labels.message" /> <span className="req">*</span></label>
                  <textarea value={form.message} onChange={set('message')} placeholder={en ? 'Describe what is blocking you: recurring fouling, endless cleaning, irregular mixing, blockage…' : 'Décrivez ce qui vous bloque : dépôt qui revient, nettoyage interminable, mélange irrégulier, bouchon récurrent…'} />
                  {errs.message && <span className="err-msg">{errs.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary form-submit">
                  <T id="contact.labels.submit" /> <span className="arr"><Icon name="arrow" size={18} /></span>
                </button>
                <T as="p" className="form-foot" id="contact.formFoot" />
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { content } = useContent();
  const stop = useNoNav();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <img className="footer-logo" src="assets/pivus-mark.png" alt="PIVUS" />
            <T as="p" className="footer-tag" id="footer.tagline" />
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <T as="h5" id="footer.navTitle" />
              <a href="#methode" onClick={stop}><T id="nav.method" /></a>
              <a href="#applications" onClick={stop}><T id="nav.applications" /></a>
              <a href="#offres" onClick={stop}><T id="nav.offers" /></a>
              <a href="/cas-usage" onClick={stop}><T id="nav.useCases" /></a>
              <a href="/equipe" onClick={stop}><T id="nav.team" /></a>
              <a href="#contact" onClick={stop}><T id="nav.contactShort" /></a>
            </div>
            <div className="footer-col">
              <T as="h5" id="footer.contactTitle" />
              <a href={'mailto:' + content.site.email} onClick={stop}><T id="site.email" /></a>
              <a href="#contact" onClick={stop}><T id="nav.cta" /></a>
            </div>
            <div className="footer-col">
              <T as="h5" id="footer.legalTitle" />
              <a href="/cgu" onClick={stop}><T id="footer.cguLink" /></a>
              <a href="/cgv" onClick={stop}><T id="footer.cgvLink" /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <T as="span" id="footer.copyright" />
          <T as="span" id="footer.meta" />
        </div>
      </div>
    </footer>
  );
}

window.PIVUS_CONTACT = { Contact, Footer };
