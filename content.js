/* PIVUS — Contenu éditable par défaut.
 * Toutes les chaînes affichées à l'écran vivent ici. L'admin peut les modifier
 * en ligne ; les modifications sont enregistrées dans content.json côté serveur
 * et fusionnées par-dessus ces valeurs par défaut au chargement.
 *
 * Les clés "structurelles" (field, ico, idx de canvas) restent fixes et ne sont
 * pas éditables — seul le texte l'est.
 */
window.PIVUS_CONTENT_DEFAULTS = {
  // Source unique de vérité pour l'adresse de contact. Modifiée une fois dans
  // l'admin, elle se répercute partout : section contact, pied de page, lien
  // mailto, destinataire du formulaire (côté serveur) et le jeton {email}
  // utilisé dans les pages CGU / CGV.
  site: {
    email: 'team@pivus-systems.com',
  },

  nav: {
    method: 'Méthode',
    applications: 'Applications',
    offers: 'Offres',
    useCases: "Cas d'usage",
    team: 'Équipe',
    cta: 'Décrire mon cas',
    contactShort: 'Contact',
  },

  video: {
    eyebrow: '// Démonstration',
    title: 'Voir PIVUS en action',
    lead: 'Découvrez comment le champ de vitesses se lit en conditions réelles — au laboratoire ou sur une ligne de production.',
    url: '',
    poster: '',
  },

  team: {
    eyebrow: '// Équipe',
    title: 'Les personnes derrière PIVUS',
    lead: 'Une équipe deeptech au service du contrôle non destructif des liquides — de la R&D à l\'accompagnement sur site.',
    members: [
      {
        image: '',
        name: 'Prénom Nom',
        role: 'Co-fondateur · Direction',
        bio: 'Courte description du parcours et du rôle au sein de PIVUS. À personnaliser.',
      },
      {
        image: '',
        name: 'Prénom Nom',
        role: 'Co-fondateur · Technique',
        bio: 'Courte description du parcours et du rôle au sein de PIVUS. À personnaliser.',
      },
      {
        image: '',
        name: 'Prénom Nom',
        role: 'Responsable applications',
        bio: 'Courte description du parcours et du rôle au sein de PIVUS. À personnaliser.',
      },
    ],
  },

  // Blog « Cas d'usage » : l'admin peut ajouter/supprimer/réordonner des cas,
  // et éditer chaque champ (titre, image, extrait, méta, paragraphes).
  useCases: {
    eyebrow: "// Cas d'usage",
    title: "Cas d'usage",
    lead: "Des exemples concrets où le champ de vitesses a fait la différence — au laboratoire comme en production.",
    readMore: 'Lire le cas',
    backToList: "Tous les cas d'usage",
    emptyAdmin: "Aucun cas d'usage pour l'instant. Cliquez sur « Ajouter un cas » pour commencer.",
    notFound: "Ce cas d'usage est introuvable.",
    metaLabel: 'Publié',
    items: [
      {
        image: '',
        tag: 'Agroalimentaire',
        date: '2026',
        title: 'Détecter un encrassement avant le bouchon',
        description: "Sur une ligne laitière, PIVUS a révélé un jet accéléré signalant un encrassement naissant — deux semaines avant l'arrêt.",
        blocks: [
          { h: 'Le contexte', p: "Une ligne de production subissait des bouchons récurrents, sans signe avant-coureur visible. Chaque arrêt imprévu coûtait cher en nettoyage et en production perdue." },
          { h: 'La mesure', p: "PIVUS a mesuré le champ de vitesses à travers la paroi, sans contact ni interruption du procédé. Un jet accéléré au centre de la conduite est apparu là où le passage se resserrait." },
          { h: 'Le résultat', p: "L'encrassement a été détecté deux semaines avant le bouchon complet, laissant le temps de planifier une maintenance ciblée et d'éviter un arrêt subi." },
        ],
      },
      {
        image: '',
        tag: 'Nettoyage CIP',
        date: '2026',
        title: 'Régler un cycle de nettoyage au plus juste',
        description: "En visualisant l'écoulement de décapage, un cycle CIP surdimensionné a été réduit sans risque de résidu.",
        blocks: [
          { h: 'Le contexte', p: "Par précaution, un cycle de nettoyage tournait bien plus longtemps que nécessaire, consommant eau, produits et temps machine." },
          { h: 'La mesure', p: "Le champ de vitesses a montré que le liquide décapait déjà efficacement la paroi basse bien avant la fin du cycle." },
          { h: 'Le résultat', p: "Le cycle a été raccourci en conservant une marge de sécurité, réduisant la consommation d'eau et de produits, sans aucun résidu constaté." },
        ],
      },
    ],
  },

  hero: {
    pill: 'Contrôle non destructif des liquides',
    titleLine1: 'Le mouvement de vos liquides,',
    titleAccent: 'enfin visible.',
    sub: "PIVUS mesure par ultrasons le champ de vitesses à l'intérieur d'un liquide — sans contact, sans le toucher. Au laboratoire comme sur votre ligne, vous comprenez enfin ce qui s'y passe vraiment.",
    ctaPrimary: 'Décrivez-nous votre cas',
    ctaSecondary: 'Voir les applications',
    stats: [
      { num: 'Sans contact', lab: 'mesure à travers la paroi' },
      { num: 'Champ 2D', lab: 'vitesse + direction, en chaque point' },
      { num: 'Labo & ligne', lab: 'essais comme production' },
    ],
  },

  method: {
    eyebrow: '// Méthode',
    title: 'Une mesure par ultrasons, sans rien toucher',
    lead: "PIVUS envoie des ondes ultrasonores dans le liquide et reconstruit, point par point, la vitesse et la direction du mouvement. Le résultat : une carte en 2D de tout ce qui circule à l'intérieur.",
    steps: [
      { ico: 'wave', n: 'ÉTAPE 01', h: "L'onde traverse le liquide", p: "Une onde ultrasonore est envoyée à travers la paroi. Rien n'est plongé dans le liquide, rien n'est modifié." },
      { ico: 'grid', n: 'ÉTAPE 02', h: 'Le champ de vitesses se reconstruit', p: 'PIVUS calcule la vitesse et la direction en chaque point, et en fait une image 2D animée.' },
      { ico: 'eye', n: 'ÉTAPE 03', h: "Vous lisez l'intérieur", p: 'Frottements, remous, zones mortes, bouchons : ce qui était invisible devient lisible.' },
    ],
    noteStrong: 'Une seule condition : que le produit soit liquide.',
    noteText: "PIVUS s'utilise aussi bien sur une ligne de production qu'au laboratoire ou sur un banc d'essai — sur une large gamme de liquides à forte valeur.",
  },

  applications: {
    eyebrow: '// Applications',
    title: 'Ce que révèle le champ de vitesses',
    lead: 'Chaque phénomène laisse une signature dans le mouvement du liquide. Voici les cas que nous savons déjà lire — et autant de pistes à explorer avec vous.',
    items: [
      {
        field: 'channel', idx: '01', tag: 'CISAILLEMENT_PARIETAL',
        title: 'La force du liquide sur les parois',
        intro: "Le champ de vitesses montre à quelle vitesse le liquide glisse le long des parois. Plus il accélère près du bord, plus il frotte — et plus il est capable de décrocher ce qui s'y dépose.",
        reads: [
          { k: 'Ce que vous voyez', t: 'Le centre va vite (clair), les bords ralentissent (sombre). Ce contraste mesure le frottement à la paroi.' },
          { k: 'Ce que ça vous apporte', t: 'Savoir si vos dépôts vont se détacher, et calibrer vos nettoyages au plus juste.' },
        ],
        readout: 'frottement paroi · max au centre',
      },
      {
        field: 'turbulence', idx: '02', tag: 'TURBULENCE',
        title: 'Les zones agitées et les remous',
        intro: "Quand le liquide tourbillonne, le champ de vitesses se remplit de boucles. PIVUS les rend visibles là où l'œil ne voit qu'un liquide opaque.",
        reads: [
          { k: 'Ce que vous voyez', t: 'Des tourbillons qui se forment, se déplacent et se mélangent en continu.' },
          { k: 'Ce que ça vous apporte', t: "Comprendre le mélange et repérer les agitations qui abîment un produit fragile." },
        ],
        readout: 'tourbillons · écoulement instable',
      },
      {
        field: 'deadzone', idx: '03', tag: 'ZONE_MORTE',
        title: 'Les endroits où le liquide stagne',
        intro: "Certaines zones ne bougent presque pas : le liquide y reste piégé. Le champ de vitesses les fait ressortir comme des taches sombres et immobiles.",
        reads: [
          { k: 'Ce que vous voyez', t: 'Une poche sombre où les lignes de courant disparaissent : la vitesse y est quasi nulle.' },
          { k: 'Ce que ça vous apporte', t: "Éviter les recoins où un produit s'accumule, vieillit ou contamine le reste." },
        ],
        readout: 'vitesse ≈ 0 · stagnation',
      },
      {
        field: 'blockage', idx: '04', tag: 'ENCRASSEMENT',
        title: "Un dépôt ou un bouchon qui se forme",
        intro: "Quand une conduite s'encrasse, le passage se rétrécit et le liquide accélère pour passer. Ce jet plus rapide est un signal clair, bien avant le bouchon complet.",
        reads: [
          { k: 'Ce que vous voyez', t: 'Un jet très clair au centre, là où le passage se resserre.' },
          { k: 'Ce que ça vous apporte', t: "Anticiper un bouchon et planifier la maintenance avant l'arrêt." },
        ],
        readout: 'rétrécissement · jet accéléré',
      },
      {
        field: 'cleaning', idx: '05', tag: 'NETTOYAGE_CIP',
        title: 'Régler le nettoyage au plus juste',
        intro: "Pendant un nettoyage, le champ de vitesses montre si le liquide passe assez fort là où le dépôt s'accroche. De quoi nettoyer ni trop, ni trop peu.",
        reads: [
          { k: 'Ce que vous voyez', t: "L'écoulement qui décape le dépôt accroché à la paroi basse." },
          { k: 'Ce que ça vous apporte', t: "Réduire la durée, l'eau et les produits de nettoyage, sans risque de résidu." },
        ],
        readout: 'décapage · cycle maîtrisé',
      },
      {
        field: 'quality', idx: '06', tag: 'CONTROLE_QUALITE',
        title: 'Une signature stable, produit après produit',
        intro: "Un même liquide bien maîtrisé donne toujours le même champ de vitesses. Toute dérive — viscosité, mélange, composition — se lit comme un écart à cette signature.",
        reads: [
          { k: 'Ce que vous voyez', t: "Un écoulement régulier et homogène : la signature d'un produit conforme." },
          { k: 'Ce que ça vous apporte', t: 'Détecter une anomalie tôt et attester de la régularité de vos produits.' },
        ],
        readout: 'signature stable · conforme',
      },
    ],
  },

  products: {
    eyebrow: '// Offres',
    title: 'Trois façons de travailler avec PIVUS',
    lead: "Achat, location ou prestation : vous choisissez le niveau d'accompagnement.",
    items: [
      {
        kicker: '01 — Solution clé en main',
        title: 'Matériel + logiciel',
        desc: "L'équipement de mesure et son logiciel de traitement, installés chez vous. À l'achat ou en location, avec licence logicielle.",
        feats: ['Matériel de mesure ultrasonore', 'Logiciel de traitement & visualisation', 'Achat ou location + licence'],
      },
      {
        kicker: '02 — Prestation de mesure',
        title: 'Campagnes de mesure',
        desc: 'Nos équipes viennent mesurer chez vous et vous remettent un rapport complet et détaillé de votre installation.',
        feats: ['Intervention sur site', 'Analyse du champ de vitesses', 'Rapport complet et détaillé'],
      },
      {
        kicker: '03 — Location',
        title: 'Équipement à la demande',
        desc: 'Le matériel de contrôle mis à disposition sur une période définie, pour un besoin ponctuel ou un essai.',
        feats: ['Mise à disposition temporaire', "Idéal pour un test ou un pic d'activité", 'Accompagnement à la prise en main'],
      },
    ],
  },

  positioning: {
    eyebrow: '// Positionnement',
    title: 'Le contrôle non destructif, appliqué aux liquides',
    body: "PIVUS est une entreprise de contrôle non destructif (CND) spécialisée dans les liquides. Nous nous adressons à tous ceux dont les liquides ont de la valeur — et pour qui un défaut invisible coûte cher.",
    sectors: [
      { ico: 'agro', name: 'Agroalimentaire', line: 'Qualité, hygiène et nettoyage maîtrisés.' },
      { ico: 'chem', name: 'Chimie', line: 'Procédés sous contrôle, sans intrusion.' },
      { ico: 'pharma', name: 'Pharmacie', line: 'Traçabilité et propreté des circuits.' },
      { ico: 'cosmo', name: 'Cosmétique', line: 'Régularité des textures et des mélanges.' },
      { ico: 'energy', name: 'Énergie', line: 'Liquides caloporteurs et circuits sous surveillance.' },
    ],
  },

  contact: {
    eyebrow: '// Parlons-en',
    title: 'Un problème avec un liquide\u00a0? Décrivez-le-nous.',
    body: "Nous cherchons des cas concrets. Dites-nous ce qui vous bloque avec l'un de vos liquides — même si vous ne savez pas encore si c'est mesurable. Nous étudions ensemble si notre méthode peut vous aider.",
    points: [
      'On lit votre problème et on évalue la faisabilité.',
      'On vous dit franchement si le champ de vitesses peut aider.',
      "Si oui, on définit ensemble un premier essai.",
    ],
    labels: {
      nom: 'Nom', email: 'Email', societe: 'Société', secteur: 'Secteur',
      liquide: 'Type de liquide', stade: 'À quel stade\u00a0?',
      message: 'Votre problème ou votre question', submit: 'Envoyer par email',
    },
    formFoot: 'Ouvre votre application mail avec le message pré-rempli · Réponse sous 48\u00a0h ouvrées.',
    successTitle: 'Votre mail est prêt\u00a0!',
    successBody: 'Votre application mail s\u2019est ouverte avec toutes vos informations. Il ne reste qu\u2019à appuyer sur Envoyer.',
    errorBody: "Une erreur est survenue à l'envoi. Réessayez ou écrivez-nous directement.",
  },

  footer: {
    tagline: 'Le contrôle non destructif appliqué aux liquides. Mesure ultrasonore du champ de vitesses, sans contact.',
    navTitle: 'Navigation',
    contactTitle: 'Contact',
    legalTitle: 'Légal',
    cguLink: "Conditions d'utilisation",
    cgvLink: 'Conditions de vente',
    copyright: '© 2026 PIVUS — Tous droits réservés.',
    meta: 'Deeptech · Instrumentation · CND des liquides',
  },

  legal: {
    cgu: {
      title: "Conditions Générales d'Utilisation",
      subtitle: "Les règles qui encadrent l'accès et l'usage du site PIVUS.",
      updated: 'Dernière mise à jour : à compléter',
      blocks: [
        { h: '1. Préambule', p: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
        { h: "2. Accès au site", p: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
        { h: '3. Propriété intellectuelle', p: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." },
        { h: '4. Données personnelles', p: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." },
        { h: '5. Responsabilité', p: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem." },
        { h: '6. Contact', p: "Pour toute question relative aux présentes conditions, contactez-nous à {email}." },
      ],
    },
    cgv: {
      title: 'Conditions Générales de Vente',
      subtitle: 'Les conditions applicables à nos offres : achat, location et prestations.',
      updated: 'Dernière mise à jour : à compléter',
      blocks: [
        { h: '1. Objet', p: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { h: '2. Commandes', p: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
        { h: '3. Prix et paiement', p: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
        { h: '4. Livraison et installation', p: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
        { h: '5. Garanties', p: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam." },
        { h: '6. Location et prestations', p: "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." },
        { h: '7. Droit applicable', p: "Pour toute question relative aux présentes conditions de vente, contactez-nous à {email}." },
      ],
    },
  },
};
