import { getTier } from '../utils/messages.js';
import { launchEffect } from './effects.js';

export function renderEnd(container, navigate, { state }) {
  const tier = getTier(state.correct);
  const isTimedSession = !!state.timerSecs;

  const scoreDisplay = isTimedSession
    ? `${state.correct} correct in ${state.timerSecs}s`
    : `${state.correct} / ${state.totalQuestions} correct`;

  const subDisplay = isTimedSession
    ? `${state.currentQ} attempted · Accuracy: ${state.accuracy}%`
    : `Accuracy: ${state.accuracy}%`;

  container.innerHTML = `
    <div class="screen end-screen">
      <div class="end-emoji">${tier.emoji}</div>
      <h2 class="end-title">${tier.title}</h2>
      <p class="end-sub">${tier.sub}</p>
      <div class="end-score">${scoreDisplay}</div>
      <p class="end-accuracy">${subDisplay}</p>
      <div class="end-actions">
        <button class="primary-btn" id="play-again">Play again</button>
        <button class="secondary-btn" id="change-settings">Change settings</button>
      </div>
    </div>
  `;

  const stopEffect = launchEffect();

  container.querySelector('#play-again').addEventListener('click', () => {
    stopEffect();
    navigate('game', { ops: state.ops, range: state.range, timerSecs: state.timerSecs });
  });

  container.querySelector('#change-settings').addEventListener('click', () => {
    stopEffect();
    navigate('setup');
  });
}
