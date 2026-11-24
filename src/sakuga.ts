type Point = { x: number; y: number; w: number; h: number };
type Options = Record<string, unknown>;
type Effect = (x: number, y: number, options?: Options) => void;
type SoundWord = 'don' | 'gogo' | 'kachi' | 'pon' | 'shu' | 'zuza';

interface Sakuga {
  P: Options;
  TAU: number;
  clamp(value: number, min?: number, max?: number): number;
  rnd(min?: number, max?: number): number;
  later(ms: number, run: () => void): void;
  at(el: Element, fx?: number, fy?: number): Point;
  puff: Effect;
  burst: Effect;
  shards: Effect;
  ring: Effect;
  splash: Effect;
  slash: Effect;
  lines: Effect;
  ticks: Effect;
  donut: Effect;
  wob: Effect;
  sfx(word: SoundWord, x: number, y: number, options?: Options): void;
}

declare global {
  interface Window { SakugaFX: Sakuga }
}

export type { Point };
export const fx = window.SakugaFX;
