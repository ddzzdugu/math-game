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

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTier(correctCount) {
  return END_TIERS.find(t => correctCount >= t.min);
}
