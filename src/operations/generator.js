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

  'frac': (_range) => {
    const r = Math.random();
    if (r < 1 / 3) return fracSimplify();
    if (r < 2 / 3) return fracAdd();
    return fracSub();
  },

  // --- future operations: uncomment and extend as needed ---
  // '%': (range) => { ... },   // modulo / remainders
  // '**': (range) => { ... },  // powers / squares
};

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// ── Fraction helpers ────────────────────────────────────────────────────────

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a / gcd(a, b)) * b; }

function simplifyFrac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d);
  return { n: n / g, d: d / g };
}

function fmtFrac(n, d) { return d === 1 ? `${n}` : `${n}/${d}`; }

const DENOMS = [2, 3, 4, 5, 6, 8, 10, 12];
function pickDenom() { return DENOMS[Math.floor(Math.random() * DENOMS.length)]; }

function fracAdd() {
  let d1 = pickDenom(), d2 = pickDenom();
  while (d2 === d1) d2 = pickDenom();
  const n1 = randBetween(1, d1), n2 = randBetween(1, d2);
  const L = lcm(d1, d2);
  const ans = simplifyFrac(n1 * (L / d1) + n2 * (L / d2), L);
  return { text: `${fmtFrac(n1, d1)} + ${fmtFrac(n2, d2)}`, answer: ans, isFraction: true };
}

function fracSub() {
  for (let attempt = 0; attempt < 10; attempt++) {
    let d1 = pickDenom(), d2 = pickDenom();
    while (d2 === d1) d2 = pickDenom();
    let n1 = randBetween(1, d1), n2 = randBetween(1, d2);
    if (n1 * d2 < n2 * d1) { [n1, d1, n2, d2] = [n2, d2, n1, d1]; }  // swap so n1/d1 is larger
    if (n1 * d2 === n2 * d1) continue;                                   // equal fractions — retry
    const L = lcm(d1, d2);
    const num = n1 * (L / d1) - n2 * (L / d2);
    if (num <= 0) continue;
    return { text: `${fmtFrac(n1, d1)} − ${fmtFrac(n2, d2)}`, answer: simplifyFrac(num, L), isFraction: true };
  }
  return { text: '3/4 − 1/4', answer: { n: 1, d: 2 }, isFraction: true };  // fallback
}

function fracSimplify() {
  const dBase = pickDenom();
  const nBase = randBetween(1, dBase);   // numerator < denominator
  const factor = randBetween(2, 5);      // multiply both by 2–4
  return {
    text: `Simplify ${nBase * factor}/${dBase * factor}`,
    answer: simplifyFrac(nBase, dBase),
    isFraction: true,
  };
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
