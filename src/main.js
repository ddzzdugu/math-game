import { renderHome } from './ui/home.js';
import { renderSetup } from './ui/setup.js';
import { renderGame } from './ui/game.js';
import { renderEnd } from './ui/end.js';
import { renderFractionSetup } from './ui/fraction-setup.js';
import { renderFractionGame } from './ui/fraction-game.js';
import { renderLogicSetup } from './ui/logic-setup.js';
import { renderLogicGame } from './ui/logic-game.js';
import { GameState } from './utils/state.js';

const app = document.getElementById('app');

export function navigate(screen, data = {}) {
  app.innerHTML = '';
  if (screen === 'home')           renderHome(app, navigate);
  if (screen === 'setup')          renderSetup(app, navigate);
  if (screen === 'game')           renderGame(app, navigate, new GameState(data));
  if (screen === 'fraction-setup') renderFractionSetup(app, navigate);
  if (screen === 'fraction-game')  renderFractionGame(app, navigate, data.mode, data.timerSecs ?? null);
  if (screen === 'logic-setup')    renderLogicSetup(app, navigate);
  if (screen === 'logic-game')     renderLogicGame(app, navigate, data.mode, data.timerSecs ?? null);
  if (screen === 'end')            renderEnd(app, navigate, data);
}

// Boot into home screen
navigate('home');
