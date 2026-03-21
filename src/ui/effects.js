const FIRE_COLORS = [
  '#ff3300', '#ff6600', '#ffaa00', '#ffee44', '#ffffff',
  '#4499ff', '#aa44ff', '#ff44aa', '#44ffbb', '#00ccff',
  '#ff9944', '#aaff44', '#ff4488', '#44aaff', '#cc44ff',
];

function rand(min, max) { return min + Math.random() * (max - min); }
function pick(arr)       { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Rocket ───────────────────────────────────────────────────────────────────

class Rocket {
  constructor(W, H) {
    this.x     = rand(W * 0.1, W * 0.9);
    this.y     = H + 5;
    this.vx    = rand(-1.2, 1.2);
    this.vy    = rand(-14, -9);
    this.color = pick(FIRE_COLORS);
    this.trail = [];
  }

  /** Returns true while the rocket is still rising. */
  update() {
    this.trail.unshift({ x: this.x, y: this.y });
    if (this.trail.length > 14) this.trail.pop();
    this.x  += this.vx;
    this.y  += this.vy;
    this.vy += 0.25; // gravity
    return this.vy < 0;
  }

  draw(ctx) {
    // Golden trail that fades
    for (let i = 0; i < this.trail.length; i++) {
      const a = (1 - i / this.trail.length) * 0.85;
      ctx.globalAlpha = a;
      ctx.fillStyle   = i < 4 ? '#ffdd44' : '#ff8800';
      const r = (1 - i / this.trail.length) * 2.5;
      ctx.beginPath();
      ctx.arc(this.trail[i].x, this.trail[i].y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Bright white tip
    ctx.globalAlpha = 1;
    ctx.fillStyle   = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Burst ─────────────────────────────────────────────────────────────────────

function createBurst(x, y) {
  const color      = pick(FIRE_COLORS);
  const count      = Math.floor(rand(100, 150));
  const particles  = [];

  // Main spoke particles — evenly spread for the "star" pattern
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + rand(-0.06, 0.06);
    const speed = rand(2.5, 9);
    particles.push({
      x, y, prevX: x, prevY: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color, alpha: 1, white: false,
    });
  }

  // Extra white sparkle particles from center
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = rand(0.5, 6);
    particles.push({
      x, y, prevX: x, prevY: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: '#ffffff', alpha: 1, white: true,
    });
  }

  return { x, y, color, particles, flashAlpha: 1.0 };
}

// ── Fireworks engine ──────────────────────────────────────────────────────────

function runFireworks(canvas) {
  const ctx     = canvas.getContext('2d');
  const W       = canvas.width;
  const H       = canvas.height;
  const rockets = [];
  const bursts  = [];

  // Launch rockets over ~4 seconds
  let launched = 0;
  const total  = 16;

  function scheduleLaunch() {
    if (launched < total) {
      rockets.push(new Rocket(W, H));
      launched++;
      setTimeout(scheduleLaunch, rand(180, 500));
    }
  }
  // Fire the first 3 immediately for instant impact
  rockets.push(new Rocket(W, H));
  rockets.push(new Rocket(W, H));
  rockets.push(new Rocket(W, H));
  launched = 3;
  setTimeout(scheduleLaunch, 400);

  let raf;

  function tick() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;

    let alive = launched < total || rockets.length > 0;

    // ── Rockets ──────────────────────────────────────────────
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      if (!r.update()) {
        bursts.push(createBurst(r.x, r.y));
        rockets.splice(i, 1);
      } else {
        r.draw(ctx);
      }
    }

    // ── Burst flash ──────────────────────────────────────────
    for (const b of bursts) {
      if (b.flashAlpha > 0) {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 50);
        grad.addColorStop(0,   '#ffffff');
        grad.addColorStop(0.3, b.color);
        grad.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.globalAlpha = b.flashAlpha * 0.7;
        ctx.fillStyle   = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 50, 0, Math.PI * 2);
        ctx.fill();
        b.flashAlpha -= 0.07;
      }
    }

    // ── Burst particles — drawn as streak lines ───────────────
    ctx.lineCap = 'round';
    for (const b of bursts) {
      for (const p of b.particles) {
        if (p.alpha <= 0) continue;
        alive = true;

        // Save previous position, then move
        p.prevX  = p.x;
        p.prevY  = p.y;
        p.x     += p.vx;
        p.y     += p.vy;
        p.vy    += 0.07;  // gravity droops the sparks downward
        p.vx    *= 0.98;  // slight air resistance
        p.alpha -= p.white ? 0.018 : 0.012;

        // Draw as a line from previous to current → gives the streak look
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth   = p.white ? 1 : 1.8;
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    if (alive) raf = requestAnimationFrame(tick);
  }

  tick();
  return () => cancelAnimationFrame(raf);
}

// ── Public API ────────────────────────────────────────────────────────────────

export function launchEffect() {
  const canvas        = document.createElement('canvas');
  canvas.width        = window.innerWidth;
  canvas.height       = window.innerHeight;
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:999';
  document.body.appendChild(canvas);

  const stopAnim = runFireworks(canvas);
  const cleanup  = () => { stopAnim(); canvas.remove(); };
  const autoStop = setTimeout(cleanup, 6500);

  return () => { clearTimeout(autoStop); cleanup(); };
}
