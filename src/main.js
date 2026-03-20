import { renderSetup } from './ui/setup.js';
import { renderGame } from './ui/game.js';
import { renderEnd } from './ui/end.js';
import { GameState } from './utils/state.js';

const app = document.getElementById('app');

export function navigate(screen, data = {}) {
  app.innerHTML = '';
  if (screen === 'setup') renderSetup(app, navigate);
  if (screen === 'game')  renderGame(app, navigate, new GameState(data));
  if (screen === 'end')   renderEnd(app, navigate, data);
}

// Boot into setup screen
navigate('setup');
