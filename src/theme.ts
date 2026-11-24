import { INK, RED, WHITE } from './colors';
import { fx } from './sakuga';

const PAPERS = [
  { paper: '#bfe6d2', tone: '#8cc7ab' },
  { paper: '#f6dd6b', tone: '#d9b834' },
  { paper: '#f9c3cb', tone: '#e793a0' },
  { paper: '#b9d8f4', tone: '#84b3df' },
];

export function setPaper(chapter: number) {
  const { paper, tone } = PAPERS[(chapter - 1) % PAPERS.length];
  document.documentElement.style.setProperty('--paper', paper);
  document.documentElement.style.setProperty('--tone', tone);
  Object.assign(fx.P, { shade: tone, line: INK, accent: RED, ink: INK, sfx: [INK, WHITE] });
}
