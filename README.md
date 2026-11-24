# Blot Blitz

A typing battle with anime-style impact effects. Ink blots are after your manuscript, and you are the pen. Type a blot's word to slash it before it reaches you.

## How to play

- **Type to attack.** The first letter locks onto a blot. Finish its word to slash it.
- **Backspace** lets go of a blot. **Esc** pauses.
- **Three pages.** Lose one each time a blot reaches your pen or a boss runs out its clock.
- **Combos.** Finish words without a mistake. Every 10 in a row raises the points you earn.
- **Double-page spread.** Finishing 13 words charges it. Press space to hit every blot on screen. Each hit adds to your combo.

## Chapters and bosses

There are 100 chapters. Each is a 45-second round followed by a boss you must beat in 30 seconds by typing its sentence.

Every boss has its own name and look, and powers it may share with others: some dash, call for help, fade or flip their words, hide letters, rewrite slow words, or wipe your progress when you slip.

Every ten chapters is a checkpoint that refills your pages. You can continue from your latest one.

Words come from a bank of over 56,000, starting short and common and ending long and rare.

## Run it

```sh
npm install
npm run dev
```

| Command | What it does |
|---|---|
| `npm run build` | Checks types and builds the game into `dist` |
| `npm test` | Runs the rule tests |
| `npm run words` | Rebuilds the word bank |

## Credits

| Library | Used for | License |
|---|---|---|
| [Sakuga VFX](https://github.com/finktheartist/sakuga-vfx) by Justin Finkelman | Anime effects and sound-effect lettering | MIT |
| [ZzFX](https://github.com/KilledByAPixel/ZzFX) by Frank Force | Sound effects | MIT |
| [wordlist-english](https://github.com/jacksonrayhamilton/wordlist-english) by Jackson Ray Hamilton, built on SCOWL by Kevin Atkinson | The word bank | MIT, with the SCOWL notice in `public/WORDLIST-COPYRIGHT.txt` |
| [obscenity](https://github.com/jo3-l/obscenity) | Filtering rude words | MIT |
| [naughty-words](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words) | Filtering rude words | CC BY 4.0 |
| [simple-icons](https://github.com/simple-icons/simple-icons) | GitHub and X icons | CC0 1.0 |
| [Vite](https://vite.dev), [TypeScript](https://www.typescriptlang.org), [Vitest](https://vitest.dev) | Building and testing | MIT, Apache 2.0, MIT |

Fonts: [Dela Gothic One](https://fonts.google.com/specimen/Dela+Gothic+One) and [M PLUS 1 Code](https://fonts.google.com/specimen/M+PLUS+1+Code), from Google Fonts.
