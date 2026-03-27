export function renderLogicSetup(container, navigate) {
  let timerSecs = 60;

  container.innerHTML = `
    <div class="screen frac-setup-screen">
      <button class="back-btn" id="back-btn">‹ Back</button>

      <div class="frac-setup-header">
        <div class="frac-setup-icon">🧩</div>
        <h2 class="frac-setup-title">Logic</h2>
        <p class="frac-setup-sub">Choose what to practice</p>
      </div>

      <div class="section">
        <div class="section-label">Timer</div>
        <div class="timer-row">
          <input type="range" min="0" max="180" step="10" value="60" id="timer-val" />
          <span id="timer-val-out">60s</span>
        </div>
      </div>

      <div class="frac-mode-cards">
        <button class="frac-mode-card" id="btn-sequences">
          <div class="fmcard-icon">🔢</div>
          <div class="fmcard-body">
            <div class="fmcard-title">Sequences</div>
            <div class="fmcard-desc">Find the next number in the pattern</div>
          </div>
          <div class="hcard-chevron">›</div>
        </button>

        <button class="frac-mode-card" id="btn-true-false">
          <div class="fmcard-icon">✓ ✗</div>
          <div class="fmcard-body">
            <div class="fmcard-title">True or False</div>
            <div class="fmcard-desc">Is the math statement correct?</div>
          </div>
          <div class="hcard-chevron">›</div>
        </button>

        <button class="frac-mode-card" id="btn-odd-one-out">
          <div class="fmcard-icon">🔍</div>
          <div class="fmcard-body">
            <div class="fmcard-title">Odd One Out</div>
            <div class="fmcard-desc">Which number doesn't belong?</div>
          </div>
          <div class="hcard-chevron">›</div>
        </button>
      </div>
    </div>
  `;

  const timerInput = container.querySelector('#timer-val');
  const timerOut   = container.querySelector('#timer-val-out');
  timerInput.addEventListener('input', () => {
    timerSecs = +timerInput.value;
    timerOut.textContent = timerSecs === 0 ? 'Off' : `${timerSecs}s`;
  });

  const go = (mode) => navigate('logic-game', { mode, timerSecs: timerSecs === 0 ? null : timerSecs });
  container.querySelector('#back-btn').addEventListener('click', () => navigate('home'));
  container.querySelector('#btn-sequences').addEventListener('click',  () => go('sequences'));
  container.querySelector('#btn-true-false').addEventListener('click', () => go('true-false'));
  container.querySelector('#btn-odd-one-out').addEventListener('click',() => go('odd-one-out'));
}
