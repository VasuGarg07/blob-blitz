import { addBlot, drawWord, place, release, remove } from './blots';
import { BOSSES } from './bosses';
import { input } from './dom';
import { formatScore } from './format';
import * as effects from './effects';
import { drawHud, drawTime, hideOverlay, showBanner, showOverlay } from './hud';
import { runPower } from './powers';
import { addCombo, blotSpeed, bossSpeed, findTarget, newGame, rewardWord, checkpointFor, spawnDelay, startBoss, startChapter, summary, timeBonus, volumeOf, type Blot } from './rules';
import { fx } from './sakuga';
import { unlockSound } from './sound';
import { state } from './state';
import { readCheckpoint, saveBest, saveCheckpoint } from './storage';
import { setPaper } from './theme';
import { pick, pickWord, wordPool } from './words';

let lastLane = 0;
let pool: string[] = [];

const newWord = () => pickWord(pool, state.blots.map((blot) => blot.word));
const findBoss = () => state.blots.find((blot) => blot.queue);

function spawnNext() {
  const word = newWord();
  lastLane = (lastLane + pick([1, 2, 3])) % 5;
  addBlot({ word, x: 1.05, y: 0.15 + lastLane * 0.17, speed: blotSpeed(state.game.chapter, word.length) });
  return word;
}

function spawnBoss() {
  const { chapter } = state.game;
  const boss = BOSSES[chapter - 1];
  const extraWords = Array.from({ length: Math.floor(volumeOf(chapter) / 3) }, () => pick(pool));
  const [word, ...queue] = [...pick(boss.lines).split(' '), ...extraWords];
  startBoss(state.game);
  addBlot({ word, x: 1.05, y: 0.46, speed: bossSpeed(chapter), queue, boss });
  effects.bossArrives();
  showBanner(boss.name, boss.hint);
  drawHud();
}

function nextChapter() {
  startChapter(state.game);
  if (checkpointFor(state.game.chapter) > readCheckpoint()) saveCheckpoint(checkpointFor(state.game.chapter));
  pool = wordPool(state.game.chapter);
  setPaper(state.game.chapter);
  showBanner(`Chapter ${state.game.chapter}`);
  drawHud();
}

export function press(letter: string) {
  if (letter === ' ') return spread();
  if (!/^[a-z]$/.test(letter)) return;
  state.target ??= findTarget(state.blots, letter);
  const { target } = state;
  if (!target || target.word[target.typed] !== letter) return miss();
  state.game.hits++;
  target.typed++;
  drawWord(target);
  effects.keyHit(target);
  if (target.typed === target.word.length) finishWord(target);
}

function miss() {
  if (state.freeze > 0) return;
  state.game.misses++;
  state.game.combo = 0;
  effects.keyMiss();
  if (state.target?.powers.includes('erase')) release(state.target);
  drawHud();
}

function finishWord(blot: Blot) {
  rewardWord(state.game, blot.word.length);
  state.target = null;
  effects.lunge();
  strike(blot);
  drawHud();
}

function strike(blot: Blot) {
  const center = effects.centerOf(blot);
  effects.slash(center, Boolean(blot.queue));
  if (blot.queue?.length) {
    blot.word = blot.queue.shift()!;
    blot.x = Math.min(0.95, blot.x + 0.14);
    blot.wordClock = 0;
    release(blot);
    effects.bossHit(center);
    state.freeze = Math.max(state.freeze, 0.07);
    return;
  }
  remove(blot);
  if (blot.queue) {
    const bonus = timeBonus(state.game.timeLeft);
    state.game.score += 500 + bonus;
    state.game.bossBeaten = true;
    showBanner(`Time bonus ${bonus}`);
    state.freeze = 1.1;
    effects.bossKilled(center);
  } else {
    effects.blotKilled(center, state.game.combo);
    if (state.blots.length === 0) state.game.spawnIn = Math.min(state.game.spawnIn, 0.3);
  }
}

export function spread() {
  if (state.game.charge < 100) return;
  state.game.charge = 0;
  state.freeze = 0.5 + state.blots.length * 0.08;
  effects.spreadBlast();
  state.blots.forEach((blot, i) => fx.later(120 + i * 80, () => {
    if (blot.dead) return;
    state.game.score += 50;
    addCombo(state.game);
    strike(blot);
    drawHud();
  }));
  drawHud();
}

export function dropTarget() {
  if (state.target) release(state.target);
}

function loseLife() {
  effects.heroHurt();
  state.game.combo = 0;
  state.game.lives--;
  drawHud();
  if (state.game.lives === 0) endGame('Inked<br>out', `You reached chapter ${state.game.chapter} of ${BOSSES.length}.`);
}

function hurt(blot: Blot) {
  loseLife();
  if (blot.queue && state.game.lives > 0) {
    blot.x = 0.8;
    release(blot);
  } else {
    remove(blot);
  }
}

function clearBlots() {
  for (const blot of state.blots) {
    effects.blotFlees(blot);
    remove(blot);
  }
}

function bossEscapes() {
  clearBlots();
  showBanner('Out of time');
  state.freeze = 1.4;
  loseLife();
}

function endGame(title: string, result: string) {
  const { game } = state;
  const { wpm, accuracy } = summary(game);
  state.mode = 'over';
  showOverlay(title, `${result} Score ${formatScore(game.score)} (best ${formatScore(saveBest(game.score))}). ${wpm} words a minute, ${accuracy}% accurate, longest combo ${game.bestCombo}.`);
  input.blur();
}

function enterPlay() {
  unlockSound();
  state.mode = 'playing';
  hideOverlay();
  input.focus({ preventScroll: true });
}

export function playFrom(chapter: number) {
  state.blots.forEach(remove);
  state.game = newGame();
  state.game.chapter = chapter - 1;
  state.freeze = 0;
  nextChapter();
  enterPlay();
}

export function play() {
  if (state.mode === 'paused') enterPlay();
  else playFrom(readCheckpoint());
}

export function pause() {
  if (state.mode !== 'playing') return;
  state.mode = 'paused';
  showOverlay('Pen<br>down', 'Paused. Your blots are waiting where you left them.');
}

function afterBoss() {
  clearBlots();
  if (state.game.chapter < BOSSES.length) nextChapter();
  else if (state.game.bossBeaten) {
    saveCheckpoint(1);
    endGame('The<br>end', `You beat all ${BOSSES.length} bosses.`);
  }
  else spawnBoss();
}

export function update(dt: number) {
  if (state.mode !== 'playing') return;
  if (state.freeze > 0) {
    state.freeze -= dt;
    return;
  }
  const { game } = state;
  game.time += dt;
  game.timeLeft -= dt;
  drawTime();
  for (const blot of state.blots) {
    blot.x -= blot.speed * dt;
    place(blot);
    if (blot.x < 0.15) hurt(blot);
    if (game.lives === 0) return;
  }
  if (game.phase === 'boss') {
    const boss = findBoss();
    if (!boss) afterBoss();
    else if (game.timeLeft <= 0) bossEscapes();
    else runPower(boss, dt, { callHelp: spawnNext, newWord });
  } else if (game.timeLeft <= 0) {
    clearBlots();
    spawnBoss();
  } else {
    game.spawnIn -= dt;
    if (game.spawnIn > 0) return;
    game.spawnIn = spawnDelay(game.chapter, spawnNext().length);
  }
}
