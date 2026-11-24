import { expect, test } from 'vitest';
import { BOSSES, shuffleBosses, VOLUME_SIZE } from './bosses';
import { addCombo, blotSpeed, checkpointFor, BOSS_SECONDS, findTarget, newGame, rewardWord, ROUND_SECONDS, spawnDelay, startBoss, startChapter, summary, timeBonus } from './rules';
import bank from './word-bank.json';
import { formatScore } from './format';
import { takeWord, wordPool } from './words';

test('targets the closest visible blot with the typed letter', () => {
  const blots = [{ word: 'ink', x: 0.8 }, { word: 'impact', x: 0.4 }, { word: 'pen', x: 0.2 }, { word: 'zoom', x: 1.05 }];
  expect(findTarget(blots, 'i')?.word).toBe('impact');
  expect(findTarget(blots, 'z')).toBeNull();
});

test('score doubles from a combo of ten', () => {
  const game = newGame();
  for (let i = 0; i < 9; i++) rewardWord(game, 5);
  expect(game.score).toBe(450);
  rewardWord(game, 5);
  expect(game.score).toBe(550);
});

test('charge fills after thirteen words and stops at 100', () => {
  const game = newGame();
  for (let i = 0; i < 12; i++) rewardWord(game, 3);
  expect(game.charge).toBe(96);
  rewardWord(game, 3);
  expect(game.charge).toBe(100);
});

test('each chapter and each boss starts a fresh clock', () => {
  const game = newGame();
  startChapter(game);
  expect(game).toMatchObject({ chapter: 1, phase: 'blots', timeLeft: ROUND_SECONDS });
  startBoss(game);
  expect(game).toMatchObject({ chapter: 1, phase: 'boss', timeLeft: BOSS_SECONDS });
  startChapter(game);
  expect(game).toMatchObject({ chapter: 2, phase: 'blots', timeLeft: ROUND_SECONDS });
});

test('time bonus pays 20 points for each second left', () => {
  expect(timeBonus(12.4)).toBe(260);
  expect(timeBonus(-1)).toBe(0);
});

test('blots move faster in later chapters', () => {
  expect(blotSpeed(50, 5)).toBeGreaterThan(blotSpeed(1, 5));
});

test('the bank holds over 50,000 typeable words with no repeats', () => {
  const words = Object.values(bank).flat();
  expect(words.length).toBeGreaterThan(50000);
  expect(new Set(words).size).toBe(words.length);
  expect(words.every((word) => /^[a-z]{3,12}$/.test(word))).toBe(true);
});

test('chapters start with short words and later ones get longer', () => {
  expect(wordPool(1).every((word) => word.length <= 5)).toBe(true);
  expect(wordPool(1).length).toBeGreaterThan(2000);
  expect(wordPool(100).some((word) => word.length === 12)).toBe(true);
});

test('all 100 bosses have their own name and drawing', () => {
  expect(BOSSES.length).toBe(100);
  expect(new Set(BOSSES.map((boss) => boss.name)).size).toBe(100);
  expect(new Set(BOSSES.map((boss) => boss.art())).size).toBe(100);
});

test('every chapter has plenty of words', () => {
  for (let chapter = 1; chapter <= 100; chapter++) expect(wordPool(chapter).length).toBeGreaterThan(2000);
});

test('checkpoints come every ten chapters and refill pages', () => {
  expect([1, 10, 11, 37, 100].map(checkpointFor)).toEqual([1, 1, 11, 31, 91]);
  const game = { ...newGame(), chapter: 10, lives: 1 };
  startChapter(game);
  expect(game.lives).toBe(3);
});

test('each extra hit adds to the combo and the longest combo', () => {
  const game = { ...newGame(), combo: 7, bestCombo: 7 };
  for (let i = 0; i < 4; i++) addCombo(game);
  expect(game).toMatchObject({ combo: 11, bestCombo: 11 });
});

test('boss sentences are made of typeable words', () => {
  for (const line of BOSSES.flatMap((boss) => boss.lines)) expect(line).toMatch(/^[a-z]+( [a-z]+)+$/);
});

test('words arrive at 25 words a minute in chapter 1 and 84 in chapter 100', () => {
  expect(60 / spawnDelay(1, 5)).toBeCloseTo(24.6);
  expect(60 / spawnDelay(100, 5)).toBeCloseTo(84);
});

test('summary reports words a minute and accuracy', () => {
  expect(summary({ ...newGame(), hits: 100, misses: 25, time: 60 })).toEqual({ wpm: 20, accuracy: 80 });
});

test('scores shorten to K, M and B with one decimal', () => {
  expect([950, 1000, 23_900_000, 99_900_000_000].map(formatScore)).toEqual(['950', '1.0 K', '23.9 M', '99.9 B']);
});

test('new words never share a first letter with words on stage', () => {
  const pool = wordPool(1);
  for (let i = 0; i < 200; i++) expect('pi').not.toContain(takeWord(pool, ['pen', 'ink'])[0]);
});

test('words are shuffled for each chapter and never repeat within one', () => {
  expect(wordPool(1).slice(0, 20)).not.toEqual(wordPool(1).slice(0, 20));
  const pool = wordPool(1);
  const taken = Array.from({ length: 500 }, () => takeWord(pool, []));
  expect(new Set(taken).size).toBe(500);
});

test('every run meets every boss in a new order, ending each volume on Deadline', () => {
  const order = shuffleBosses();
  expect(new Set(order)).toEqual(new Set(BOSSES));
  expect(order).not.toEqual(shuffleBosses());
  for (let i = VOLUME_SIZE - 1; i < order.length; i += VOLUME_SIZE) expect(order[i].name).toContain('Deadline');
});
