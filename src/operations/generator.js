/**
 * Question generators — one per operation.
 * Each generator receives `range` ({ min, max }) and returns:
 *   { text: string, answer: number, hint?: string }
 */

const generators = {
  '+': ({ min, max }) => {
    const a = randBetween(min, max), b = randBetween(min, max);
    return { text: `${a} + ${b}`, answer: a + b };
  },

  '-': ({ min, max }) => {
    let a = randBetween(min, max), b = randBetween(min, max);
    if (b > a) [a, b] = [b, a];          // keep answer >= 0
    return { text: `${a} − ${b}`, answer: a - b };
  },

  '*': ({ min, max }) => {
    const cap = Math.min(12, max);
    const lo  = Math.min(min, cap);        // respect min, but never exceed cap
    const a = randBetween(lo, cap + 1), b = randBetween(lo, cap + 1);
    return { text: `${a} × ${b}`, answer: a * b };
  },

  '/': ({ min, max }) => {
    const cap = Math.min(12, max);
    const lo  = Math.min(min, cap);
    const b      = randBetween(Math.max(lo, 1), cap + 1);   // divisor >= 1
    const answer = randBetween(lo, cap + 1);
    const a = b * answer;
    return { text: `${a} ÷ ${b}`, answer };
  },

  // --- future operations: uncomment and extend as needed ---
  // '%': (range) => { ... },   // modulo / remainders
  // '**': (range) => { ... },  // powers / squares
};

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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
