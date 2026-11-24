import { BOSSES } from './bosses';
import { byId, stage } from './dom';
import { formatScore } from './format';
import { sound } from './sound';
import { state } from './state';
import { readCheckpoint } from './storage';

let shownSeconds = -1;

export function drawTime() {
  const seconds = Math.max(0, Math.ceil(state.game.timeLeft));
  if (seconds === shownSeconds) return;
  shownSeconds = seconds;
  const urgent = seconds <= 10;
  byId('time').textContent = `0:${String(seconds).padStart(2, '0')}`;
  byId('time').classList.toggle('urgent', urgent);
  if (urgent && seconds > 0) sound('tick');
}

export function drawHud() {
  const { lives, chapter, combo, score, charge } = state.game;
  const full = charge >= 100;
  byId('pages').innerHTML = [0, 1, 2].map((i) => `<i class="${i < lives ? '' : 'lost'}"></i>`).join('');
  byId('pages').setAttribute('aria-label', `${lives} pages left`);
  byId('chapter').textContent = `Chapter ${chapter || 1} of ${BOSSES.length}`;
  byId('combo').textContent = String(combo);
  byId('score').textContent = formatScore(score);
  drawTime();
  stage.classList.toggle('hot', combo >= 10);
  byId('spread').classList.toggle('full', full);
  byId('spread').querySelector('i')!.style.transform = `scaleX(${charge / 100})`;
  byId('spreadLabel').textContent = full ? 'Double-page spread ready! Press space or tap here' : 'Double-page spread: finish words to charge';
}

export function showBanner(text: string, hint = '') {
  const banner = byId('banner');
  banner.innerHTML = hint ? `${text}<small>${hint}</small>` : text;
  banner.animate([
    { opacity: 1, transform: 'translateX(100%) skewX(-18deg)' },
    { opacity: 1, transform: 'none', offset: 0.14 },
    { opacity: 1, transform: 'none', offset: 0.8 },
    { opacity: 1, transform: 'translateX(-100%) skewX(-18deg)' },
  ], { duration: hint ? 2600 : 1500, easing: 'ease-out' });
}

export function labelButtons() {
  const checkpoint = readCheckpoint();
  const paused = state.mode === 'paused';
  byId('go').textContent = paused ? 'Keep drawing' : checkpoint > 1 ? `Draw from chapter ${checkpoint}` : 'Start drawing';
  byId('restart').hidden = paused || checkpoint === 1;
}

export function showOverlay(title: string, message: string) {
  byId('title').innerHTML = title;
  byId('message').textContent = message;
  labelButtons();
  byId('overlay').hidden = false;
}

export function hideOverlay() {
  byId('overlay').hidden = true;
}
