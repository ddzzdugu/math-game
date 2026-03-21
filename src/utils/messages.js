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
/**
 * Themed tiers are keyed by accuracy % (0–100), not raw correct count.
 * This ensures a 100% accuracy short session gets the top quote.
 */
export const THEMED_TIERS = {
  hp: [
    { min: 100, quotes: [
      "Extraordinary! In all my years at Hogwarts, I have rarely witnessed such arithmantic brilliance. Ten points to your house — no, make it a hundred!",
      "Perfect! Even the enchanted quills in the Hogwarts records room couldn't find a single error. Dumbledore himself would lead the applause.",
      "Flawless! You have mastered the ancient art of arithmancy. The Sorting Hat knew exactly what it was doing with you.",
      "By Merlin's beard — not one mistake! Even Hermione would peek at your parchment.",
    ]},
    { min: 80,  quotes: [
      "Splendid work, young witch or wizard! Your command of numbers would make even Professor McGonagall crack a smile.",
      "Well done! Your arithmancy rivals the finest seventh-years. A few more practice spells and perfection is yours.",
      "Impressive! The ghosts of Hogwarts are muttering in admiration. Even Nearly Headless Nick is impressed.",
      "Outstanding! Your house earns points today — and you've earned the respect of every portrait in the corridors.",
    ]},
    { min: 60,  quotes: [
      "Well done! The magic of mathematics flows strongly through you. A few more spells of practice and you shall be unstoppable.",
      "Good work! You show the true spirit of a Hogwarts student — curious, determined, and growing stronger every day.",
      "Not bad at all! Professor Flitwick says with a few more charms of practice, you'll be performing arithmetic magic with ease.",
      "Solid effort! The Room of Requirement has already prepared a study space — it knows you're serious about improving.",
    ]},
    { min: 40,  quotes: [
      "A decent effort, and remember — the bravest witches and wizards are not those who never stumble, but those who rise again. On your feet!",
      "Chin up! Even Harry needed more than one attempt to master the Patronus charm. Keep your wand at the ready.",
      "You tried, and trying is the first spell. Neville Longbottom didn't give up, and neither should you.",
      "The path to mastery is paved with practice. Hermione didn't learn everything in a day either — she just pretended she did.",
    ]},
    { min: 0,   quotes: [
      "Every great sorcerer once stood exactly where you stand today. The magic is within you. I am quite certain of it.",
      "Do not despair! Even the greatest wizards began with humble arithmetic. Your journey has only just started.",
      "Ron got plenty of things wrong too — and he still helped save the wizarding world. Keep going!",
      "The first step into Diagon Alley is always the hardest. You've taken it. Now onwards!",
    ]},
  ],
  pj: [
    { min: 100, quotes: [
      "Oh. My. Gods. That was LEGENDARY! Even Athena put down her scroll to slow-clap. You just out-smarted Olympus!",
      "PERFECT! The Oracle is revising the Great Prophecy — apparently it's all about YOU. Zeus is jealous.",
      "By Poseidon's trident! A flawless run! Chiron is already writing your name in the Camp Half-Blood Hall of Fame.",
      "Annabeth is speechless. ANNABETH. Do you know how hard that is? You're basically a math god.",
    ]},
    { min: 80,  quotes: [
      "Dude, the Oracle didn't predict this level of awesome! Camp Half-Blood is calling your name — hero material, right here!",
      "Solid work, demigod! Chiron says that kind of focus beats a sword arm any day. Olympus is watching.",
      "Nice! Hermes himself couldn't have calculated that faster. You've got the speed of a messenger god.",
      "The gods are impressed — and trust me, they're hard to impress. Ares even stopped frowning for a second.",
    ]},
    { min: 60,  quotes: [
      "Not bad, demigod! You sliced through those problems like Riptide through a monster. Keep training and Mount Olympus will notice!",
      "Good quest, hero! You defeated more than half the monsters. Grover says that's totally worth a satyr fist-bump.",
      "Decent work! Thalia says you've got the fighting spirit — now sharpen the strategy and you'll conquer Olympus.",
      "You're getting there! Clarisse respects effort almost as much as she respects winning. Almost.",
    ]},
    { min: 40,  quotes: [
      "Hey, even Percy failed his first quest! What matters is you showed up and fought. The gods respect that — try again, hero!",
      "Don't sweat it — Annabeth has a whole battle plan for your next attempt. She says losing is just data.",
      "Heroes don't quit. They regroup, eat some blue food, and come back stronger. Ready?",
      "Grover believes in you. Grover believes in everyone, but he means it this time. Try again!",
    ]},
    { min: 0,   quotes: [
      "Every hero's journey starts with a stumble. Annabeth says the smartest move right now is to go again. And she's basically always right.",
      "Even Percy had no idea what he was doing at first. Now he's saved Olympus twice. Your turn — go again!",
      "The gods give everyone a second quest. This one was just the warm-up. You've got this.",
      "Tyson the Cyclops says you're his favourite hero and he believes in you completely. That big guy never lies.",
    ]},
  ],
};

export const THEMES = ['hp', 'pj'];

export function getThemedTier(accuracy) {
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  const tier  = THEMED_TIERS[theme].find(t => accuracy >= t.min);
  return { theme, quote: tier.quotes[Math.floor(Math.random() * tier.quotes.length)] };
}

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTier(correctCount) {
  return END_TIERS.find(t => correctCount >= t.min);
}
