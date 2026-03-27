export function renderFractionSetup(container, navigate) {
  let timerSecs = 60;

  container.innerHTML = `
    <div class="screen frac-setup-screen">
      <button class="back-btn" id="back-btn">‹ Back</button>

      <div class="frac-setup-header">
        <div class="frac-setup-icon">½</div>
        <h2 class="frac-setup-title">Fractions</h2>
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
        <button class="frac-mode-card" id="btn-compare">
          <div class="fmcard-icon">‹ = ›</div>
          <div class="fmcard-body">
            <div class="fmcard-title">Compare</div>
            <div class="fmcard-desc">Which fraction is bigger, smaller, or equal?</div>
          </div>
          <div class="hcard-chevron">›</div>
        </button>

        <button class="frac-mode-card" id="btn-simplify">
          <div class="fmcard-icon">⬜→½</div>
          <div class="fmcard-body">
            <div class="fmcard-title">Simplify</div>
            <div class="fmcard-desc">Reduce fractions to their simplest form</div>
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

  container.querySelector('#back-btn').addEventListener('click', () => navigate('home'));
  container.querySelector('#btn-compare').addEventListener('click', () =>
    navigate('fraction-game', { mode: 'compare', timerSecs: timerSecs === 0 ? null : timerSecs }));
  container.querySelector('#btn-simplify').addEventListener('click', () =>
    navigate('fraction-game', { mode: 'simplify', timerSecs: timerSecs === 0 ? null : timerSecs }));
}
