import { availableOps } from '../operations/generator.js';
import { unlockTTS } from '../utils/tts.js';
import { OP_LABELS } from '../utils/messages.js';

const voiceSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

/**
 * Renders the game setup / configuration screen.
 */
export function renderSetup(container, navigate) {
  const RANGES = [
    { label: '0 – 9',   value: { min: 0, max: 10 } },
    { label: '0 – 19',  value: { min: 0, max: 20 } },
    { label: '0 – 99',  value: { min: 0, max: 100 } },
    { label: '0 – 999', value: { min: 0, max: 1000 } },
  ];

  let selectedOps = ['+'];
  let selectedRange = { min: 0, max: 10 };
  let timerSecs = 60;
  let inputMode = 'type';

  container.innerHTML = `
    <div class="screen setup-screen">
      <h1 class="game-title">Math Adventure</h1>
      <p class="game-subtitle">Choose what to practice</p>

      <div class="section">
        <div class="section-label">Operations</div>
        <div class="btn-group" id="ops-group">
          ${availableOps().map(op => `
            <button class="toggle-btn ${op === '+' ? 'active' : ''}" data-op="${op}">
              ${OP_LABELS[op]}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-label">Number range</div>
        <div class="btn-group" id="range-group">
          ${RANGES.map((r, i) => `
            <button class="toggle-btn ${i === 0 ? 'active' : ''}" data-range-idx="${i}">
              ${r.label}
            </button>
          `).join('')}
          <button class="toggle-btn" id="range-custom-btn">Custom</button>
        </div>
        <div id="custom-range-row" class="custom-range-row" style="display:none">
          <input class="custom-range-input" id="custom-min-input" type="number" min="0" max="9998" placeholder="0" />
          <span class="custom-range-label">–</span>
          <input class="custom-range-input" id="custom-max-input" type="number" min="1" max="9999" placeholder="50" />
        </div>
      </div>

      <div class="section">
        <div class="section-label">Timer</div>
        <div class="timer-row">
          <input type="range" min="0" max="180" step="10" value="60" id="timer-val" />
          <span id="timer-val-out">60s</span>
        </div>
      </div>

      ${voiceSupported ? `
      <div class="section">
        <div class="section-label">Answer with</div>
        <div class="btn-group">
          <button class="toggle-btn active" id="mode-type">⌨️ Typing</button>
          <button class="toggle-btn" id="mode-voice">🎤 Voice</button>
        </div>
      </div>` : ''}

      <button class="primary-btn" id="start-btn">Start playing! 🚀</button>
    </div>
  `;

  // Operation toggles
  container.querySelectorAll('[data-op]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      selectedOps = [...container.querySelectorAll('[data-op].active')].map(b => b.dataset.op);
      if (!selectedOps.length) { btn.classList.add('active'); selectedOps = [btn.dataset.op]; }
    });
  });

  const customRangeRow = container.querySelector('#custom-range-row');
  const customMinInput = container.querySelector('#custom-min-input');
  const customMaxInput = container.querySelector('#custom-max-input');

  function clearRangeActive() {
    container.querySelectorAll('[data-range-idx], #range-custom-btn').forEach(b => b.classList.remove('active'));
  }

  function readCustomRange() {
    const min = customMinInput.value !== '' ? Math.max(0, +customMinInput.value) : 0;
    const max = customMaxInput.value !== '' ? +customMaxInput.value : null;
    if (max !== null && max > min) selectedRange = { min, max: max + 1 }; // +1 so max is inclusive
  }

  // Range toggles (single select)
  container.querySelectorAll('[data-range-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      clearRangeActive();
      btn.classList.add('active');
      customRangeRow.style.display = 'none';
      selectedRange = RANGES[+btn.dataset.rangeIdx].value;
    });
  });

  container.querySelector('#range-custom-btn').addEventListener('click', () => {
    clearRangeActive();
    container.querySelector('#range-custom-btn').classList.add('active');
    customRangeRow.style.display = 'flex';
    customMinInput.focus();
    readCustomRange();
  });

  customMinInput.addEventListener('input', readCustomRange);
  customMaxInput.addEventListener('input', readCustomRange);

  const timerValInput = container.querySelector('#timer-val');
  const timerValOut = container.querySelector('#timer-val-out');
  timerValInput.addEventListener('input', () => {
    timerSecs = +timerValInput.value;
    timerValOut.textContent = timerSecs === 0 ? 'Off' : `${timerSecs}s`;
  });

  if (voiceSupported) {
    container.querySelector('#mode-type').addEventListener('click', () => {
      inputMode = 'type';
      container.querySelector('#mode-type').classList.add('active');
      container.querySelector('#mode-voice').classList.remove('active');
    });
    container.querySelector('#mode-voice').addEventListener('click', () => {
      inputMode = 'voice';
      container.querySelector('#mode-voice').classList.add('active');
      container.querySelector('#mode-type').classList.remove('active');
    });
  }

  // Start
  container.querySelector('#start-btn').addEventListener('click', () => {
    unlockTTS();
    navigate('game', {
      ops: selectedOps,
      range: selectedRange,
      timerSecs: timerSecs === 0 ? null : timerSecs,
      inputMode,
    });
  });
}
