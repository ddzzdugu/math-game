import { generateQuestion } from '../operations/generator.js';
import { Timer } from '../utils/timer.js';
import { CORRECT_MESSAGES, WRONG_MESSAGES, TIMEOUT_MESSAGE, randomFrom } from '../utils/messages.js';

const TOTAL_QUESTIONS = 10;

export function renderGame(container, navigate, state) {
  state.totalQuestions = TOTAL_QUESTIONS;

  container.innerHTML = `
    <div class="screen game-screen">
      <div class="scorebar">
        <div class="score-card"><div class="sc-label">Correct</div><div class="sc-val" id="sc-correct">0</div></div>
        <div class="score-card"><div class="sc-label">Wrong</div><div class="sc-val" id="sc-wrong">0</div></div>
        <div class="score-card"><div class="sc-label">Question</div><div class="sc-val" id="sc-q">1 / ${TOTAL_QUESTIONS}</div></div>
      </div>

      <div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>

      <div class="timer-display" id="timer-display" style="display:none"></div>

      <div class="question-box">
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
  let timer = null;
  let questionStartTime = null;
  let locked = false;

  function nextQuestion() {
    if (state.isFinished) { navigate('end', { state }); return; }

    locked = false;
    currentQuestion = generateQuestion(state.ops, state.range);
    questionStartTime = Date.now();

    container.querySelector('#q-text').textContent = `${currentQuestion.text} = ?`;
    container.querySelector('#ans-input').value = '';
    container.querySelector('#ans-input').focus();
    container.querySelector('#feedback').textContent = '';
    container.querySelector('#feedback').className = 'feedback';
    container.querySelector('#sc-q').textContent = `${state.currentQ + 1} / ${TOTAL_QUESTIONS}`;
    container.querySelector('#progress-fill').style.width = `${(state.currentQ / TOTAL_QUESTIONS) * 100}%`;

    if (state.timerSecs) {
      if (timer) timer.stop();
      const disp = container.querySelector('#timer-display');
      disp.style.display = 'block';
      timer = new Timer(
        state.timerSecs,
        (t) => {
          disp.textContent = `⏱ ${t}s`;
          disp.className = t <= 5 ? 'timer-display urgent' : 'timer-display';
        },
        () => handleAnswer(null)  // expired
      );
      timer.start();
    }
  }

  function handleAnswer(rawVal) {
    if (locked) return;
    locked = true;
    if (timer) timer.stop();

    const userAnswer = rawVal === null ? null : parseInt(rawVal, 10);
    const isCorrect = userAnswer !== null && userAnswer === currentQuestion.answer;
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);

    state.recordAnswer({ question: currentQuestion.text, userAnswer, isCorrect, timeTaken });

    const fb = container.querySelector('#feedback');
    if (rawVal === null) {
      fb.textContent = TIMEOUT_MESSAGE;
      fb.className = 'feedback wrong';
    } else if (isCorrect) {
      fb.textContent = randomFrom(CORRECT_MESSAGES);
      fb.className = 'feedback correct';
    } else {
      fb.textContent = randomFrom(WRONG_MESSAGES);
      fb.className = 'feedback wrong';
    }

    container.querySelector('#sc-correct').textContent = state.correct;
    container.querySelector('#sc-wrong').textContent = state.wrong;

    setTimeout(nextQuestion, 1100);
  }

  container.querySelector('#submit-btn').addEventListener('click', () => {
    const v = container.querySelector('#ans-input').value.trim();
    if (v === '') return;
    handleAnswer(v);
  });

  container.querySelector('#ans-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') container.querySelector('#submit-btn').click();
  });

  nextQuestion();
}
