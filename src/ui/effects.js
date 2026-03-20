const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6FCF', '#A855F7', '#F97316', '#06B6D4'];
const EMOJIS = ['⭐', '🌟', '🎉', '✨', '🏆', '🎊', '💫', '🔥'];

function rand(min, max) { return min + Math.random() * (max - min); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Confetti ────────────────────────────────────────────────────────────────

function runConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const pieces = Array.from({ length: 160 }, () => ({
    x: rand(0, W),
    y: rand(-300, -10),
    w: rand(7, 14),
    h: rand(3, 7),
    color: pick(COLORS),
    rot: rand(0, Math.PI * 2),
    rotSpeed: rand(-0.12, 0.12),
    vx: rand(-2, 2),
    vy: rand(1.5, 4),
    alpha: 1,
  }));

  // A handful of floating emoji
  const floaters = Array.from({ length: 12 }, () => ({
    x: rand(0, W),
    y: rand(-200, -10),
    emoji: pick(EMOJIS),
    size: rand(24, 42),
    vx: rand(-1, 1),
    vy: rand(1, 2.5),
    alpha: 1,
  }));

  let raf;
  function tick() {
    ctx.clearRect(0, 0, W, H);
    let alive = false;

    for (const p of pieces) {
      p.x += p.vx; p.y += p.vy; p.rot += p.rotSpeed; p.vy += 0.04;
      if (p.y > H * 0.75) p.alpha -= 0.02;
      if (p.alpha <= 0) continue;
      alive = true;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    for (const f of floaters) {
      f.x += f.vx; f.y += f.vy;
      if (f.y > H * 0.7) f.alpha -= 0.025;
      if (f.alpha <= 0) continue;
      alive = true;
      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.font = `${f.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(f.emoji, f.x, f.y);
      ctx.restore();
    }

    if (alive) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  }
  tick();
  return () => cancelAnimationFrame(raf);
}

// ── Fireworks ───────────────────────────────────────────────────────────────

function runFireworks(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const particles = [];

  function explode(x, y) {
    const color = pick(COLORS);
    const count = Math.floor(rand(55, 80));
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + rand(-0.2, 0.2);
      const speed = rand(2, 6);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color, alpha: 1,
        r: rand(2, 4),
      });
    }
    // Scatter some emojis from the burst
    for (let i = 0; i < 4; i++) {
      particles.push({
        x, y,
        vx: rand(-3, 3),
        vy: rand(-5, -1),
        emoji: pick(EMOJIS),
        size: rand(22, 36),
        alpha: 1,
        r: 0,
      });
    }
  }

  // Schedule bursts
  const bursts = [
    [0,    0.35, 0.30],
    [450,  0.65, 0.25],
    [900,  0.50, 0.38],
    [1350, 0.25, 0.28],
    [1800, 0.75, 0.32],
    [2300, 0.45, 0.22],
  ];
  const timers = bursts.map(([delay, rx, ry]) =>
    setTimeout(() => explode(W * rx, H * ry), delay)
  );

  let raf;
  function tick() {
    ctx.clearRect(0, 0, W, H);
    let alive = false;

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.09; p.vx *= 0.97;
      p.alpha -= 0.016;
      if (p.alpha <= 0) continue;
      alive = true;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (p.emoji) {
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.emoji, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (alive || particles.length === 0) raf = requestAnimationFrame(tick);
  }
  tick();
  return () => { timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
}

// ── Public API ───────────────────────────────────────────────────────────────

export function launchEffect() {
  const canvas = document.createElement('canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:999';
  document.body.appendChild(canvas);

  const type = Math.random() < 0.5 ? 'fireworks' : 'confetti';
  const stopAnim = type === 'fireworks' ? runFireworks(canvas) : runConfetti(canvas);

  const cleanup = () => { stopAnim(); canvas.remove(); };
  const autoStop = setTimeout(cleanup, 4200);

  return () => { clearTimeout(autoStop); cleanup(); };
}
