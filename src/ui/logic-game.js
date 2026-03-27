import { GameState } from '../utils/state.js';
import { CORRECT_MESSAGES, WRONG_MESSAGES, randomFrom } from '../utils/messages.js';
import { playCorrect, playWrong, playFinish, playTick } from '../utils/sound.js';
import { updateOpStats } from '../utils/storage.js';
import { Timer } from '../utils/timer.js';

const TOTAL_QUESTIONS = 10;

function rand(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
function pick(arr) { return arr[rand(0, arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ── Sequence generators ───────────────────────────────────────────────────────

function makeChoices(answer, wrongCandidates) {
  const wrong = [];
  for (const c of shuffle(wrongCandidates)) {
    if (c !== answer && c > 0 && !wrong.includes(c)) wrong.push(c);
    if (wrong.length >= 3) break;
  }
  // Guaranteed fallback
  let fill = answer + 7;
  while (wrong.length < 3) { if (fill !== answer && !wrong.includes(fill)) wrong.push(fill); fill++; }
  return shuffle([answer, ...wrong.slice(0, 3)]);
}

function genArithSeq() {
  const step  = rand(2, 11);
  const start = rand(1, 21);
  const terms = Array.from({ length: 4 }, (_, i) => start + i * step);
  const answer = start + 4 * step;
  const wrong  = [answer + step, answer - step, answer + step - 1, answer + step + 1,
                  start + 4 * (step + 1), start + 4 * (step - 1)];
  return { terms, answer, wrong };
}

function genDecSeq() {
  const step  = rand(2, 8);
  const start = rand(step * 6, step * 12);
  const terms = Array.from({ length: 4 }, (_, i) => start - i * step);
  const answer = start - 4 * step;
  if (answer < 0) return genArithSeq();
  const wrong = [answer - step, answer + step, answer - 1, answer + 1,
                 terms[3], answer - step + 1];
  return { terms, answer, wrong };
}

function genDoubleSeq() {
  const start = rand(1, 6);
  const terms = [start, start * 2, start * 4, start * 8];
  const answer = start * 16;
  if (answer > 300) return genArithSeq();
  const wrong = [answer + start * 8, answer - start * 8, answer * 2, answer + start * 4];
  return { terms, answer, wrong };
}

function genSequence() {
  const gen = pick([genArithSeq, genArithSeq, genDecSeq, genDoubleSeq]);
  const { terms, answer, wrong } = gen();
  const choices = makeChoices(answer, wrong);
  return {
    stmt: `${terms.join(', ')}, ___`,
    choices,
    correctKey: String(answer),
    correctDisplay: String(answer),
  };
}

// ── True / False generators ───────────────────────────────────────────────────

function genTrueFalse() {
  const gens = [
    // Multiplication — correct
    () => { const a = rand(2, 13), b = rand(2, 13); return { stmt: `${a} × ${b} = ${a * b}`, answer: true }; },
    // Multiplication — wrong
    () => {
      const a = rand(2, 13), b = rand(2, 13);
      const off = rand(1, 6) * (Math.random() < 0.5 ? 1 : -1);
      const w = a * b + off;
      return w > 0 ? { stmt: `${a} × ${b} = ${w}`, answer: false } : null;
    },
    // Addition — correct
    () => { const a = rand(10, 51), b = rand(10, 51); return { stmt: `${a} + ${b} = ${a + b}`, answer: true }; },
    // Addition — wrong
    () => {
      const a = rand(10, 51), b = rand(10, 51);
      const off = rand(1, 11) * (Math.random() < 0.5 ? 1 : -1);
      return { stmt: `${a} + ${b} = ${a + b + off}`, answer: false };
    },
    // Even / odd
    () => {
      const n = rand(2, 51);
      const claim = Math.random() < 0.5 ? 'even' : 'odd';
      return { stmt: `${n} is ${claim}`, answer: (n % 2 === 0) === (claim === 'even') };
    },
    // Divisibility
    () => {
      const div = pick([2, 3, 4, 5, 6, 9, 10]);
      const base = rand(2, 11) * div;
      const off = Math.random() < 0.5 ? 0 : rand(1, div);
      const n = base + off;
      return { stmt: `${n} is divisible by ${div}`, answer: n % div === 0 };
    },
    // Greater / less than
    () => {
      const a = rand(2, 100), b = rand(2, 100);
      if (a === b) return null;
      const op = pick(['>', '<']);
      return { stmt: `${a} ${op} ${b}`, answer: op === '>' ? a > b : a < b };
    },
  ];

  let q = null;
  while (!q) q = pick(gens)();
  const correctKey = q.answer ? 'true' : 'false';
  return { stmt: q.stmt, correctKey, correctDisplay: q.answer ? 'True' : 'False' };
}

// ── Odd One Out generators ────────────────────────────────────────────────────

function genOddOneOut() {
  const gens = [
    // All even, one odd intruder
    () => {
      const evens = shuffle([2,4,6,8,10,12,14,16,18,20,22,24,26,28,30]).slice(0, 4);
      const odd   = pick([1,3,5,7,9,11,13,15,17,19,21,23,25,27]);
      return { stmt: 'Which is NOT even?', choices: shuffle([...evens, odd]), answer: odd };
    },
    // All odd, one even intruder
    () => {
      const odds = shuffle([1,3,5,7,9,11,13,15,17,19,21,23,25,27]).slice(0, 4);
      const even = pick([2,4,6,8,10,12,14,16,18,20,22,24,26,28]);
      return { stmt: 'Which is NOT odd?', choices: shuffle([...odds, even]), answer: even };
    },
    // Multiples of m, one intruder
    () => {
      const m     = pick([2, 3, 4, 5, 6, 10]);
      const pool  = Array.from({ length: 15 }, (_, i) => (i + 1) * m);
      const group = shuffle(pool).slice(0, 4);
      let intruder;
      do { intruder = rand(2, m * 12 + 1); }
      while (intruder % m === 0 || group.includes(intruder));
      return { stmt: `Which is NOT a multiple of ${m}?`, choices: shuffle([...group, intruder]), answer: intruder };
    },
  ];

  const { stmt, choices, answer } = pick(gens)();
  return { stmt, choices, correctKey: String(answer), correctDisplay: String(answer) };
}

// ── Render ────────────────────────────────────────────────────────────────────

const MODE_LABEL = { sequences: 'Sequences', 'true-false': 'True or False', 'odd-one-out': 'Odd One Out' };

export function renderLogicGame(container, navigate, mode, timerSecs = null) {
  const isTimed = !!timerSecs;
  const state = new GameState({ ops: ['logic'], range: { min: 0, max: 100 }, timerSecs });
  if (!isTimed) state.totalQuestions = TOTAL_QUESTIONS;

  container.innerHTML = `
    <div class="screen game-screen">
      <div class="scorebar">
        <div class="score-card"><div class="sc-label">Correct</div><div class="sc-val" id="sc-correct">0</div></div>
        <div class="score-card"><div class="sc-label">Wrong</div><div class="sc-val" id="sc-wrong">0</div></div>
        <div class="score-card"><div class="sc-label">${isTimed ? 'Done' : 'Question'}</div><div class="sc-val" id="sc-q">${isTimed ? '0' : `1 / ${TOTAL_QUESTIONS}`}</div></div>
      </div>
      <div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>
      <div class="timer-display" id="timer-display" style="display:none"></div>
      <button class="stop-btn" id="stop-btn">Stop</button>
      <div class="question-box logic-question-box" id="question-box">
        <div class="frac-mode-badge">${MODE_LABEL[mode]}</div>
        <div id="logic-question"></div>
        <div class="feedback" id="feedback"></div>
        <div id="logic-choices"></div>
      </div>
    </div>
  `;

  let currentQuestion = null;
  let locked = false;
  let gameActive = true;
  let feedbackTimeout = null;
  let questionStartTime = null;
  let sessionTimer = null;

  if (isTimed) {
    const disp = container.querySelector('#timer-display');
    disp.style.display = 'block';
    sessionTimer = new Timer(
      timerSecs,
      (t) => {
        disp.textContent = `⏱ ${t}s`;
        disp.className = t <= 10 ? 'timer-display urgent' : 'timer-display';
        container.querySelector('#progress-fill').style.width = `${((timerSecs - t) / timerSecs) * 100}%`;
        if (t <= 10) playTick();
      },
      () => endGame()
    );
    sessionTimer.start();
  }

  function endGame() {
    gameActive = false;
    clearTimeout(feedbackTimeout);
    if (sessionTimer) sessionTimer.stop();
    playFinish();
    navigate('end', {
      state,
      onPlayAgain: () => navigate('logic-game', { mode, timerSecs }),
      onChangeSettings: () => navigate('logic-setup'),
    });
  }

  container.querySelector('#stop-btn').addEventListener('click', () => {
    gameActive = false;
    clearTimeout(feedbackTimeout);
    if (sessionTimer) sessionTimer.stop();
    navigate('logic-setup');
  });

  function nextQuestion() {
    if (!gameActive) return;
    if (!isTimed && state.isFinished) { endGame(); return; }

    locked = false;
    questionStartTime = Date.now();

    if (mode === 'sequences')     currentQuestion = genSequence();
    else if (mode === 'true-false') currentQuestion = genTrueFalse();
    else                           currentQuestion = genOddOneOut();

    const qbox = container.querySelector('#question-box');
    qbox.classList.remove('correct-bounce', 'wrong-shake');
    container.querySelector('#feedback').textContent = '';
    container.querySelector('#feedback').className = 'feedback';

    const qEl      = container.querySelector('#logic-question');
    const choicesEl = container.querySelector('#logic-choices');

    if (mode === 'sequences') {
      qEl.innerHTML = `<div class="logic-seq-q">${currentQuestion.stmt}</div>`;
      choicesEl.innerHTML = `
        <div class="simplify-choices">
          ${currentQuestion.choices.map(c => `
            <button class="choice-btn choice-btn--simp" data-choice="${c}">${c}</button>
          `).join('')}
        </div>`;

    } else if (mode === 'true-false') {
      qEl.innerHTML = `<div class="logic-tf-q">${currentQuestion.stmt}</div>`;
      choicesEl.innerHTML = `
        <div class="tf-choices">
          <button class="choice-btn choice-btn--tf" data-choice="true">True</button>
          <button class="choice-btn choice-btn--tf" data-choice="false">False</button>
        </div>`;

    } else {
      qEl.innerHTML = `<div class="logic-ooo-q">${currentQuestion.stmt}</div>`;
      choicesEl.innerHTML = `
        <div class="ooo-choices">
          ${currentQuestion.choices.map(c => `
            <button class="choice-btn choice-btn--ooo" data-choice="${c}">${c}</button>
          `).join('')}
        </div>`;
    }

    choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn.dataset.choice, btn));
    });

    if (isTimed) {
      container.querySelector('#sc-q').textContent = state.currentQ;
    } else {
      container.querySelector('#sc-q').textContent = `${state.currentQ + 1} / ${TOTAL_QUESTIONS}`;
      container.querySelector('#progress-fill').style.width = `${(state.currentQ / TOTAL_QUESTIONS) * 100}%`;
    }
  }

  function handleAnswer(choice, btn) {
    if (locked || !gameActive) return;
    locked = true;

    const isCorrect = choice === currentQuestion.correctKey;
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);

    state.recordAnswer({ question: currentQuestion.stmt, userAnswer: choice, isCorrect, timeTaken });
    updateOpStats('logic', isCorrect);

    btn.classList.add(isCorrect ? 'choice-correct' : 'choice-wrong');
    if (!isCorrect) {
      container.querySelectorAll('.choice-btn').forEach(b => {
        if (b.dataset.choice === currentQuestion.correctKey) b.classList.add('choice-correct');
      });
    }

    const qbox = container.querySelector('#question-box');
    qbox.classList.remove('correct-bounce', 'wrong-shake');
    void qbox.offsetWidth;
    qbox.classList.add(isCorrect ? 'correct-bounce' : 'wrong-shake');

    const fb = container.querySelector('#feedback');
    fb.textContent = isCorrect
      ? randomFrom(CORRECT_MESSAGES)
      : `${randomFrom(WRONG_MESSAGES)} The answer is ${currentQuestion.correctDisplay}.`;
    fb.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;

    if (isCorrect) playCorrect(); else playWrong();
    container.querySelector('#sc-correct').textContent = state.correct;
    container.querySelector('#sc-wrong').textContent = state.wrong;

    feedbackTimeout = setTimeout(nextQuestion, isCorrect ? 700 : 1600);
  }

  nextQuestion();
}
