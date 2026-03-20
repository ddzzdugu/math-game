/**
 * Countdown timer.
 * Usage:
 *   const t = new Timer(15, onTick, onExpire);
 *   t.start();
 *   t.stop();
 */
export class Timer {
  constructor(seconds, onTick, onExpire) {
    this.seconds = seconds;
    this.onTick = onTick;
    this.onExpire = onExpire;
    this._interval = null;
    this.timeLeft = seconds;
  }

  start() {
    this.timeLeft = this.seconds;
    this.onTick(this.timeLeft);
    this._interval = setInterval(() => {
      this.timeLeft--;
      this.onTick(this.timeLeft);
      if (this.timeLeft <= 0) {
        this.stop();
        this.onExpire();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this._interval);
    this._interval = null;
  }
}
