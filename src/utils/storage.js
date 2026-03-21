const HISTORY_KEY  = 'mathgame_history';
const OP_STATS_KEY = 'mathgame_op_stats';
const THIRTY_DAYS  = 30 * 24 * 60 * 60 * 1000;

function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
}

function recentSessions() {
  const cutoff = Date.now() - THIRTY_DAYS;
  return load(HISTORY_KEY, []).filter(s => new Date(s.date).getTime() > cutoff);
}

/** Save a completed session; prune entries older than 30 days. */
export function saveSession({ correct, total, accuracy, avgSpeed, ops, timerSecs }) {
  const history = recentSessions();
  history.push({ date: new Date().toISOString(), correct, total, accuracy, avgSpeed, ops, timerSecs });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/** Return sessions from the past 30 days, newest first. */
export function getHistory() {
  return recentSessions().reverse();
}

/** Record whether an answer for a given op was correct. */
export function updateOpStats(op, isCorrect) {
  const stats = load(OP_STATS_KEY, {});
  if (!stats[op]) stats[op] = { correct: 0, wrong: 0 };
  if (isCorrect) stats[op].correct++; else stats[op].wrong++;
  localStorage.setItem(OP_STATS_KEY, JSON.stringify(stats));
}

/**
 * Return a weight map for each op in `ops`.
 * Higher weight = more mistakes historically = shown more often.
 * Uses Laplace smoothing so ops with no history get a fair neutral weight.
 */
export function getOpWeights(ops) {
  const stats = load(OP_STATS_KEY, {});
  const weights = {};
  for (const op of ops) {
    const s = stats[op] || { correct: 0, wrong: 0 };
    weights[op] = (s.wrong + 1) / (s.correct + s.wrong + 2);
  }
  return weights;
}
