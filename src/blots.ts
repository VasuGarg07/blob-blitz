import { blob, eye } from './art';
import type { Boss } from './bosses';
import { INK } from './colors';
import { byId } from './dom';
import type { Blot } from './rules';
import { state } from './state';

const normalArt = () => `<path d="${blob(12, 29, 40, 50)}" fill="${INK}"/>${eye(38, 46, 9, INK)}${eye(60, 46, 9, INK)}`;

type BlotOptions = Pick<Blot, 'word' | 'x' | 'y' | 'speed'> & { queue?: string[]; boss?: Boss };

export function addBlot({ boss, queue, ...options }: BlotOptions) {
  const el = document.createElement('div');
  el.className = boss ? `blot boss ${boss.powers.join(' ')}` : 'blot';
  el.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true">${boss ? boss.art() : normalArt()}</svg><span class="word"></span>`;
  byId('blots').append(el);
  const blot: Blot = { ...options, queue: queue ?? null, powers: boss?.powers ?? [], clock: 0, wordClock: 0, el, typed: 0, dead: false };
  state.blots.push(blot);
  drawWord(blot);
  place(blot);
}

export const bodyOf = (blot: Blot) => blot.el.firstElementChild!;
export const labelOf = (blot: Blot) => blot.el.lastElementChild!;

export function drawWord(blot: Blot) {
  const rest = blot.word.slice(blot.typed);
  const visible = blot.powers.includes('censor') ? rest.slice(0, 2) + '█'.repeat(Math.max(0, rest.length - 2)) : rest;
  labelOf(blot).innerHTML = `<s>${blot.word.slice(0, blot.typed)}</s>${visible}`;
  blot.el.classList.toggle('locked', blot === state.target);
}

export function place(blot: Blot) {
  blot.el.style.left = `${blot.x * 100}%`;
  blot.el.style.top = `${blot.y * 100}%`;
}

export function release(blot: Blot) {
  blot.typed = 0;
  if (state.target === blot) state.target = null;
  drawWord(blot);
}

export function remove(blot: Blot) {
  blot.dead = true;
  state.blots = state.blots.filter((other) => other !== blot);
  if (state.target === blot) state.target = null;
  blot.el.remove();
}
