/* PIVUS — Contenu éditorial (FR). Langage accessible, recentré : liquides uniquement,
 * mesure en laboratoire ET en production, terme « fluide » banni. */
window.PIVUS_DATA = {
  applications: [
    {
      field: 'channel',
      idx: '01',
      tag: 'CISAILLEMENT_PARIETAL',
      title: 'La force du liquide sur les parois',
      intro: "Le champ de vitesses montre à quelle vitesse le liquide glisse le long des parois. Plus il accélère près du bord, plus il frotte — et plus il est capable de décrocher ce qui s'y dépose.",
      reads: [
        { k: 'Ce que vous voyez', t: 'Le centre va vite (clair), les bords ralentissent (sombre). Ce contraste mesure le frottement à la paroi.' },
        { k: 'Ce que ça vous apporte', t: 'Savoir si vos dépôts vont se détacher, et calibrer vos nettoyages au plus juste.' },
      ],
      readout: 'frottement paroi · max au centre',
    },
    {
      field: 'turbulence',
      idx: '02',
      tag: 'TURBULENCE',
      title: 'Les zones agitées et les remous',
      intro: "Quand le liquide tourbillonne, le champ de vitesses se remplit de boucles. PIVUS les rend visibles là où l'œil ne voit qu'un liquide opaque.",
      reads: [
        { k: 'Ce que vous voyez', t: 'Des tourbillons qui se forment, se déplacent et se mélangent en continu.' },
        { k: 'Ce que ça vous apporte', t: "Comprendre le mélange et repérer les agitations qui abîment un produit fragile." },
      ],
      readout: 'tourbillons · écoulement instable',
    },
    {
      field: 'deadzone',
      idx: '03',
      tag: 'ZONE_MORTE',
      title: 'Les endroits où le liquide stagne',
      intro: "Certaines zones ne bougent presque pas : le liquide y reste piégé. Le champ de vitesses les fait ressortir comme des taches sombres et immobiles.",
      reads: [
        { k: 'Ce que vous voyez', t: 'Une poche sombre où les lignes de courant disparaissent : la vitesse y est quasi nulle.' },
        { k: 'Ce que ça vous apporte', t: "Éviter les recoins où un produit s'accumule, vieillit ou contamine le reste." },
      ],
      readout: 'vitesse ≈ 0 · stagnation',
    },
    {
      field: 'blockage',
      idx: '04',
      tag: 'ENCRASSEMENT',
      title: "Un dépôt ou un bouchon qui se forme",
      intro: "Quand une conduite s'encrasse, le passage se rétrécit et le liquide accélère pour passer. Ce jet plus rapide est un signal clair, bien avant le bouchon complet.",
      reads: [
        { k: 'Ce que vous voyez', t: 'Un jet très clair au centre, là où le passage se resserre.' },
        { k: 'Ce que ça vous apporte', t: "Anticiper un bouchon et planifier la maintenance avant l'arrêt." },
      ],
      readout: 'rétrécissement · jet accéléré',
    },
    {
      field: 'cleaning',
      idx: '05',
      tag: 'NETTOYAGE_CIP',
      title: 'Régler le nettoyage au plus juste',
      intro: "Pendant un nettoyage, le champ de vitesses montre si le liquide passe assez fort là où le dépôt s'accroche. De quoi nettoyer ni trop, ni trop peu.",
      reads: [
        { k: 'Ce que vous voyez', t: "L'écoulement qui décape le dépôt accroché à la paroi basse." },
        { k: 'Ce que ça vous apporte', t: "Réduire la durée, l'eau et les produits de nettoyage, sans risque de résidu." },
      ],
      readout: 'décapage · cycle maîtrisé',
    },
    {
      field: 'quality',
      idx: '06',
      tag: 'CONTROLE_QUALITE',
      title: 'Une signature stable, produit après produit',
      intro: "Un même liquide bien maîtrisé donne toujours le même champ de vitesses. Toute dérive — viscosité, mélange, composition — se lit comme un écart à cette signature.",
      reads: [
        { k: 'Ce que vous voyez', t: 'Un écoulement régulier et homogène : la signature d\'un produit conforme.' },
        { k: 'Ce que ça vous apporte', t: 'Détecter une anomalie tôt et attester de la régularité de vos produits.' },
      ],
      readout: 'signature stable · conforme',
    },
  ],

  products: [
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
      feats: ['Mise à disposition temporaire', 'Idéal pour un test ou un pic d\'activité', 'Accompagnement à la prise en main'],
    },
  ],

  sectors: [
    { ico: 'agro', name: 'Agroalimentaire', line: 'Qualité, hygiène et nettoyage maîtrisés.' },
    { ico: 'chem', name: 'Chimie', line: 'Procédés sous contrôle, sans intrusion.' },
    { ico: 'pharma', name: 'Pharmacie', line: 'Traçabilité et propreté des circuits.' },
    { ico: 'cosmo', name: 'Cosmétique', line: 'Régularité des textures et des mélanges.' },
  ],

  sectorOptions: ['Agroalimentaire', 'Chimie', 'Pharmacie', 'Cosmétique', 'Autre'],
};
