/* PIVUS — Bibliothèque de champs de vitesses
 * Coordonnées normalisées : x gauche->droite [0,1], y haut->bas [0,1].
 * Chaque champ renvoie [u, v]. `dynamic:true` => recalcul heatmap en continu.
 */
(function () {
  'use strict';
  const PI2 = Math.PI * 2;
  const sq = (a) => a * a;

  // contribution d'un tourbillon gaussien
  function vortex(x, y, cx, cy, k, sig) {
    const dx = x - cx, dy = y - cy;
    const r2 = dx * dx + dy * dy;
    const fall = Math.exp(-r2 / (2 * sig * sig));
    return [-k * dy * fall, k * dx * fall];
  }

  const FIELDS = {
    // ---- HERO : écoulement ample + tourbillons lents, élégant ----
    hero: {
      dynamic: true,
      speed: 0.42,
      fade: 0.055,
      nParticles: 900,
      field: (x, y, t) => {
        let u = 0.55 + 0.10 * Math.sin(PI2 * (y * 1.2) + 0.4);
        let v = 0.05 * Math.sin(PI2 * (x * 0.9 + t * 0.05));
        const vs = [
          [0.30 + 0.05 * Math.sin(t * 0.21), 0.40 + 0.06 * Math.cos(t * 0.18), 0.30, 0.20],
          [0.62 + 0.05 * Math.cos(t * 0.16), 0.62 + 0.05 * Math.sin(t * 0.23), -0.34, 0.22],
          [0.85 + 0.04 * Math.sin(t * 0.19), 0.32 + 0.05 * Math.cos(t * 0.2), 0.26, 0.18],
        ];
        for (const p of vs) {
          const c = vortex(x, y, p[0], p[1], p[2], p[3]);
          u += c[0]; v += c[1];
        }
        return [u, v];
      },
    },

    // ---- 1. Cisaillement à la paroi : profil de Poiseuille (gradient fort aux parois) ----
    channel: {
      dynamic: false,
      speed: 0.7,
      field: (x, y) => {
        const prof = 1 - sq(2 * y - 1); // 0 aux parois, 1 au centre
        return [0.18 + 0.95 * prof, 0];
      },
    },

    // ---- 2. Turbulences : écoulement de base + tourbillons mobiles ----
    turbulence: {
      dynamic: true,
      speed: 0.7,
      fade: 0.07,
      nParticles: 760,
      field: (x, y, t) => {
        let u = 0.5, v = 0;
        const vs = [
          [0.22 + 0.10 * Math.sin(t * 0.9), 0.35 + 0.12 * Math.cos(t * 1.1), 1.3, 0.14],
          [0.48 + 0.12 * Math.cos(t * 0.8), 0.62 + 0.10 * Math.sin(t * 1.3), -1.5, 0.13],
          [0.70 + 0.11 * Math.sin(t * 1.2), 0.40 + 0.13 * Math.cos(t * 0.7), 1.4, 0.12],
          [0.86 + 0.08 * Math.cos(t * 1.0), 0.66 + 0.09 * Math.sin(t * 0.95), -1.2, 0.13],
          [0.36 + 0.09 * Math.sin(t * 1.4), 0.78 + 0.08 * Math.cos(t * 1.05), 1.1, 0.11],
        ];
        for (const p of vs) {
          const c = vortex(x, y, p[0], p[1], p[2], p[3]);
          u += c[0]; v += c[1];
        }
        return [u, v];
      },
    },

    // ---- 3. Zones mortes : écoulement principal + poche quasi stagnante ----
    deadzone: {
      dynamic: false,
      speed: 0.7,
      field: (x, y) => {
        let u = 0.30 + 0.85 * (1 - sq(2 * y - 1)) * (y < 0.55 ? 1 : 0.5);
        let v = 0;
        // poche morte en bas-droite
        const dx = x - 0.70, dy = y - 0.75;
        const inPocket = Math.exp(-(sq(dx) / 0.05 + sq(dy) / 0.022));
        // faible recirculation + amortissement vers ~0
        u += (-dy * 1.1) * inPocket * 0.5 - u * inPocket * 0.96;
        v += (dx * 1.1) * inPocket * 0.5 - v * inPocket * 0.96;
        // seconde poche coin haut-gauche (derrière une marche)
        const dx2 = x - 0.10, dy2 = y - 0.16;
        const inP2 = Math.exp(-(sq(dx2) / 0.02 + sq(dy2) / 0.018));
        u -= u * inP2 * 0.9; v -= v * inP2 * 0.9;
        return [u, v];
      },
    },

    // ---- 4. Encrassement / bouchon : dépôt qui rétrécit le canal -> jet accéléré ----
    blockage: {
      dynamic: false,
      speed: 0.62,
      field: (x, y) => {
        const bump = 0.34 * Math.exp(-sq((x - 0.52) / 0.15));
        const yl = bump, yh = 1 - bump, w = yh - yl;
        if (y <= yl || y >= yh) return [0.015, 0]; // dans le dépôt : ~ stagnant
        const yn = (y - yl) / w;
        const prof = 1 - sq(2 * yn - 1);
        const mag = (0.42 / w) * prof; // continuité : accélération dans l'étranglement
        // composante verticale pour suivre le rétrécissement
        const dbump = 0.34 * Math.exp(-sq((x - 0.52) / 0.15)) * (-2 * (x - 0.52) / (0.15 * 0.15));
        const v = -dbump * mag * (2 * yn - 1) * 0.5;
        return [mag, v];
      },
    },

    // ---- 5. Optimisation du nettoyage : dépôt sur la paroi basse, écoulement qui décape ----
    cleaning: {
      dynamic: false,
      speed: 0.66,
      field: (x, y) => {
        const mound = 0.30 * Math.exp(-sq((x - 0.5) / 0.17));
        const bot = 1 - mound;
        if (y >= bot) return [0.02, 0]; // dépôt
        const w = bot;
        const yn = y / w;
        const prof = 1 - sq(2 * yn - 1);
        const mag = (0.40 / w) * prof + 0.12;
        const dmound = 0.30 * Math.exp(-sq((x - 0.5) / 0.17)) * (-2 * (x - 0.5) / (0.17 * 0.17));
        const v = dmound * mag * yn * 0.6; // l'écoulement épouse le relief du dépôt
        return [mag, v];
      },
    },

    // ---- 6. Contrôle qualité : signature laminaire stable et homogène ----
    quality: {
      dynamic: true,
      speed: 0.5,
      fade: 0.05,
      nParticles: 680,
      field: (x, y, t) => {
        const u = 0.6 + 0.08 * Math.sin(PI2 * (y * 1.5) + t * 0.2);
        const v = 0.07 * Math.sin(PI2 * (x * 1.3 - t * 0.12)) * (0.5 - Math.abs(y - 0.5));
        return [u, v];
      },
    },
  };

  window.PIVUS_FIELDS = FIELDS;
})();
