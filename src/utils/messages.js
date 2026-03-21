/**
 * All player-facing messages.
 * Edit or extend these freely — they're just data.
 */

export const CORRECT_MESSAGES = [
  "Awesome! 🌟",
  "You got it! ⭐",
  "Brilliant! 🎯",
  "Yes! Keep going! 🚀",
  "That's right! 💪",
  "Super smart! 🧠",
  "Woohoo! 🎉",
  "Perfect! ✨",
  "Math wizard! 🪄",
  "On fire! 🔥",
];

export const WRONG_MESSAGES = [
  "Almost! Try the next one 💪",
  "Not quite — you've got this!",
  "Keep trying, you're doing great!",
  "Oops! Next one coming up 😊",
  "Math heroes learn from every try!",
];

export const TIMEOUT_MESSAGE = "Time's up! ⏰";

/**
 * End-of-game result tiers (checked from top to bottom).
 * `min` is the minimum number of correct answers to earn that tier.
 */
export const END_TIERS = [
  { min: 10, emoji: "🏆", title: "Perfect score! Genius!",   sub: "You got every single one right!" },
  { min: 8,  emoji: "🌟", title: "Outstanding!",             sub: "So close to perfect — incredible!" },
  { min: 6,  emoji: "🎉", title: "Great job!",               sub: "You're getting really good at this!" },
  { min: 4,  emoji: "😊", title: "Good effort!",             sub: "Keep practicing, you're improving!" },
  { min: 0,  emoji: "💪", title: "Nice try!",                sub: "Every math hero starts somewhere!" },
];

/**
 * Themed end-screen encouragement tiers.
 * Each theme has the same 5 tiers as END_TIERS (checked top-down by min correct).
 */
export const THEMED_TIERS = {
  hp: [
    { min: 10, quote: "Extraordinary! In all my years at Hogwarts, I have rarely witnessed such arithmantic brilliance. Ten points to your house — no, make it a hundred!" },
    { min: 8,  quote: "Splendid work, young witch or wizard! Your command of numbers would make even Professor McGonagall crack a smile." },
    { min: 6,  quote: "Well done! The magic of mathematics flows strongly through you. A few more spells of practice and you shall be unstoppable." },
    { min: 4,  quote: "A decent effort, and remember — the bravest witches and wizards are not those who never stumble, but those who rise again. On your feet!" },
    { min: 0,  quote: "Every great sorcerer once stood exactly where you stand today. The magic is within you. I am quite certain of it." },
  ],
  pj: [
    { min: 10, quote: "Oh. My. Gods. That was LEGENDARY! Even Athena put down her scroll to slow-clap. You just out-smarted Olympus!" },
    { min: 8,  quote: "Dude, the Oracle didn't predict this level of awesome! Camp Half-Blood is calling your name — hero material, right here!" },
    { min: 6,  quote: "Not bad, demigod! You sliced through those problems like Riptide through a monster. Keep training and Mount Olympus will notice!" },
    { min: 4,  quote: "Hey, even Percy failed his first quest! What matters is you showed up and fought. The gods respect that — try again, hero!" },
    { min: 0,  quote: "Every hero's journey starts with a stumble. Annabeth says the smartest move right now is to go again. And she's basically always right." },
  ],
};

export const THEMES = ['hp', 'pj'];

export function getThemedTier(correctCount) {
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  const tier  = THEMED_TIERS[theme].find(t => correctCount >= t.min);
  return { theme, quote: tier.quote };
}

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTier(correctCount) {
  return END_TIERS.find(t => correctCount >= t.min);
}
