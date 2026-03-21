/**
 * Text-to-speech using the Web Speech API.
 * Picks a voice appropriate to the theme.
 */

function pickVoice(voices, theme) {
  if (theme === 'hp') {
    // Prefer British English — Dumbledore vibes
    return voices.find(v => v.lang === 'en-GB') ||
           voices.find(v => v.lang.startsWith('en')) ||
           null;
  } else {
    // Prefer a US English voice — Percy's energy
    return voices.find(v => v.lang === 'en-US' && /male/i.test(v.name)) ||
           voices.find(v => v.lang === 'en-US') ||
           voices.find(v => v.lang.startsWith('en')) ||
           null;
  }
}

function getVoices() {
  return new Promise(resolve => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) { resolve(voices); return; }
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      resolve(window.speechSynthesis.getVoices());
    }, { once: true });
  });
}

/** Call once from a user-gesture handler to unlock speech on mobile. */
export function unlockTTS() {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance('');
  u.volume = 0;
  window.speechSynthesis.speak(u);
  window.speechSynthesis.cancel();
}

export async function speak(text, theme) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate  = theme === 'hp' ? 0.88 : 1.05;
  utterance.pitch = theme === 'hp' ? 0.85 : 1.1;

  const voices = await getVoices();
  const voice  = pickVoice(voices, theme);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}
