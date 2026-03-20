import { getTier } from '../utils/messages.js';

export function renderEnd(container, navigate, { state }) {
  const tier = getTier(state.correct);

  container.innerHTML = `
    <div class="screen end-screen">
      <div class="end-emoji">${tier.emoji}</div>
      <h2 class="end-title">${tier.title}</h2>
      <p class="end-sub">${tier.sub}</p>
      <div class="end-score">${state.correct} / ${state.totalQuestions} correct</div>
      <p class="end-accuracy">Accuracy: ${state.accuracy}%</p>
      <div class="end-actions">
        <button class="primary-btn" id="play-again">Play again</button>
        <button class="secondary-btn" id="change-settings">Change settings</button>
      </div>
    </div>
  `;

  container.querySelector('#play-again').addEventListener('click', () => {
    navigate('game', {
      ops: state.ops,
      range: state.range,
      timerSecs: state.timerSecs,
    });
  });

  container.querySelector('#change-settings').addEventListener('click', () => {
    navigate('setup');
  });
}
