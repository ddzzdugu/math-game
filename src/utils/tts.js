/**
 * Text-to-speech using the Web Speech API.
 *
 * iOS Safari restricts speechSynthesis to user-gesture contexts. Two rules:
 *   1. Call unlockTTS() inside a click/touch handler before the game starts.
 *   2. Never call speechSynthesis.cancel() outside a gesture — it resets the
 *      unlock. We only cancel when already speaking (replay button = gesture).
 */

/** Prefer enhanced/premium neural voices; fall back to any matching locale. */
function pickVoice(voices, theme) {
  const enhanced = v => /enhanced|premium|neural/i.test(v.name);

  if (theme === 'hp') {
    return voices.find(v => v.lang === 'en-GB' && enhanced(v)) ||
           voices.find(v => v.lang === 'en-GB') ||
           voices.find(v => v.lang === 'en-AU' && enhanced(v)) ||
           voices.find(v => v.lang.startsWith('en') && enhanced(v)) ||
           voices.find(v => v.lang.startsWith('en')) ||
           null;
  } else {
    return voices.find(v => v.lang === 'en-US' && enhanced(v)) ||
           voices.find(v => v.lang === 'en-US') ||
           voices.find(v => v.lang.startsWith('en') && enhanced(v)) ||
           voices.find(v => v.lang.startsWith('en')) ||
           null;
  }
}

// Cached voices so speak() doesn't need to await after first load
let cachedVoices = null;

function loadVoices() {
  return new Promise(resolve => {
    const v = window.speechSynthesis.getVoices();
    if (v.length) { cachedVoices = v; resolve(v); return; }
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      cachedVoices = window.speechSynthesis.getVoices();
      resolve(cachedVoices);
    }, { once: true });
  });
}

/**
 * Call once inside a click/touch handler (e.g. Start button).
 * Speaks a silent utterance to open the speech channel on iOS,
 * and pre-warms the voice list so speak() can run synchronously later.
 */
export async function unlockTTS() {
  if (!window.speechSynthesis) return;
  // Pre-load voices while we're in a gesture context
  cachedVoices = await loadVoices();
  // Speak a silent dot to open the iOS speech channel — do NOT cancel after
  const u = new SpeechSynthesisUtterance('.');
  u.volume = 0;
  u.rate = 10;  // finish instantly
  window.speechSynthesis.speak(u);
}

export function speak(text, theme) {
  if (!window.speechSynthesis) return;
  // Only cancel if something is already playing (e.g. replay button tap).
  // Calling cancel() when idle resets the iOS unlock state.
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate  = theme === 'hp' ? 0.9 : 1.0;
  utterance.pitch = theme === 'hp' ? 0.95 : 1.0;

  const voices = cachedVoices || window.speechSynthesis.getVoices();
  const voice  = pickVoice(voices, theme);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}
