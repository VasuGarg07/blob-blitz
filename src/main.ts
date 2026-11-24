import { siGithub, siX, type SimpleIcon } from 'simple-icons';
import './style.css';
import { addBlot } from './blots';
import { byId, input, stage } from './dom';
import { dropTarget, pause, play, playFrom, press, spread, update } from './game';
import { drawHud, labelButtons } from './hud';
import { toggleMute } from './sound';
import { state } from './state';
import { setPaper } from './theme';

let lastFrame = 0;

function loop(now: number) {
  update(Math.min(0.05, (now - lastFrame) / 1000));
  lastFrame = now;
  requestAnimationFrame(loop);
}

input.addEventListener('input', () => {
  const typed = input.value.toLowerCase();
  input.value = '';
  for (const letter of typed) if (state.mode === 'playing') press(letter);
});
input.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') pause();
  if (event.key === 'Backspace') dropTarget();
});
input.addEventListener('blur', pause);
stage.addEventListener('pointerdown', (event) => {
  if (state.mode === 'playing') event.preventDefault();
});
byId('spread').addEventListener('pointerdown', (event) => {
  event.preventDefault();
  if (state.mode === 'playing') spread();
});
byId('mute').addEventListener('pointerdown', (event) => event.preventDefault());
byId('mute').addEventListener('click', () => {
  byId('mute').textContent = toggleMute() ? 'Sound off' : 'Sound on';
});
byId('go').addEventListener('click', play);
byId('restart').addEventListener('click', () => playFrom(1));

const drawIcon = (id: string, icon: SimpleIcon) => {
  byId(id).innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icon.path}"/></svg>`;
};

drawIcon('github', siGithub);
drawIcon('x', siX);
setPaper(1);
drawHud();
labelButtons();
addBlot({ word: 'slash', x: 0.84, y: 0.16, speed: 0 });
addBlot({ word: 'ink', x: 0.64, y: 0.12, speed: 0 });
addBlot({ word: 'panel', x: 0.86, y: 0.84, speed: 0 });
requestAnimationFrame(loop);
