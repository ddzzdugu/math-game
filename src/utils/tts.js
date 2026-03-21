/**
 * Text-to-speech using the Web Speech API.
 * Picks a voice appropriate to the theme.
 */

/** Prefer enhanced/premium neural voices; fall back to any matching locale. */
function pickVoice(voices, theme) {
  const enhanced = v => /enhanced|premium|neural/i.test(v.name);

  if (theme === 'hp') {
    // British English — warm, authoritative
    return voices.find(v => v.lang === 'en-GB' && enhanced(v)) ||
           voices.find(v => v.lang === 'en-GB') ||
           voices.find(v => v.lang === 'en-AU' && enhanced(v)) ||  // Aussie also sounds good
           voices.find(v => v.lang.startsWith('en') && enhanced(v)) ||
           voices.find(v => v.lang.startsWith('en')) ||
           null;
  } else {
    // US English — energetic
    return voices.find(v => v.lang === 'en-US' && enhanced(v)) ||
           voices.find(v => v.lang === 'en-US') ||
           voices.find(v => v.lang.startsWith('en') && enhanced(v)) ||
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
  utterance.rate  = theme === 'hp' ? 0.9 : 1.0;
  utterance.pitch = theme === 'hp' ? 0.95 : 1.0;

  const voices = await getVoices();
  const voice  = pickVoice(voices, theme);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}
