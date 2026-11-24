import { VOLUME_SIZE, type Power } from './bosses';

export interface Blot {
  el: HTMLElement;
  word: string;
  typed: number;
  x: number;
  y: number;
  speed: number;
  queue: string[] | null;
  powers: Power[];
  clock: number;
  wordClock: number;
  dead: boolean;
}

export const ROUND_SECONDS = 45;
export const BOSS_SECONDS = 30;

export function newGame() {
  return { chapter: 0, phase: 'blots' as 'blots' | 'boss', timeLeft: ROUND_SECONDS, lives: 3, score: 0, combo: 0, bestCombo: 0, charge: 0, hits: 0, misses: 0, time: 0, spawnIn: 0, bossBeaten: false };
}

export type Game = ReturnType<typeof newGame>;

export function findTarget<T extends Pick<Blot, 'word' | 'x'>>(blots: T[], letter: string) {
  const matches = blots.filter((blot) => blot.word[0] === letter && blot.x < 1);
  return matches.sort((a, b) => a.x - b.x)[0] ?? null;
}

export function addCombo(game: Game) {
  game.combo++;
  game.bestCombo = Math.max(game.bestCombo, game.combo);
}

export function rewardWord(game: Game, wordLength: number) {
  addCombo(game);
  game.score += wordLength * 10 * (1 + Math.floor(game.combo / 10));
  game.charge = Math.min(100, game.charge + 8);
}

export const volumeOf = (chapter: number) => Math.floor((chapter - 1) / VOLUME_SIZE);

export const checkpointFor = (chapter: number) => volumeOf(chapter) * VOLUME_SIZE + 1;

export function startChapter(game: Game) {
  game.chapter++;
  if (game.chapter === checkpointFor(game.chapter)) game.lives = 3;
  game.phase = 'blots';
  game.timeLeft = ROUND_SECONDS;
  game.spawnIn = 1.5;
}

export function startBoss(game: Game) {
  game.phase = 'boss';
  game.timeLeft = BOSS_SECONDS;
  game.bossBeaten = false;
}

export const timeBonus = (timeLeft: number) => Math.ceil(Math.max(0, timeLeft)) * 20;

export function blotSpeed(chapter: number, wordLength: number) {
  const lengthFactor = Math.min(1.3, Math.max(0.65, 6 / wordLength));
  return (0.054 + chapter * 0.0003) * lengthFactor;
}

export const bossSpeed = (chapter: number) => 0.044 + chapter * 0.0002;

export const targetWpm = (chapter: number) => 24 + chapter * 0.6;

export const spawnDelay = (chapter: number, wordLength: number) => (wordLength * 12) / targetWpm(chapter);

export function summary({ hits, misses, time }: Game) {
  return {
    wpm: Math.round(hits / 5 / Math.max(time / 60, 0.05)),
    accuracy: Math.round((hits / Math.max(hits + misses, 1)) * 100),
  };
}
