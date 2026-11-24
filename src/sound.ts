import { zzfx, ZZFX } from 'zzfx';

const SOUNDS = {
  key: [0.3, 0.1, 900, 0, 0.01, 0.03, 1],
  miss: [0.7, 0.05, 110, 0, 0.04, 0.1, 2],
  slash: [0.6, 0.1, 500, 0, 0.03, 0.16, 4, 1.5, -12],
  boom: [1.3, 0.1, 70, 0.01, 0.12, 0.45, 4, 2, -1],
  tick: [0.4, 0, 660, 0, 0.02, 0.05, 1],
  hurt: [1, 0.05, 220, 0, 0.1, 0.3, 3, 1, -6],
};

let muted = false;

export function sound(name: keyof typeof SOUNDS) {
  if (!muted) zzfx(...SOUNDS[name]);
}

export function unlockSound() {
  ZZFX.audioContext.resume();
}

export function toggleMute() {
  muted = !muted;
  return muted;
}
