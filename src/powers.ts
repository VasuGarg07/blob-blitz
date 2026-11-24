import { release } from './blots';
import * as effects from './effects';
import type { Blot } from './rules';

const POWER_SECONDS = 4.5;
const TIMED_POWERS = { dash, summon };
type TimedPower = keyof typeof TIMED_POWERS;
const isTimed = (power: string): power is TimedPower => power in TIMED_POWERS;

interface Actions {
  callHelp: () => void;
  newWord: () => string;
}

function dash(boss: Blot) {
  boss.x -= 0.1;
  effects.bossDash(boss);
}

function summon(boss: Blot, { callHelp }: Actions) {
  callHelp();
  effects.bossSummon(boss);
}

function rewrite(boss: Blot, { newWord }: Actions) {
  boss.word = newWord();
  boss.wordClock = 0;
  release(boss);
  effects.bossRewrite(boss);
}

export function runPower(boss: Blot, dt: number, actions: Actions) {
  const lastTurn = Math.floor(boss.clock / POWER_SECONDS);
  boss.clock += dt;
  boss.wordClock += dt;
  const turn = Math.floor(boss.clock / POWER_SECONDS);
  if (boss.powers.includes('drift')) boss.y = 0.46 + Math.sin(boss.clock * 1.7) * 0.22;
  if (boss.powers.includes('rewrite') && boss.wordClock > POWER_SECONDS) rewrite(boss, actions);
  const timed = boss.powers.filter(isTimed);
  if (turn !== lastTurn && timed.length) TIMED_POWERS[timed[(turn - 1) % timed.length]](boss, actions);
}
