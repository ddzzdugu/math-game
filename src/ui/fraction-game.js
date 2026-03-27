import { GameState } from '../utils/state.js';
import { CORRECT_MESSAGES, WRONG_MESSAGES, randomFrom } from '../utils/messages.js';
import { playCorrect, playWrong, playFinish } from '../utils/sound.js';
import { updateOpStats } from '../utils/storage.js';

const TOTAL_QUESTIONS = 10;
const DENOMS = [2, 3, 4, 5, 6, 8, 10, 12];

// Pool of simplified fractions used as distractors
const FRAC_POOL = [
  {n:1,d:2},{n:1,d:3},{n:2,d:3},{n:1,d:4},{n:3,d:4},
  {n:1,d:5},{n:2,d:5},{n:3,d:5},{n:4,d:5},
  {n:1,d:6},{n:5,d:6},{n:1,d:8},{n:3,d:8},{n:5,d:8},{n:7,d:8},
  {n:1,d:10},{n:3,d:10},{n:7,d:10},{n:9,d:10},
  {n:1,d:12},{n:5,d:12},{n:7,d:12},{n:11,d:12},
];

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function simplify(n, d) { const g = gcd(n, d); return { n: n / g, d: d / g }; }
function fmt(f) { return f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`; }
function fracEq(a, b) { return a.n === b.n && a.d === b.d; }
function rand(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
function pickDenom() { return DENOMS[rand(0, DENOMS.length)]; }

function fracHTML(n, d) {
  if (d === 1) return `<span class="frac-whole">${n}</span>`;
  return `<span class="frac-v"><span class="fv-n">${n}</span><span class="fv-d">${d}</span></span>`;
}

function genCompare() {
  const d1 = pickDenom(), d2 = pickDenom();
  const n1 = rand(1, d1), n2 = rand(1, d2);
  const answer = n1 * d2 < n2 * d1 ? '<' : n1 * d2 > n2 * d1 ? '>' : '=';
  return { frac1: {n: n1, d: d1}, frac2: {n: n2, d: d2}, answer };
}

function genSimplify() {
  const dBase = pickDenom();
  const nBase = rand(1, dBase);      // [1, dBase-1] → always a proper fraction
  const factor = rand(2, 5);         // multiply both by 2–4
  const answer = simplify(nBase, dBase);
  const wrong = [...FRAC_POOL]
    .filter(f => !fracEq(f, answer))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const choices = [answer, ...wrong].sort(() => Math.random() - 0.5);
  return { bigN: nBase * factor, bigD: dBase * factor, choices, answer };
}

export function renderFractionGame(container, navigate, mode) {
  const state = new GameState({ ops: ['frac'], range: { min: 0, max: 12 } });
  state.totalQuestions = TOTAL_QUESTIONS;
  state.fracMode = mode;

  const modeLabel = mode === 'compare' ? 'Compare' : 'Simplify';

  container.innerHTML = `
    <div class="screen game-screen">
      <div class="scorebar">
        <div class="score-card"><div class="sc-label">Correct</div><div class="sc-val" id="sc-correct">0</div></div>
        <div class="score-card"><div class="sc-label">Wrong</div><div class="sc-val" id="sc-wrong">0</div></div>
        <div class="score-card"><div class="sc-label">Question</div><div class="sc-val" id="sc-q">1 / ${TOTAL_QUESTIONS}</div></div>
      </div>
      <div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>
      <button class="stop-btn" id="stop-btn">Stop</button>
      <div class="question-box frac-question-box" id="question-box">
        <div class="frac-mode-badge">${modeLabel}</div>
        <div id="frac-question"></div>
        <div class="feedback" id="feedback"></div>
        <div id="frac-choices"></div>
      </div>
    </div>
  `;

  let currentQuestion = null;
  let locked = false;
  let gameActive = true;
  let feedbackTimeout = null;
  let questionStartTime = null;

  function endGame() {
    gameActive = false;
    clearTimeout(feedbackTimeout);
    playFinish();
    navigate('end', {
      state,
      onPlayAgain: () => navigate('fraction-game', { mode }),
      onChangeSettings: () => navigate('fraction-setup'),
    });
  }

  container.querySelector('#stop-btn').addEventListener('click', endGame);

  function nextQuestion() {
    if (!gameActive) return;
    if (state.isFinished) { endGame(); return; }

    locked = false;
    questionStartTime = Date.now();
    currentQuestion = mode === 'compare' ? genCompare() : genSimplify();

    const qbox = container.querySelector('#question-box');
    qbox.classList.remove('correct-bounce', 'wrong-shake');
    container.querySelector('#feedback').textContent = '';
    container.querySelector('#feedback').className = 'feedback';

    const qEl = container.querySelector('#frac-question');
    const choicesEl = container.querySelector('#frac-choices');

    if (mode === 'compare') {
      qEl.innerHTML = `
        <div class="compare-q">
          ${fracHTML(currentQuestion.frac1.n, currentQuestion.frac1.d)}
          <div class="compare-box">?</div>
          ${fracHTML(currentQuestion.frac2.n, currentQuestion.frac2.d)}
        </div>
      `;
      choicesEl.innerHTML = `
        <div class="compare-choices">
          ${['<', '=', '>'].map(s => `
            <button class="choice-btn choice-btn--cmp" data-choice="${s}">${s}</button>
          `).join('')}
        </div>
      `;
    } else {
      qEl.innerHTML = `
        <div class="simplify-q">
          <div class="simplify-frac">${fracHTML(currentQuestion.bigN, currentQuestion.bigD)}</div>
        </div>
      `;
      choicesEl.innerHTML = `
        <div class="simplify-choices">
          ${currentQuestion.choices.map(f => `
            <button class="choice-btn choice-btn--simp" data-choice="${fmt(f)}">
              ${fracHTML(f.n, f.d)}
            </button>
          `).join('')}
        </div>
      `;
    }

    choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn.dataset.choice, btn));
    });

    container.querySelector('#sc-q').textContent = `${state.currentQ + 1} / ${TOTAL_QUESTIONS}`;
    container.querySelector('#progress-fill').style.width = `${(state.currentQ / TOTAL_QUESTIONS) * 100}%`;
  }

  function handleAnswer(choice, btn) {
    if (locked || !gameActive) return;
    locked = true;

    let isCorrect;
    if (mode === 'compare') {
      isCorrect = choice === currentQuestion.answer;
    } else {
      const parts = choice.split('/');
      const chosen = parts.length === 2
        ? simplify(parseInt(parts[0], 10), parseInt(parts[1], 10))
        : { n: parseInt(choice, 10), d: 1 };
      isCorrect = fracEq(chosen, currentQuestion.answer);
    }

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const questionText = mode === 'compare'
      ? `${fmt(currentQuestion.frac1)} ? ${fmt(currentQuestion.frac2)}`
      : `Simplify ${currentQuestion.bigN}/${currentQuestion.bigD}`;
    const correctDisplay = mode === 'compare' ? currentQuestion.answer : fmt(currentQuestion.answer);

    state.recordAnswer({ question: questionText, userAnswer: choice, isCorrect, timeTaken });
    updateOpStats('frac', isCorrect);

    // Mark buttons
    btn.classList.add(isCorrect ? 'choice-correct' : 'choice-wrong');
    if (!isCorrect) {
      const correctKey = mode === 'compare' ? currentQuestion.answer : fmt(currentQuestion.answer);
      container.querySelectorAll('.choice-btn').forEach(b => {
        if (b.dataset.choice === correctKey) b.classList.add('choice-correct');
      });
    }

    const qbox = container.querySelector('#question-box');
    qbox.classList.remove('correct-bounce', 'wrong-shake');
    void qbox.offsetWidth;
    qbox.classList.add(isCorrect ? 'correct-bounce' : 'wrong-shake');

    const fb = container.querySelector('#feedback');
    fb.textContent = isCorrect
      ? randomFrom(CORRECT_MESSAGES)
      : `${randomFrom(WRONG_MESSAGES)} The answer is ${correctDisplay}.`;
    fb.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;

    if (isCorrect) playCorrect(); else playWrong();
    container.querySelector('#sc-correct').textContent = state.correct;
    container.querySelector('#sc-wrong').textContent = state.wrong;

    feedbackTimeout = setTimeout(nextQuestion, isCorrect ? 700 : 1600);
  }

  nextQuestion();
}
