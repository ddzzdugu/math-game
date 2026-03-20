# Math Adventure 🎮

A fun, browser-based arithmetic game for kids. Practice addition, subtraction, multiplication, and division — at whatever pace and number range suits you.

---

## How to play

1. **Open the game** — double-click `index.html` to open it in your browser. No installation needed.

2. **Choose your operations** — tap any combination of `+  −  ×  ÷`. You can mix them for extra challenge.

3. **Pick a number range** — start small (0–9) and work your way up as you get more confident.

4. **Turn on a timer (optional)** — use the timer toggle to add a countdown to each question. Adjust the slider to give yourself more or less time.

5. **Answer 10 questions** — type your answer and press **Go!** (or hit **Enter** on your keyboard). The game gives you instant feedback and cheers you on!

6. **See your score** — at the end you'll get a result screen with your score, accuracy, and an emoji trophy based on how you did. You can play again with the same settings or change things up.

---

## Features

- ✅ Choose one or more operations to practice
- ✅ Four number ranges: 0–9, 0–19, 0–99, 0–999
- ✅ Optional per-question countdown timer
- ✅ Encouraging messages for every answer
- ✅ Score + accuracy at the end
- ✅ Works entirely offline — just open `index.html`

---

## Project structure

```
math-game/
├── index.html                  ← open this in your browser to play
├── src/
│   ├── main.js                 ← app entry point, handles screen navigation
│   ├── operations/
│   │   └── generator.js        ← question generators (one per operation)
│   ├── ui/
│   │   ├── setup.js            ← setup / config screen
│   │   ├── game.js             ← main game screen
│   │   ├── end.js              ← end / results screen
│   │   └── styles.css          ← all styles
│   └── utils/
│       ├── state.js            ← GameState class (scores, history)
│       ├── timer.js            ← reusable countdown timer
│       └── messages.js         ← encouragement text & end-game tiers
├── levels/
│   └── levels.js               ← preset difficulty levels (add more here!)
├── assets/
│   ├── icons/
│   │   └── favicon.svg
│   └── sounds/
│       └── README.md           ← placeholder for future sound effects
├── tests/                      ← placeholder for future unit tests
├── .gitignore
└── README.md
```

---

## Expanding the game

The project is structured to grow as new topics are learned at school. Here's where to look for each type of change:

| Want to add…                    | Edit this file                       |
|---------------------------------|--------------------------------------|
| A new operation (e.g. fractions)| `src/operations/generator.js`        |
| New encouragement messages      | `src/utils/messages.js`              |
| A new difficulty level / preset | `levels/levels.js`                   |
| Sound effects                   | `assets/sounds/` + `src/utils/`      |
| A new screen (e.g. level select)| Add a file in `src/ui/`              |
| Track high scores               | Extend `src/utils/state.js`          |

---

## Tech stack

Plain HTML + CSS + vanilla JavaScript (ES modules). No frameworks, no build step, no dependencies. Open the file and it works.

---

## License

Personal / educational use.
