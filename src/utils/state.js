/**
 * GameState holds all runtime data for one game session.
 * Add new fields here as the game grows (e.g. streaks, lives, xp).
 */
export class GameState {
  constructor({ ops = ['+'], range = 10, timerSecs = null, totalQuestions = 10 } = {}) {
    this.ops = ops;                   // which operations are active
    this.range = range;               // max number in questions
    this.timerSecs = timerSecs;       // null = no timer
    this.totalQuestions = totalQuestions;

    // runtime counters
    this.correct = 0;
    this.wrong = 0;
    this.currentQ = 0;
    this.history = [];                // [{question, userAnswer, correct, timeTaken}]
  }

  recordAnswer({ question, userAnswer, isCorrect, timeTaken }) {
    this.history.push({ question, userAnswer, isCorrect, timeTaken });
    if (isCorrect) this.correct++; else this.wrong++;
    this.currentQ++;
  }

  get score() { return this.correct; }
  get isFinished() { return this.currentQ >= this.totalQuestions; }
  get accuracy() {
    return this.currentQ === 0 ? 0 : Math.round((this.correct / this.currentQ) * 100);
  }
}
