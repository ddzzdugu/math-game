/**
 * Level presets — map school progress to game settings.
 * Add new levels here as the kid advances.
 *
 * Each level shape:
 * {
 *   id:          string   — unique key
 *   label:       string   — shown in UI
 *   ops:         string[] — which operations
 *   range:       number   — max number value
 *   timerSecs:   number|null
 *   description: string   — hint for parent / teacher
 * }
 */
export const LEVELS = [
  {
    id: 'starter',
    label: 'Starter',
    ops: ['+'],
    range: 10,
    timerSecs: null,
    description: 'Single-digit addition, no pressure.',
  },
  {
    id: 'add-sub-10',
    label: 'Add & Subtract to 10',
    ops: ['+', '-'],
    range: 10,
    timerSecs: null,
    description: 'Addition and subtraction within 10.',
  },
  {
    id: 'add-sub-20',
    label: 'Add & Subtract to 20',
    ops: ['+', '-'],
    range: 20,
    timerSecs: 20,
    description: 'Two-digit add and subtract with a gentle timer.',
  },
  {
    id: 'times-tables',
    label: 'Times Tables',
    ops: ['*'],
    range: 12,
    timerSecs: 15,
    description: 'Multiplication tables up to 12×12.',
  },
  {
    id: 'all-ops',
    label: 'All Operations',
    ops: ['+', '-', '*', '/'],
    range: 100,
    timerSecs: 20,
    description: 'Mixed practice — the full workout.',
  },
  {
    id: 'fractions',
    label: 'Fractions',
    ops: ['frac'],
    range: 12,
    timerSecs: null,
    description: 'Simplify fractions and add/subtract with different denominators.',
  },
];
