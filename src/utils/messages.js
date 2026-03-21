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
  los: [
    { min: 100, quotes: [
      "A perfect score! Even the Fairy Godmother stopped mid-spell to applaud. The storybook is writing itself — and YOU are the hero.",
      "Flawless! Alex Bailey herself couldn't have solved those problems faster. Conner is already writing a story about you.",
      "Perfect! You've unlocked a brand new chapter — the one where the math hero conquers every challenge. The Land of Stories needs more people like you.",
      "Not a single mistake! Even in the Enchanted Forest, legends like this are rare. Your story is one for the ages.",
    ]},
    { min: 80,  quotes: [
      "Outstanding! You're reading the map of mathematics like a true fairy tale adventurer. The Fairy Godmother smiles.",
      "Well done! Alex would say you've got the heart of a scholar and the bravery of a hero. Keep going!",
      "Impressive! Conner's notebook is full of heroes, and you just earned your own chapter.",
      "Solid work! The Enchanted Forest opens its gates to those who try this hard. Your adventure continues!",
    ]},
    { min: 60,  quotes: [
      "Good effort! Every fairy tale hero faces a challenge before their big moment. You're right on schedule.",
      "Not bad! Even Alex stumbled before she mastered magic. Keep practicing — your story isn't over yet.",
      "Well done so far! The Land of Stories rewards those who don't give up. Press on, adventurer.",
      "You're on the path! Every hero in the fairy tale world faces harder challenges before their greatest victories.",
    ]},
    { min: 40,  quotes: [
      "Keep going! Every good story has a tough middle chapter — this is yours. The ending is up to you.",
      "Don't worry! Alex and Conner faced impossible odds and kept moving. Your next try will be better.",
      "Chin up! In every fairy tale, the hero stumbles before they soar. Your moment is coming.",
      "The story isn't over! Take a breath, turn the page, and try again. That's what heroes do.",
    ]},
    { min: 0,   quotes: [
      "Every fairy tale begins with 'once upon a time' — and so does every great math journey. Once upon a time, you decided to try. That's enough to start.",
      "Even Conner needed Alex to help him understand things. You're not alone — try again!",
      "The Land of Stories celebrates every attempt. You showed up, and that's page one of your adventure.",
      "Fairy tale heroes don't quit after the first dragon. Ready to face this one again?",
    ]},
  ],
  tryout: [
    { min: 100, quotes: [
      "Perfect score! You nailed every single one — that's full-marks tryout energy. The squad wants YOU.",
      "Flawless! All that practice paid off. This is what showing up every day looks like.",
      "100%! You didn't just make the team — you made the starting lineup. Outstanding performance!",
      "Perfect! You gave it everything and it shows. That's not luck — that's hard work paying off.",
    ]},
    { min: 80,  quotes: [
      "Great job! Almost perfect — just like a near-flawless routine. A little more practice and you've got it.",
      "Well done! You've got the skills and the spirit. Keep showing up and the results will follow.",
      "Strong performance! You worked for every point you earned. That's what tryouts are really about.",
      "Really good! You belong out there — just a bit more polish and you'll be unstoppable.",
    ]},
    { min: 60,  quotes: [
      "Good effort! You made it through and kept going — that takes guts. Come back stronger.",
      "Decent round! Tryouts aren't won in one session. Every practice brings you closer.",
      "You've got this! The first tryout is the hardest. You learned something today — now use it.",
      "Not bad! Real improvement comes from real effort, and you're definitely putting it in.",
    ]},
    { min: 40,  quotes: [
      "Hey, not everyone makes it on the first try — that's why we practice. Get back out there!",
      "Tryouts are tough. But so are you. Shake it off and go again.",
      "Don't give up! The best athletes failed plenty before they succeeded. Your turn is coming.",
      "This is just practice round one. There are more chances ahead. Keep at it!",
    ]},
    { min: 0,   quotes: [
      "The bravest thing is showing up at all. You did that. Now do it again.",
      "Every champion started somewhere — and this is your somewhere. Try again!",
      "Even the best have a first tryout that doesn't go perfectly. You're in great company.",
      "Starting is the hardest part, and you've already done that. Keep going — you've got what it takes!",
    ]},
  ],
  squad: [
    { min: 100, quotes: [
      "Perfect score! The whole squad is cheering — every single answer right. That's legendary.",
      "Flawless! You came, you solved, you conquered. The squad has never been prouder.",
      "100%! You didn't just pass — you dominated. Squad goals: completely achieved.",
      "Not one wrong answer! That's the kind of performance that makes you squad captain material.",
    ]},
    { min: 80,  quotes: [
      "Strong work! The squad sticks together and so did you — right through to the end.",
      "Really impressive! Almost perfect, and that's something to be seriously proud of.",
      "Great job! You showed up and delivered. That's what being part of something great looks like.",
      "The squad is proud! Almost flawless — keep that energy and you'll get all the way there.",
    ]},
    { min: 60,  quotes: [
      "Good round! Every squad member has different strengths. Yours is showing up and trying.",
      "Not bad! In any squad, growth matters more than perfection. You're definitely growing.",
      "Decent effort! Your squad believes in you even on the tough days. Keep going.",
      "Keep going! The squad doesn't leave anyone behind — don't leave yourself behind either.",
    ]},
    { min: 40,  quotes: [
      "Hey, the squad has been through harder things together. You'll get through this too.",
      "Don't worry — every squad member has a rough session. It's what you do next that counts.",
      "The squad sticks together through the hard stuff. Stick with it!",
      "Try again! Your squad is waiting for you on the other side of this challenge.",
    ]},
    { min: 0,   quotes: [
      "Every great squad started with one person who refused to quit. Be that person.",
      "The squad's first rule: never give up on each other. Don't give up on yourself either.",
      "It's okay — the squad believes in second chances. Go take yours.",
      "Even the strongest squads have rough days. This is just one round — come back and show them what you've got.",
    ]},
  ],
};

export const THEMES = ['hp', 'pj', 'los', 'tryout', 'squad'];

export const THEME_LABELS = {
  hp:     '⚡ Hogwarts',
  pj:     '⚡ Camp Half-Blood',
  los:    '📖 The Land of Stories',
  tryout: '📣 The Tryout',
  squad:  '🌙 Squad',
};

export const OP_LABELS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

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
