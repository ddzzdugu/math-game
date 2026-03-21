import { generateQuestion } from '../operations/generator.js';
import { Timer } from '../utils/timer.js';
import { CORRECT_MESSAGES, WRONG_MESSAGES, randomFrom } from '../utils/messages.js';
import { playCorrect, playWrong, playFinish, playTick } from '../utils/sound.js';
import { getOpWeights, updateOpStats } from '../utils/storage.js';

const TOTAL_QUESTIONS = 10;

export function renderGame(container, navigate, state) {
  const isTimedSession = !!state.timerSecs;
  if (!isTimedSession) state.totalQuestions = TOTAL_QUESTIONS;

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
        <div class="answer-row">
          <input class="answer-input" type="number" id="ans-input" placeholder="?" autocomplete="off" />
          <button class="submit-btn" id="submit-btn">Go!</button>
        </div>
      </div>
    </div>
  `;

  let currentQuestion = null;
  let questionStartTime = null;
  let locked = false;
  let gameActive = true;
  let feedbackTimeout = null;

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

  function nextQuestion() {
    if (!gameActive) return;
    if (!isTimedSession && state.isFinished) { playFinish(); navigate('end', { state }); return; }

    locked = false;
    questionStartTime = Date.now();
    currentQuestion = generateQuestion(state.ops, state.range, getOpWeights(state.ops));

    container.querySelector('#q-text').textContent = `${currentQuestion.text} = ?`;
    container.querySelector('#ans-input').value = '';
    container.querySelector('#ans-input').focus();
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

  document.addEventListener('keydown', function onKey(e) {
    if (e.key === 'Enter') {
      if (!gameActive) { document.removeEventListener('keydown', onKey); return; }
      container.querySelector('#submit-btn').click();
    }
  });

  nextQuestion();
}
