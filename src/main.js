import { renderSetup } from './ui/setup.js';
import { renderGame } from './ui/game.js';
import { renderEnd } from './ui/end.js';
import { GameState } from './utils/state.js';

const app = document.getElementById('app');

export function navigate(screen, data = {}) {
  app.innerHTML = '';
  const state = new GameState(data);
  if (screen === 'setup') renderSetup(app, navigate);
  if (screen === 'game')  renderGame(app, navigate, state);
  if (screen === 'end')   renderEnd(app, navigate, state);
}

// Boot into setup screen
navigate('setup');
