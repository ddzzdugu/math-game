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

      <div class="question-box" id="question-box">
        <div class="question-text" id="q-text"></div>
        <div class="feedback" id="feedback"></div>

        <div id="type-input" class="answer-row" style="${useVoice ? 'display:none' : ''}">
          <input class="answer-input" type="number" id="ans-input" placeholder="?" autocomplete="off" />
          <button class="submit-btn" id="submit-btn">Go!</button>
        </div>

        <div id="voice-input" class="voice-row" style="${useVoice ? '' : 'display:none'}">
          <button class="mic-btn" id="mic-btn">🎤</button>
          <div class="voice-hint" id="voice-hint">Tap to speak your answer</div>
        </div>
      </div>
    </div>
  `;

  let currentQuestion = null;
  let questionStartTime = null;
  let locked = false;
  let gameActive = true;
  let feedbackTimeout = null;
  const inputMode = useVoice ? 'voice' : 'type';
  let recognition = null;
  let recognizing = false;

  if (isTimedSession) {
    const disp = container.querySelector('#timer-display');
    disp.style.display = 'block';
    const sessionTimer = new Timer(
      state.timerSecs,
      (t) => {
        disp.textContent = `⏱ ${t}s`;
        disp.className = t <= 10 ? 'timer-display urgent' : 'timer-display';
        container.querySelector('#progress-fill').style.width =
          `${((state.timerSecs - t) / state.timerSecs) * 100}%`;
        if (t <= 10) playTick();
      },
      () => {
        gameActive = false;
        clearTimeout(feedbackTimeout);
        playFinish();
        navigate('end', { state });
      }
    );
    sessionTimer.start();
  }

  function stopRecognition() {
    if (recognition && recognizing) { recognition.abort(); recognizing = false; }
    const micBtn = container.querySelector('#mic-btn');
    if (micBtn) { micBtn.classList.remove('listening'); micBtn.textContent = '🎤'; }
    const hint = container.querySelector('#voice-hint');
    if (hint) hint.textContent = 'Tap to speak your answer';
  }

  function startRecognition() {
    if (!SpeechRecognition || locked || !gameActive) return;
    stopRecognition();

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    const micBtn = container.querySelector('#mic-btn');
    const hint = container.querySelector('#voice-hint');

    recognition.onstart = () => {
      recognizing = true;
      micBtn.classList.add('listening');
      micBtn.textContent = '⏹';
      hint.textContent = 'Listening…';
    };

    recognition.onresult = (e) => {
      recognizing = false;
      micBtn.classList.remove('listening');
      micBtn.textContent = '🎤';
      // Try each alternative until we parse a valid number
      for (let i = 0; i < e.results[0].length; i++) {
        const parsed = parseSpoken(e.results[0][i].transcript);
        if (!isNaN(parsed)) { handleAnswer(parsed); return; }
      }
      hint.textContent = "Didn't catch that — try again";
    };

    recognition.onerror = (e) => {
      recognizing = false;
      micBtn.classList.remove('listening');
      micBtn.textContent = '🎤';
      hint.textContent = e.error === 'not-allowed' ? 'Mic blocked — check permissions' : 'Try again';
    };

    recognition.onend = () => {
      recognizing = false;
      if (micBtn.classList.contains('listening')) {
        micBtn.classList.remove('listening');
        micBtn.textContent = '🎤';
      }
    };

    recognition.start();
  }

  function nextQuestion() {
    if (!gameActive) return;
    if (!isTimedSession && state.isFinished) { playFinish(); navigate('end', { state }); return; }

    locked = false;
    stopRecognition();
    questionStartTime = Date.now();
    currentQuestion = generateQuestion(state.ops, state.range, getOpWeights(state.ops));

    container.querySelector('#q-text').textContent = `${currentQuestion.text} = ?`;
    container.querySelector('#ans-input').value = '';
    if (inputMode === 'type') container.querySelector('#ans-input').focus();
    container.querySelector('#feedback').textContent = '';
    container.querySelector('#feedback').className = 'feedback';

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

    const userAnswer = parseInt(rawVal, 10);
    const isCorrect = userAnswer === currentQuestion.answer;
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);

    state.recordAnswer({ question: currentQuestion.text, userAnswer, isCorrect, timeTaken });
    updateOpStats(currentQuestion.op, isCorrect);

    // Animate question box
    const qbox = container.querySelector('#question-box');
    qbox.classList.remove('correct-bounce', 'wrong-shake');
    void qbox.offsetWidth; // force reflow to restart animation
    qbox.classList.add(isCorrect ? 'correct-bounce' : 'wrong-shake');

    const fb = container.querySelector('#feedback');
    fb.textContent = isCorrect ? randomFrom(CORRECT_MESSAGES) : randomFrom(WRONG_MESSAGES);
    fb.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;
    if (isCorrect) playCorrect(); else playWrong();

    container.querySelector('#sc-correct').textContent = state.correct;
    container.querySelector('#sc-wrong').textContent = state.wrong;

    feedbackTimeout = setTimeout(nextQuestion, 1100);
  }

  container.querySelector('#submit-btn').addEventListener('click', () => {
    const v = container.querySelector('#ans-input').value.trim();
    if (v === '') return;
    handleAnswer(v);
  });

  container.querySelector('#mic-btn')?.addEventListener('click', () => {
    if (recognizing) stopRecognition();
    else startRecognition();
  });

  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Enter') {
      if (!gameActive) { document.removeEventListener('keydown', onKey); return; }
      if (inputMode === 'type') container.querySelector('#submit-btn').click();
      else startRecognition();
    }
  });

  nextQuestion();
}
