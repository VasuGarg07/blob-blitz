import { bodyOf, labelOf } from './blots';
import { INK, WHITE } from './colors';
import { calm, hero, stage } from './dom';
import type { Blot } from './rules';
import { fx, type Point } from './sakuga';
import { sound } from './sound';

const scale = () => fx.clamp(stage.clientWidth / 900, 0.55, 1);

export const centerOf = (blot: Blot) => fx.at(bodyOf(blot));

function shake(size: number) {
  if (calm) return;
  const steps = [[0, 0], [-size, size / 2], [size, -size / 2], [-size / 2, -size / 3], [0, 0]];
  stage.animate(steps.map(([x, y]) => ({ transform: `translate(${x}px, ${y}px)` })), 240);
}

export function keyHit(blot: Blot) {
  sound('key');
  const c = fx.at(labelOf(blot), (blot.typed - 0.7) / blot.word.length, 1.25);
  fx.puff(c.x, c.y, { size: 7, n: 3, life: 0.4, vx: -20, vy: 8 });
  fx.ticks(c.x, c.y, { n: 3, r: 8, len: 9, life: 0.25, dir: 1.9 });
}

export function keyMiss() {
  sound('miss');
  const c = fx.at(hero);
  fx.wob(c.x + c.w / 2, c.y, { dir: 1, r: 18 });
  fx.wob(c.x - c.w / 2, c.y, { dir: -1, r: 18 });
}

export function lunge() {
  if (!calm) hero.animate([{ transform: 'none' }, { transform: 'translateX(60%) scale(1.3, .75)', offset: 0.25 }, { transform: 'none' }], { duration: 280, easing: 'ease-out' });
  const tip = fx.at(hero, 1, 0.5);
  fx.lines(tip.x, tip.y, { dir: 0, len: 120 * scale(), n: 9 });
}

export function slash(c: Point, boss: boolean) {
  sound('slash');
  fx.slash(c.x, c.y, { len: (boss ? 260 : 150) * scale(), ang: fx.rnd(-0.9, 0.3), thick: 22 * scale() });
}

export function bossHit(c: Point) {
  fx.burst(c.x - 40 * scale(), c.y, { r: 80 * scale() });
  fx.shards(c.x, c.y, { n: 8, speed: 240 });
}

export function blotKilled(c: Point, combo: number) {
  const u = scale();
  fx.burst(c.x, c.y, { r: 62 * u });
  fx.shards(c.x, c.y, { n: 8, speed: 230 });
  fx.puff(c.x, c.y, { size: 15 * u, vx: 60 });
  if (combo && combo % 10 === 0) {
    fx.sfx('don', c.x, c.y - 70 * u, { size: 190 * u });
    sound('boom');
    shake(8);
  } else if (combo && combo % 3 === 0) {
    fx.sfx('shu', c.x, c.y - 55 * u, { size: 110 * u, col: WHITE, edge: INK });
  }
}

export function bossKilled(c: Point) {
  const u = scale();
  shake(16);
  for (let i = 0; i < 6; i++) {
    fx.later(i * 110, () => {
      const x = c.x + fx.rnd(-110, 110) * u, y = c.y + fx.rnd(-80, 80) * u;
      fx.burst(x, y, { r: fx.rnd(60, 110) * u });
      fx.shards(x, y, { n: 6, speed: 300 });
      fx.puff(x, y, { size: 22 * u });
      sound('slash');
    });
  }
  fx.later(680, () => {
    fx.burst(c.x, c.y, { r: 230 * u, spikes: 19, life: 0.6 });
    fx.ring(c.x, c.y, { rx: 240 * u, ry: 70 * u, w: 12 });
    fx.shards(c.x, c.y, { n: 22, speed: 480, size: 9, arc: fx.TAU });
    fx.sfx('don', c.x - 60 * u, c.y - 60 * u, { size: 360 * u, life: 1.3 });
    fx.donut(c.x, c.y - 40 * u, { r: 50 * u });
    sound('boom');
    shake(18);
  });
}

export function bossDash(blot: Blot) {
  const c = centerOf(blot);
  fx.lines(c.x, c.y, { dir: 0, len: 170 * scale(), n: 12, spread: 60 * scale() });
  fx.sfx('shu', c.x, c.y - 80 * scale(), { size: 130 * scale(), col: WHITE, edge: INK });
  sound('slash');
}

export function bossSummon(blot: Blot) {
  const c = centerOf(blot);
  fx.puff(c.x, c.y, { size: 20 * scale(), vx: 40 });
  fx.sfx('pon', c.x, c.y - 80 * scale(), { size: 120 * scale(), col: WHITE, edge: INK });
  sound('miss');
}

export function bossRewrite(blot: Blot) {
  const c = fx.at(labelOf(blot));
  fx.puff(c.x, c.y, { size: 14 * scale() });
  fx.sfx('kachi', c.x, c.y - 90 * scale(), { size: 120 * scale(), dots: true, edge: INK });
  sound('miss');
}

export function blotFlees(blot: Blot) {
  const c = centerOf(blot);
  fx.puff(c.x, c.y, { size: 16 * scale(), vx: 50 });
}

export function bossArrives() {
  const c = fx.at(stage, 0.75, 0.2);
  fx.sfx('gogo', c.x, c.y, { size: 230 * scale(), life: 1.6 });
  sound('boom');
}

export function spreadBlast() {
  const c = fx.at(stage, 0.5, 0.25);
  fx.sfx('don', c.x, c.y, { size: 380 * scale(), life: 1.1 });
  sound('boom');
  shake(14);
}

export function heroHurt() {
  const c = fx.at(hero);
  fx.splash(c.x, c.y + 20, { w: 150, h: 90 });
  fx.sfx('zuza', c.x + 90 * scale(), c.y - 70, { size: 150 * scale(), dots: true, edge: INK });
  sound('hurt');
  shake(12);
}
