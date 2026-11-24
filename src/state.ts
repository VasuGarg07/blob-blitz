import { newGame, type Blot } from './rules';

export const state = {
  mode: 'menu' as 'menu' | 'playing' | 'paused' | 'over',
  game: newGame(),
  blots: [] as Blot[],
  target: null as Blot | null,
  freeze: 0,
};
