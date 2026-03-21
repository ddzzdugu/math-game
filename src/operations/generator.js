/**
 * Question generators — one per operation.
 * To add a new operation (e.g. fractions, powers), just add a new entry here.
 *
 * Each generator receives `range` (max number) and returns:
 *   { text: string, answer: number, hint?: string }
 */

const generators = {
  '+': (range) => {
    const a = randInt(range), b = randInt(range);
    return { text: `${a} + ${b}`, answer: a + b };
  },

  '-': (range) => {
    let a = randInt(range), b = randInt(range);
    if (b > a) [a, b] = [b, a];          // keep answer >= 0
    return { text: `${a} − ${b}`, answer: a - b };
  },

  '*': (range) => {
    // cap multipliers at 12 so it stays manageable
    const cap = Math.min(12, range);
    const a = randInt(cap), b = randInt(cap);
    return { text: `${a} × ${b}`, answer: a * b };
  },

  '/': (range) => {
    const cap = Math.min(12, range);
    const b = randInt(cap - 1) + 1;      // divisor never 0
    const answer = randInt(cap);
    const a = b * answer;
    return { text: `${a} ÷ ${b}`, answer };
  },

  // --- future operations: uncomment and extend as needed ---
  // '%': (range) => { ... },   // modulo / remainders
  // '**': (range) => { ... },  // powers / squares
};

function randInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Generate a random question for one of the given ops.
 * @param {string[]} ops  - e.g. ['+', '-']
 * @param {number}   range - max value
 * @returns {{ text, answer, hint? }}
 */
/**
 * Generate a question, optionally weighted by op error rates.
 * @param {string[]} ops
 * @param {number}   range
 * @param {Object}   [weights]  e.g. { '+': 0.3, '*': 0.8 } — higher = picked more often
 */
export function generateQuestion(ops, range, weights = null) {
  let op;
  if (weights) {
    const total = ops.reduce((s, o) => s + (weights[o] ?? 1), 0);
    let r = Math.random() * total;
    op = ops[ops.length - 1];
    for (const o of ops) { r -= (weights[o] ?? 1); if (r <= 0) { op = o; break; } }
  } else {
    op = ops[Math.floor(Math.random() * ops.length)];
  }
  return { ...generators[op](range), op };
}

/** Returns the list of supported operation symbols */
export function availableOps() {
  return Object.keys(generators);
}
