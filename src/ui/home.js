export function renderHome(container, navigate) {
  container.innerHTML = `
    <div class="screen home-screen">
      <div class="home-header">
        <div class="home-logo">🎮</div>
        <h1 class="home-title">Math Adventure</h1>
        <p class="home-subtitle">What would you like to practice today?</p>
      </div>

      <div class="home-cards">
        <button class="home-card home-card--arith" id="btn-arith">
          <div class="hcard-icon">＋ − × ÷</div>
          <div class="hcard-body">
            <div class="hcard-title">Arithmetic</div>
            <div class="hcard-desc">Add, subtract, multiply &amp; divide</div>
          </div>
          <div class="hcard-chevron">›</div>
        </button>

        <button class="home-card home-card--frac" id="btn-frac">
          <div class="hcard-icon">½</div>
          <div class="hcard-body">
            <div class="hcard-title">Fractions</div>
            <div class="hcard-desc">Compare and simplify fractions</div>
          </div>
          <div class="hcard-chevron">›</div>
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btn-arith').addEventListener('click', () => navigate('setup'));
  container.querySelector('#btn-frac').addEventListener('click', () => navigate('fraction-setup'));
}
