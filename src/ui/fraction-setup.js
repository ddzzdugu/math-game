export function renderFractionSetup(container, navigate) {
  container.innerHTML = `
    <div class="screen frac-setup-screen">
      <button class="back-btn" id="back-btn">‹ Back</button>

      <div class="frac-setup-header">
        <div class="frac-setup-icon">½</div>
        <h2 class="frac-setup-title">Fractions</h2>
        <p class="frac-setup-sub">Choose what to practice</p>
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

  container.querySelector('#back-btn').addEventListener('click', () => navigate('home'));
  container.querySelector('#btn-compare').addEventListener('click', () => navigate('fraction-game', { mode: 'compare' }));
  container.querySelector('#btn-simplify').addEventListener('click', () => navigate('fraction-game', { mode: 'simplify' }));
}
