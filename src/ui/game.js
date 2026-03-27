import { generateQuestion } from '../operations/generator.js';
import { Timer } from '../utils/timer.js';
import { CORRECT_MESSAGES, WRONG_MESSAGES, randomFrom } from '../utils/messages.js';
import { playCorrect, playWrong, playFinish, playTick } from '../utils/sound.js';
import { getOpWeights, updateOpStats } from '../utils/storage.js';

const TOTAL_QUESTIONS = 10;

const WORD_NUMBERS = {
  zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,
  ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,
  seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,
  sixty:60,seventy:70,eighty:80,ninety:90,hundred:100,
};

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

function parseFrac(raw) {
  const parts = raw.trim().split('/');
  if (parts.length === 2) {
    const n = parseInt(parts[0].trim(), 10);
    const d = parseInt(parts[1].trim(), 10);
    if (!isNaN(n) && !isNaN(d) && d > 0) {
      const g = gcd(Math.abs(n), d);
      return { n: n / g, d: d / g };
    }
  }
  const n = parseInt(raw.trim(), 10);
  if (!isNaN(n)) return { n, d: 1 };
  return null;
}

function fmtFrac({ n, d }) { return d === 1 ? `${n}` : `${n}/${d}`; }

function parseSpoken(transcript) {
  const t = transcript.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '');
  // Try direct digit parse first
  const direct = parseInt(t.replace(/\s+/g, ''), 10);
  if (!isNaN(direct)) return direct;
  // Word-based: "twenty four" → 24, "negative five" → -5
  const negative = t.startsWith('negative') || t.startsWith('minus');
  const words = t.replace(/negative|minus/g, '').trim().split(/[\s-]+/);
  let total = 0, chunk = 0;
  for (const w of words) {
    const n = WORD_NUMBERS[w];
    if (n === undefined) continue;
    if (n === 100) { chunk = (chunk || 1) * 100; }
    else if (n >= 10) { chunk += n; total += chunk; chunk = 0; }
    else { chunk += n; }
  }
  total += chunk;
  return total === 0 && !words.some(w => w === 'zero' || w === '0') ? NaN : (negative ? -total : total);
}

