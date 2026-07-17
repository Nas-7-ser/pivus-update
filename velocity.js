/* PIVUS — Moteur de rendu de champ de vitesses 2D
 * Couche 1 : heatmap (magnitude) calculée sur grille basse résolution, lissée à l'affichage.
 * Couche 2 : particules advectées dans le champ -> lignes de courant / traînées (additif, glow).
 * Le champ est défini en coordonnées normalisées [0,1]x[0,1] -> [u,v].
 * Ne s'anime que lorsqu'il est visible (IntersectionObserver).
 */
(function () {
  'use strict';

  // ---------- Colormaps : t in [0,1] -> [r,g,b] ----------
  function makeRamp(stops) {
    // stops: [ [t, [r,g,b]], ... ] triés
    return function (t) {
      t = Math.max(0, Math.min(1, t));
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i], b = stops[i + 1];
        if (t >= a[0] && t <= b[0]) {
          const f = (t - a[0]) / (b[0] - a[0] || 1);
          return [
            a[1][0] + (b[1][0] - a[1][0]) * f,
            a[1][1] + (b[1][1] - a[1][1]) * f,
            a[1][2] + (b[1][2] - a[1][2]) * f,
          ];
        }
      }
      return stops[stops.length - 1][1];
    };
  }

  const colormaps = {
    // marine PIVUS : bleu nuit -> bleu électrique -> cyan -> blanc
    marine: makeRamp([
      [0.00, [9, 16, 36]],
      [0.30, [22, 42, 104]],
      [0.55, [47, 109, 240]],
      [0.78, [40, 196, 230]],
      [1.00, [216, 246, 255]],
    ]),
    // turbo-ish scientifique
    turbo: makeRamp([
      [0.00, [16, 24, 64]],
      [0.22, [38, 86, 200]],
      [0.45, [33, 190, 180]],
      [0.62, [120, 214, 80]],
      [0.80, [250, 196, 56]],
      [1.00, [246, 92, 40]],
    ]),
    // mono cyan sobre
    mono: makeRamp([
      [0.00, [10, 16, 34]],
      [0.50, [24, 74, 120]],
      [1.00, [86, 224, 240]],
    ]),
  };

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  class VelocityField {
    constructor(canvas, opts) {
      opts = opts || {};
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.field = opts.field; // (x,y,t) => [u,v]
      this.dynamic = !!opts.dynamic; // champ variable dans le temps
      this.cmap = colormaps[opts.colormap] || colormaps.marine;
      this.colormapName = opts.colormap || 'marine';
      this.bg = opts.bg || [9, 14, 30];
      this.nParticles = opts.nParticles || 520;
      this.speed = opts.speed || 1; // facteur d'advection
      this.fade = opts.fade != null ? opts.fade : 0.085; // longueur de traînée
      this.gridW = opts.gridW || 150;
      this.gridH = opts.gridH || 90;
      this.showArrows = !!opts.showArrows;
      this.vmax = opts.vmax || null; // si null, auto
      this.lineWidth = opts.lineWidth || 1.1;
      this.streakTint = opts.streakTint || null; // [r,g,b] sinon colormap haute
      this.heatAlpha = opts.heatAlpha != null ? opts.heatAlpha : 1;

      this.t = 0;
      this.running = false;
      this.raf = null;
      this.lastTime = 0;
      this.heatEvery = this.dynamic ? 3 : 999999; // frames entre recalc heatmap
      this.frame = 0;

      this._initOffscreens();
      this._initParticles();
      this._resize();
      this._renderHeatmap();

      this._onResize = () => this._resize();
      window.addEventListener('resize', this._onResize);

      // visibilité
      this.io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting) this.start();
          else this.stop();
        });
      }, { threshold: 0.05 });
      this.io.observe(canvas);
    }

    _initOffscreens() {
      this.heat = document.createElement('canvas');
      this.heat.width = this.gridW;
      this.heat.height = this.gridH;
      this.heatCtx = this.heat.getContext('2d');
      this.heatImg = this.heatCtx.createImageData(this.gridW, this.gridH);

      this.trail = document.createElement('canvas');
      this.trailCtx = this.trail.getContext('2d');
    }

    _initParticles() {
      this.particles = [];
      for (let i = 0; i < this.nParticles; i++) this.particles.push(this._spawn());
      // auto vmax par échantillonnage
      if (!this.vmax) {
        let m = 1e-6;
        for (let i = 0; i < 1400; i++) {
          const x = Math.random(), y = Math.random();
          const [u, v] = this.field(x, y, 0);
          const s = Math.hypot(u, v);
          if (s > m) m = s;
        }
        this.vmax = m * 0.92;
      }
    }

    _spawn(atEdge) {
      return {
        x: atEdge ? -0.02 : Math.random(),
        y: Math.random(),
        age: Math.random() * 90,
        maxAge: 70 + Math.random() * 120,
      };
    }

    _resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (w === this.canvas.width && h === this.canvas.height) return;
      this.canvas.width = w;
      this.canvas.height = h;
      this.trail.width = w;
      this.trail.height = h;
      this.trailCtx.clearRect(0, 0, w, h);
      this.W = w; this.H = h;
    }

    _renderHeatmap() {
      const { gridW, gridH, heatImg } = this;
      const d = heatImg.data;
      const t = this.t;
      for (let j = 0; j < gridH; j++) {
        const y = (j + 0.5) / gridH;
        for (let i = 0; i < gridW; i++) {
          const x = (i + 0.5) / gridW;
          const [u, v] = this.field(x, y, t);
          const s = clamp01(Math.hypot(u, v) / this.vmax);
          // courbe douce pour contraste
          const tt = Math.pow(s, 0.85);
          const c = this.cmap(tt);
          const k = (j * gridW + i) * 4;
          d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
        }
      }
      this.heatCtx.putImageData(heatImg, 0, 0);

      // arrows (optionnel) sur la couche heatmap mise à l'échelle => on les dessine au composite
    }

    start() {
      if (this.running) return;
      this.running = true;
      this._resize();
      this.lastTime = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = Math.min(0.05, (now - this.lastTime) / 1000);
        this.lastTime = now;
        this._step(dt);
        this._draw();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }

    stop() {
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
    }

    _step(dt) {
      this.t += dt;
      this.frame++;
      if (this.dynamic && this.frame % this.heatEvery === 0) this._renderHeatmap();

      const sp = this.speed * dt;
      for (const p of this.particles) {
        const [u, v] = this.field(p.x, p.y, this.t);
        p.px = p.x; p.py = p.y;
        p.x += u * sp;
        p.y += v * sp;
        p.age += 1;
        p.spd = Math.hypot(u, v);
        if (p.x < -0.05 || p.x > 1.05 || p.y < -0.05 || p.y > 1.05 || p.age > p.maxAge) {
          const np = this._spawn(u > 0.02 && p.x > 1.0);
          Object.assign(p, np);
          p.px = p.x; p.py = p.y;
        }
      }
    }

    _draw() {
      this._resize();
      const { ctx, W, H } = this;
      // fond
      ctx.fillStyle = `rgb(${this.bg[0]},${this.bg[1]},${this.bg[2]})`;
      ctx.fillRect(0, 0, W, H);

      // heatmap lissée
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = this.heatAlpha;
      ctx.drawImage(this.heat, 0, 0, W, H);
      ctx.globalAlpha = 1;

      if (this.showArrows) this._drawArrows();

      // couche traînées : fade puis nouveaux segments
      const tc = this.trailCtx;
      tc.globalCompositeOperation = 'destination-out';
      tc.fillStyle = `rgba(0,0,0,${this.fade})`;
      tc.fillRect(0, 0, W, H);
      tc.globalCompositeOperation = 'lighter';
      tc.lineCap = 'round';
      for (const p of this.particles) {
        if (p.px == null) continue;
        const sN = clamp01(p.spd / this.vmax);
        if (sN < 0.015) continue;
        let col;
        if (this.streakTint) col = this.streakTint;
        else { const c = this.cmap(Math.min(1, sN * 1.15 + 0.15)); col = c; }
        const a = 0.10 + sN * 0.55;
        tc.strokeStyle = `rgba(${col[0]|0},${col[1]|0},${col[2]|0},${a})`;
        tc.lineWidth = this.lineWidth * (0.6 + sN * 1.1);
        tc.beginPath();
        tc.moveTo(p.px * W, p.py * H);
        tc.lineTo(p.x * W, p.y * H);
        tc.stroke();
      }
      // composer la couche traînées
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(this.trail, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    }

    _drawArrows() {
      const { ctx, W, H } = this;
      const nx = 16, ny = 10;
      ctx.lineWidth = Math.max(1, W / 900);
      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const x = (i + 0.5) / nx, y = (j + 0.5) / ny;
          const [u, v] = this.field(x, y, this.t);
          const s = Math.hypot(u, v) / this.vmax;
          if (s < 0.04) continue;
          const len = Math.min(0.9, s) * (W / nx) * 0.62;
          const ang = Math.atan2(v, u);
          const cx = x * W, cy = y * H;
          const ex = cx + Math.cos(ang) * len, ey = cy + Math.sin(ang) * len;
          ctx.strokeStyle = `rgba(255,255,255,${0.10 + s * 0.28})`;
          ctx.beginPath();
          ctx.moveTo(cx, cy); ctx.lineTo(ex, ey);
          // pointe
          const ah = len * 0.34;
          ctx.lineTo(ex - Math.cos(ang - 0.5) * ah, ey - Math.sin(ang - 0.5) * ah);
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - Math.cos(ang + 0.5) * ah, ey - Math.sin(ang + 0.5) * ah);
          ctx.stroke();
        }
      }
    }

    setColormap(name) {
      this.cmap = colormaps[name] || colormaps.marine;
      this.colormapName = name;
      this._renderHeatmap();
    }
    setArrows(on) { this.showArrows = !!on; }

    destroy() {
      this.stop();
      if (this.io) this.io.disconnect();
      window.removeEventListener('resize', this._onResize);
    }
  }

  window.PIVUS_VF = { VelocityField, colormaps };
})();
