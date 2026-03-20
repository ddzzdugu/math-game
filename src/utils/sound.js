let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function beep(freq, type, duration, volume = 0.3, delay = 0) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.value = freq;
  const t = ac.currentTime + delay;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

export function playCorrect() {
  beep(523, 'sine', 0.12, 0.28);
  beep(659, 'sine', 0.18, 0.28, 0.1);
}

export function playWrong() {
  beep(220, 'square', 0.18, 0.12);
}

export function playFinish() {
  [523, 659, 784, 1047].forEach((freq, i) => {
    beep(freq, 'sine', 0.2, 0.3, i * 0.13);
  });
}

export function playTick() {
  beep(880, 'sine', 0.04, 0.08);
}
