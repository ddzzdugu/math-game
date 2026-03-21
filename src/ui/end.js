import { getTier } from '../utils/messages.js';
import { launchEffect } from './effects.js';
import { saveSession, getHistory } from '../utils/storage.js';

const OP_LABELS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function historyHTML(sessions) {
  if (!sessions.length) return '<p class="h-empty">No sessions yet in the past 30 days.</p>';

  const rows = sessions.slice(0, 15).map(s => {
    const barColor = s.accuracy >= 80 ? 'var(--teal-mid)' : s.accuracy >= 50 ? '#f59e0b' : 'var(--coral-mid)';
    const ops = s.ops.map(o => OP_LABELS[o] ?? o).join(' ');
    return `
      <div class="h-row">
        <span class="h-date">${formatDate(s.date)}</span>
        <span class="h-ops">${ops}</span>
        <div class="h-bar-wrap" title="${s.accuracy}% correct">
          <div class="h-bar" style="width:${s.accuracy}%;background:${barColor}"></div>
        </div>
        <span class="h-acc">${s.accuracy}%</span>
        <span class="h-speed">${s.avgSpeed}s/q</span>
      </div>`;
  }).join('');

  return `
    <div class="h-header">
      <span class="h-date">Date</span>
      <span class="h-ops">Ops</span>
      <div class="h-bar-wrap"></div>
      <span class="h-acc">Acc</span>
      <span class="h-speed">Speed</span>
    </div>
    ${rows}`;
}

export function renderEnd(container, navigate, { state }) {
  const tier = getTier(state.correct);
  const isTimedSession = !!state.timerSecs;

  const scoreDisplay = isTimedSession
    ? `${state.correct} correct in ${state.timerSecs}s`
    : `${state.correct} / ${state.totalQuestions} correct`;

  const subDisplay = isTimedSession
    ? `${state.currentQ} attempted · Accuracy: ${state.accuracy}%`
    : `Accuracy: ${state.accuracy}%`;

  saveSession({
    correct:  state.correct,
    total:    state.currentQ,
    accuracy: state.accuracy,
    avgSpeed: state.avgSpeed,
    ops:      state.ops,
    timerSecs: state.timerSecs,
  });

  const sessions = getHistory();

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

      <div class="history-section">
        <div class="history-title">Past 30 days</div>
        ${historyHTML(sessions)}
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
