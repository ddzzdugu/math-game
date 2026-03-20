import { availableOps } from '../operations/generator.js';

/**
 * Renders the game setup / configuration screen.
 */
export function renderSetup(container, navigate) {
  const OP_LABELS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const RANGES = [
    { label: '0 – 9',   value: 10 },
    { label: '0 – 19',  value: 20 },
    { label: '0 – 99',  value: 100 },
    { label: '0 – 999', value: 1000 },
  ];

  let selectedOps = ['+'];
  let selectedRange = 10;
  let timerOn = false;
  let timerSecs = 15;

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
            <button class="toggle-btn ${i === 0 ? 'active' : ''}" data-range="${r.value}">
              ${r.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-label">Timer</div>
        <div class="timer-row">
          <button class="pill-toggle" id="timer-toggle">Off</button>
          <div class="timer-slider" id="timer-slider" style="display:none">
            <input type="range" min="5" max="30" step="5" value="15" id="timer-val" />
            <span id="timer-val-out">15s per question</span>
          </div>
        </div>
      </div>

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

  // Range toggles (single select)
  container.querySelectorAll('[data-range]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-range]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRange = +btn.dataset.range;
    });
  });

  // Timer toggle
  const timerToggle = container.querySelector('#timer-toggle');
  const timerSlider = container.querySelector('#timer-slider');
  timerToggle.addEventListener('click', () => {
    timerOn = !timerOn;
    timerToggle.textContent = timerOn ? 'On' : 'Off';
    timerToggle.classList.toggle('active', timerOn);
    timerSlider.style.display = timerOn ? 'flex' : 'none';
  });

  const timerValInput = container.querySelector('#timer-val');
  const timerValOut = container.querySelector('#timer-val-out');
  timerValInput.addEventListener('input', () => {
    timerSecs = +timerValInput.value;
    timerValOut.textContent = `${timerSecs}s per question`;
  });

  // Start
  container.querySelector('#start-btn').addEventListener('click', () => {
    navigate('game', {
      ops: selectedOps,
      range: selectedRange,
      timerSecs: timerOn ? timerSecs : null,
    });
  });
}
