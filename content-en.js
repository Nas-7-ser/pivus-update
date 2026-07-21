/* PIVUS — English content (same shape as content.js / PIVUS_CONTENT_DEFAULTS).
 * Shared, non-translatable fields (site.email, video.url/poster, team member
 * images) are kept in sync with the French tree at runtime by the store. */
window.PIVUS_CONTENT_EN = {
  site: {
    email: 'team@pivus-systems.com',
  },

  nav: {
    method: 'Method',
    applications: 'Applications',
    offers: 'Offers',
    useCases: 'Use cases',
    team: 'Team',
    cta: 'Describe my case',
    contactShort: 'Contact',
  },

  video: {
    eyebrow: '// Demonstration',
    title: 'See PIVUS in action',
    lead: 'Discover how the velocity field reads in real conditions — in the lab or on a production line.',
    url: '',
    poster: '',
  },

  team: {
    eyebrow: '// Team',
    title: 'The people behind PIVUS',
    lead: 'A deeptech team dedicated to the non-destructive testing of liquids — from R&D to on-site support.',
    members: [
      { image: '', name: 'First Last', role: 'Co-founder · Management', bio: 'Short description of the background and role within PIVUS. To be personalized.' },
      { image: '', name: 'First Last', role: 'Co-founder · Technical', bio: 'Short description of the background and role within PIVUS. To be personalized.' },
      { image: '', name: 'First Last', role: 'Applications Lead', bio: 'Short description of the background and role within PIVUS. To be personalized.' },
    ],
  },

  useCases: {
    eyebrow: '// Use cases',
    title: 'Use cases',
    lead: 'Concrete examples where the velocity field made the difference — in the lab as well as in production.',
    readMore: 'Read the case',
    backToList: 'All use cases',
    emptyAdmin: 'No use case yet. Click "Add a case" to get started.',
    notFound: 'This use case could not be found.',
    metaLabel: 'Published',
    items: [
      {
        image: '',
        tag: 'Food & Beverage',
        date: '2026',
        title: 'Spotting fouling before the blockage',
        description: 'On a dairy line, PIVUS revealed an accelerated jet signalling early fouling — two weeks before the shutdown.',
        blocks: [
          { h: 'The context', p: 'A production line suffered recurring blockages with no visible warning signs. Each unplanned stop was costly in cleaning and lost production.' },
          { h: 'The measurement', p: 'PIVUS measured the velocity field through the wall, without contact or interrupting the process. An accelerated jet appeared at the center of the pipe, where the passage narrowed.' },
          { h: 'The result', p: 'The fouling was detected two weeks before the complete blockage, leaving time to schedule targeted maintenance and avoid an unplanned stop.' },
        ],
      },
      {
        image: '',
        tag: 'CIP cleaning',
        date: '2026',
        title: 'Tuning a cleaning cycle as precisely as possible',
        description: 'By visualizing the scouring flow, an oversized CIP cycle was shortened with no risk of residue.',
        blocks: [
          { h: 'The context', p: 'As a precaution, a cleaning cycle ran far longer than needed, consuming water, products and machine time.' },
          { h: 'The measurement', p: 'The velocity field showed that the liquid was already scouring the lower wall effectively well before the end of the cycle.' },
          { h: 'The result', p: 'The cycle was shortened while keeping a safety margin, reducing water and product use, with no residue observed.' },
        ],
      },
    ],
  },

  hero: {
    pill: 'Non-destructive testing of liquids',
    titleLine1: 'The movement of your liquids,',
    titleAccent: 'finally visible.',
    sub: 'PIVUS uses ultrasound to measure the velocity field inside a liquid — without contact, without touching it. In the lab as on your line, you finally understand what is really happening inside.',
    ctaPrimary: 'Tell us about your case',
    ctaSecondary: 'See the applications',
    stats: [
      { num: 'Contactless', lab: 'measurement through the wall' },
      { num: '2D field', lab: 'speed + direction, at every point' },
      { num: 'Lab & line', lab: 'trials and production alike' },
    ],
  },

  method: {
    eyebrow: '// Method',
    title: 'Ultrasonic measurement, without touching anything',
    lead: 'PIVUS sends ultrasonic waves into the liquid and reconstructs, point by point, the speed and direction of the movement. The result: a 2D map of everything flowing inside.',
    steps: [
      { ico: 'wave', n: 'STEP 01', h: 'The wave crosses the liquid', p: 'An ultrasonic wave is sent through the wall. Nothing is immersed in the liquid, nothing is altered.' },
      { ico: 'grid', n: 'STEP 02', h: 'The velocity field is reconstructed', p: 'PIVUS computes speed and direction at every point and turns it into an animated 2D image.' },
      { ico: 'eye', n: 'STEP 03', h: 'You read the inside', p: 'Friction, eddies, dead zones, blockages: what was invisible becomes readable.' },
    ],
    noteStrong: 'One condition only: that the product is liquid.',
    noteText: 'PIVUS works just as well on a production line as in the lab or on a test bench — across a wide range of high-value liquids.',
  },

  applications: {
    eyebrow: '// Applications',
    title: 'What the velocity field reveals',
    lead: 'Every phenomenon leaves a signature in the movement of the liquid. Here are the cases we already know how to read — and just as many avenues to explore with you.',
    items: [
      {
        field: 'channel', idx: '01', tag: 'WALL_SHEAR',
        title: 'The force of the liquid on the walls',
        intro: 'The velocity field shows how fast the liquid slides along the walls. The more it accelerates near the edge, the more it rubs — and the more it can dislodge whatever settles there.',
        reads: [
          { k: 'What you see', t: 'The center moves fast (bright), the edges slow down (dark). This contrast measures friction at the wall.' },
          { k: 'What it gives you', t: 'Know whether your deposits will come loose, and calibrate your cleaning as precisely as possible.' },
        ],
        readout: 'wall friction · max at center',
      },
      {
        field: 'turbulence', idx: '02', tag: 'TURBULENCE',
        title: 'Agitated zones and eddies',
        intro: 'When the liquid swirls, the velocity field fills with loops. PIVUS makes them visible where the eye sees only an opaque liquid.',
        reads: [
          { k: 'What you see', t: 'Vortices that form, move and mix continuously.' },
          { k: 'What it gives you', t: 'Understand mixing and spot the agitation that damages a fragile product.' },
        ],
        readout: 'vortices · unstable flow',
      },
      {
        field: 'deadzone', idx: '03', tag: 'DEAD_ZONE',
        title: 'The places where the liquid stagnates',
        intro: 'Some zones barely move: the liquid stays trapped there. The velocity field brings them out as dark, motionless patches.',
        reads: [
          { k: 'What you see', t: 'A dark pocket where the streamlines vanish: the speed there is nearly zero.' },
          { k: 'What it gives you', t: 'Avoid the nooks where a product accumulates, ages or contaminates the rest.' },
        ],
        readout: 'speed ≈ 0 · stagnation',
      },
      {
        field: 'blockage', idx: '04', tag: 'FOULING',
        title: 'A deposit or blockage forming',
        intro: 'When a pipe fouls, the passage narrows and the liquid accelerates to get through. This faster jet is a clear signal, well before a complete blockage.',
        reads: [
          { k: 'What you see', t: 'A very bright jet at the center, where the passage narrows.' },
          { k: 'What it gives you', t: 'Anticipate a blockage and schedule maintenance before a shutdown.' },
        ],
        readout: 'constriction · accelerated jet',
      },
      {
        field: 'cleaning', idx: '05', tag: 'CIP_CLEANING',
        title: 'Tuning cleaning as precisely as possible',
        intro: 'During cleaning, the velocity field shows whether the liquid passes strongly enough where the deposit clings. Enough to clean neither too much nor too little.',
        reads: [
          { k: 'What you see', t: 'The flow scouring the deposit stuck to the lower wall.' },
          { k: 'What it gives you', t: 'Reduce cleaning time, water and products, with no risk of residue.' },
        ],
        readout: 'scouring · controlled cycle',
      },
      {
        field: 'quality', idx: '06', tag: 'QUALITY_CONTROL',
        title: 'A stable signature, product after product',
        intro: 'A well-controlled liquid always gives the same velocity field. Any drift — viscosity, mixing, composition — reads as a deviation from that signature.',
        reads: [
          { k: 'What you see', t: 'A regular, homogeneous flow: the signature of a compliant product.' },
          { k: 'What it gives you', t: 'Detect an anomaly early and attest to the consistency of your products.' },
        ],
        readout: 'stable signature · compliant',
      },
    ],
  },

  products: {
    eyebrow: '// Offers',
    title: 'Three ways to work with PIVUS',
    lead: 'Purchase, rental or service: you choose the level of support.',
    items: [
      {
        kicker: '01 — Turnkey solution',
        title: 'Hardware + software',
        desc: 'The measurement equipment and its processing software, installed at your site. To buy or to rent, with a software license.',
        feats: ['Ultrasonic measurement hardware', 'Processing & visualization software', 'Purchase or rental + license'],
      },
      {
        kicker: '02 — Measurement service',
        title: 'Measurement campaigns',
        desc: 'Our teams come to measure at your site and deliver a complete, detailed report of your installation.',
        feats: ['On-site intervention', 'Velocity field analysis', 'Complete, detailed report'],
      },
      {
        kicker: '03 — Rental',
        title: 'Equipment on demand',
        desc: 'The testing equipment made available for a defined period, for a one-off need or a trial.',
        feats: ['Temporary availability', 'Ideal for a test or an activity peak', 'Onboarding support'],
      },
    ],
  },

  positioning: {
    eyebrow: '// Positioning',
    title: 'Non-destructive testing, applied to liquids',
    body: 'PIVUS is a non-destructive testing (NDT) company specialized in liquids. We address anyone whose liquids have value — and for whom an invisible defect is costly.',
    sectors: [
      { ico: 'agro', name: 'Food & Beverage', line: 'Quality, hygiene and cleaning under control.' },
      { ico: 'chem', name: 'Chemistry', line: 'Processes under control, without intrusion.' },
      { ico: 'pharma', name: 'Pharmaceuticals', line: 'Traceability and cleanliness of circuits.' },
      { ico: 'cosmo', name: 'Cosmetics', line: 'Consistency of textures and mixtures.' },
      { ico: 'energy', name: 'Energy', line: 'Heat-transfer liquids and circuits under watch.' },
    ],
  },

  contact: {
    eyebrow: '// Let\u2019s talk',
    title: 'A problem with a liquid? Tell us about it.',
    body: 'We are looking for concrete cases. Tell us what is blocking you with one of your liquids — even if you do not yet know whether it is measurable. Together we will study whether our method can help.',
    points: [
      'We read your problem and assess feasibility.',
      'We tell you frankly whether the velocity field can help.',
      'If so, we define a first trial together.',
    ],
    labels: {
      nom: 'Name', email: 'Email', societe: 'Company', secteur: 'Sector',
      liquide: 'Type of liquid', stade: 'At what stage?',
      message: 'Your problem or your question', submit: 'Send via email',
    },
    formFoot: 'Opens your mail app with the message pre-filled · Reply within 48 business hours.',
    successTitle: 'Your email is ready!',
    successBody: 'Your mail app opened with all your details. Just press Send.',
    errorBody: 'An error occurred while sending. Try again or write to us directly.',
  },

  footer: {
    tagline: 'Non-destructive testing applied to liquids. Ultrasonic measurement of the velocity field, contactless.',
    navTitle: 'Navigation',
    contactTitle: 'Contact',
    legalTitle: 'Legal',
    cguLink: 'Terms of Use',
    cgvLink: 'Terms of Sale',
    copyright: '© 2026 PIVUS — All rights reserved.',
    meta: 'Deeptech · Instrumentation · NDT of liquids',
  },

  legal: {
    cgu: {
      title: 'Terms of Use',
      subtitle: 'The rules governing access to and use of the PIVUS website.',
      updated: 'Last updated: to be completed',
      blocks: [
        { h: '1. Preamble', p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
        { h: '2. Access to the site', p: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { h: '3. Intellectual property', p: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
        { h: '4. Personal data', p: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
        { h: '5. Liability', p: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.' },
        { h: '6. Contact', p: 'For any question regarding these terms, contact us at {email}.' },
      ],
    },
    cgv: {
      title: 'Terms of Sale',
      subtitle: 'The terms applicable to our offers: purchase, rental and services.',
      updated: 'Last updated: to be completed',
      blocks: [
        { h: '1. Purpose', p: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
        { h: '2. Orders', p: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
        { h: '3. Price and payment', p: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
        { h: '4. Delivery and installation', p: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { h: '5. Warranties', p: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.' },
        { h: '6. Rental and services', p: 'Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
        { h: '7. Governing law', p: 'For any question regarding these terms of sale, contact us at {email}.' },
      ],
    },
  },
};
