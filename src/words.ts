import { volumeOf } from './rules';
import bank from './word-bank.json';

const { common, familiar, rare } = bank;

const LEVELS = [
  { lists: [common], min: 3, max: 5 },
  { lists: [common], min: 4, max: 6 },
  { lists: [common], min: 4, max: 7 },
  { lists: [common, familiar], min: 5, max: 7 },
  { lists: [common, familiar], min: 5, max: 8 },
  { lists: [common, familiar], min: 6, max: 9 },
  { lists: [common, familiar], min: 6, max: 10 },
  { lists: [common, familiar, rare], min: 6, max: 10 },
  { lists: [common, familiar, rare], min: 7, max: 11 },
  { lists: [common, familiar, rare], min: 7, max: 12 },
];

export const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

export function wordPool(chapter: number) {
  const { lists, min, max } = LEVELS[volumeOf(chapter)];
  return lists.flat().filter((word) => word.length >= min && word.length <= max);
}

export function pickWord(pool: string[], wordsOnStage: string[]) {
  const usedLetters = wordsOnStage.map((word) => word[0]);
  return pick(pool.filter((word) => !usedLetters.includes(word[0])));
}