export function renderGame(container, navigate, state) {
  const isTimedSession = !!state.timerSecs;
  if (!isTimedSession) state.totalQuestions = TOTAL_QUESTIONS;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const voiceSupported = !!SpeechRecognition;
  const useVoice = voiceSupported && state.inputMode === 'voice';

  container.innerHTML = `
    <div class="screen game-screen">
      <div class="scorebar">
        <div class="score-card"><div class="sc-label">Correct</div><div class="sc-val" id="sc-correct">0</div></div>
        <div class="score-card"><div class="sc-label">Wrong</div><div class="sc-val" id="sc-wrong">0</div></div>
        <div class="score-card"><div class="sc-label">${isTimedSession ? 'Done' : 'Question'}</div><div class="sc-val" id="sc-q">${isTimedSession ? '0' : `1 / ${TOTAL_QUESTIONS}`}</div></div>
      </div>

      <div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>

      <div class="timer-display" id="timer-display" style="display:none"></div>

      <button class="stop-btn" id="stop-btn">Stop</button>

      <div class="question-box" id="question-box">
        <div class="question-text" id="q-text"></div>
        <div class="feedback" id="feedback"></div>

        <div id="type-input" class="answer-row" style="${useVoice ? 'display:none' : ''}">
          <input class="answer-input" type="text" inputmode="numeric" id="ans-input" placeholder="?" autocomplete="off" />
          <button class="submit-btn" id="submit-btn">Go!</button>
        </div>

        <div id="voice-input" class="voice-row" style="${useVoice ? '' : 'display:none'}">
          <div class="voice-status" id="voice-status">
            <span class="voice-dot"></span>
            <span class="voice-label" id="voice-label">Get ready…</span>
          </div>
        </div>
      </div>
    </div>
  `;

  let currentQuestion = null;
  let questionStartTime = null;
  let locked = false;
  let gameActive = true;
  let feedbackTimeout = null;
  let recognition = null;
  let recognizing = false;
  let sessionTimer = null;

  function onKey(e) {
    if (e.key === 'Enter') {
      if (!gameActive) { document.removeEventListener('keydown', onKey); return; }
      container.querySelector('#submit-btn').click();
    }
  }

  function endGame() {
    gameActive = false;
    clearTimeout(feedbackTimeout);
    stopRecognition();
    if (sessionTimer) sessionTimer.stop();
    document.removeEventListener('keydown', onKey);
    playFinish();
    navigate('end', { state });
  }

  container.querySelector('#stop-btn').addEventListener('click', endGame);

  if (isTimedSession) {
    const disp = container.querySelector('#timer-display');
    disp.style.display = 'block';
    sessionTimer = new Timer(
      state.timerSecs,
      (t) => {
        disp.textContent = `⏱ ${t}s`;
        disp.className = t <= 10 ? 'timer-display urgent' : 'timer-display';
        container.querySelector('#progress-fill').style.width =
          `${((state.timerSecs - t) / state.timerSecs) * 100}%`;
        if (t <= 10) playTick();
      },
      () => endGame()
    );
    sessionTimer.start();
  }

  function setVoiceLabel(text, active = false) {
    const dot   = container.querySelector('.voice-dot');
    const label = container.querySelector('#voice-label');
    if (!dot || !label) return;
    dot.classList.toggle('active', active);
    label.textContent = text;
  }

  function stopRecognition() {
    if (recognition && recognizing) { recognition.abort(); recognizing = false; }
  }

  function startRecognition() {
    if (!SpeechRecognition || locked || !gameActive) return;
    stopRecognition();

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;   // get results as you speak, don't wait for silence
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      recognizing = true;
      setVoiceLabel('Listening…', true);
    };

    recognition.onresult = (e) => {
      // Check every result (interim and final) for a parseable number
      for (const result of e.results) {
        const parsed = parseSpoken(result[0].transcript);
        if (!isNaN(parsed)) {
          // Got a number — don't wait for silence detection, submit immediately
          recognition.abort();
          recognizing = false;
          setVoiceLabel('Got it!');
          handleAnswer(parsed);
          return;
        }
      }
      // Still listening, no number yet — keep going
    };

    // onresult handles all final results; only reach here if nothing was parseable
    recognition.onend = () => {
      if (!recognizing) return; // already handled by onresult abort
      recognizing = false;
      setVoiceLabel("Didn't catch that…");
      setTimeout(startRecognition, 400);
    };

    recognition.onerror = (e) => {
      recognizing = false;
      if (e.error === 'not-allowed') {
        setVoiceLabel('Mic blocked — check permissions');
      } else if (e.error !== 'aborted') {
        setVoiceLabel('Try again…');
        setTimeout(startRecognition, 600);
      }
    };

    recognition.start();
  }

  function nextQuestion() {
    if (!gameActive) return;
    if (!isTimedSession && state.isFinished) { endGame(); return; }

    locked = false;
    stopRecognition();
    questionStartTime = Date.now();
    currentQuestion = generateQuestion(state.ops, state.range, getOpWeights(state.ops));

    container.querySelector('#q-text').textContent = `${currentQuestion.text} = ?`;
    const ansInput = container.querySelector('#ans-input');
    ansInput.value = '';
    ansInput.inputMode = currentQuestion.isFraction ? 'text' : 'numeric';
    ansInput.placeholder = currentQuestion.isFraction ? 'e.g. 3/4' : '?';
    container.querySelector('#feedback').textContent = '';
    container.querySelector('#feedback').className = 'feedback';
    if (useVoice) {
      const isFrac = currentQuestion.isFraction;
      container.querySelector('#type-input').style.display = isFrac ? '' : 'none';
      container.querySelector('#voice-input').style.display = isFrac ? 'none' : '';
      if (!isFrac) { setVoiceLabel('Get ready…'); setTimeout(startRecognition, 150); }
      else { stopRecognition(); ansInput.focus(); }
    } else {
      ansInput.focus();
    }

    // Reset animations
    const qbox = container.querySelector('#question-box');
    qbox.classList.remove('correct-bounce', 'wrong-shake');

    if (isTimedSession) {
      container.querySelector('#sc-q').textContent = state.currentQ;
    } else {
      container.querySelector('#sc-q').textContent = `${state.currentQ + 1} / ${TOTAL_QUESTIONS}`;
      container.querySelector('#progress-fill').style.width =
        `${(state.currentQ / TOTAL_QUESTIONS) * 100}%`;
    }
  }

  function handleAnswer(rawVal) {
    if (locked || !gameActive) return;
    locked = true;

    let userAnswer, isCorrect;
    if (currentQuestion.isFraction) {
      const parsed = parseFrac(String(rawVal));
      isCorrect = parsed !== null && parsed.n === currentQuestion.answer.n && parsed.d === currentQuestion.answer.d;
      userAnswer = parsed ? fmtFrac(parsed) : String(rawVal);
    } else {
      userAnswer = parseInt(rawVal, 10);
      isCorrect = userAnswer === currentQuestion.answer;
    }
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);

    state.recordAnswer({ question: currentQuestion.text, userAnswer, isCorrect, timeTaken });
    updateOpStats(currentQuestion.op, isCorrect);

    // Animate question box
    const qbox = container.querySelector('#question-box');
    qbox.classList.remove('correct-bounce', 'wrong-shake');
    void qbox.offsetWidth; // force reflow to restart animation
    qbox.classList.add(isCorrect ? 'correct-bounce' : 'wrong-shake');

    const fb = container.querySelector('#feedback');
    if (isCorrect) {
      fb.textContent = randomFrom(CORRECT_MESSAGES);
    } else {
      const correctDisplay = currentQuestion.isFraction ? fmtFrac(currentQuestion.answer) : currentQuestion.answer;
      fb.textContent = `${randomFrom(WRONG_MESSAGES)} The answer is ${correctDisplay}.`;
    }
    fb.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
    if (isCorrect) playCorrect(); else playWrong();

    container.querySelector('#sc-correct').textContent = state.correct;
    container.querySelector('#sc-wrong').textContent = state.wrong;

    feedbackTimeout = setTimeout(nextQuestion, useVoice ? (isCorrect ? 300 : 1500) : 1100);
  }

  container.querySelector('#submit-btn').addEventListener('click', () => {
    const v = container.querySelector('#ans-input').value.trim();
    if (v === '') return;
    handleAnswer(v);
  });

  document.addEventListener('keydown', onKey);

  nextQuestion();
}
