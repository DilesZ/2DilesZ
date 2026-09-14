import { createGame } from './game/main';
import { TouchState } from './game/systems/input';
import { AudioBus } from './game/systems/audio';

function wireButton(id: string, down: () => void, up: () => void): void {
  const el = document.getElementById(id);
  if (!el) return;
  const on = (e: Event) => {
    e.preventDefault();
    AudioBus.unlock();
    down();
  };
  const off = (e: Event) => {
    e.preventDefault();
    up();
  };
  el.addEventListener('pointerdown', on);
  el.addEventListener('pointerup', off);
  el.addEventListener('pointerleave', off);
  el.addEventListener('pointercancel', off);
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}

function initTouch(): void {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const touchPoints = navigator.maxTouchPoints ?? 0;
  const touch = (('ontouchstart' in window && touchPoints > 0) || coarse) ?? false;
  const panel = document.getElementById('touch-controls');
  if (panel && touch) panel.hidden = false;

  wireButton(
    'btn-left',
    () => (TouchState.left = true),
    () => (TouchState.left = false),
  );
  wireButton(
    'btn-right',
    () => (TouchState.right = true),
    () => (TouchState.right = false),
  );
  wireButton(
    'btn-jump',
    () => {
      TouchState.jumpHeld = true;
      TouchState.jumpPressed = true;
    },
    () => (TouchState.jumpHeld = false),
  );
  wireButton(
    'btn-dash',
    () => (TouchState.dashPressed = true),
    () => undefined,
  );
}

function initRotateHint(): void {
  const hint = document.getElementById('rotate-hint');
  if (!hint) return;
  const update = () => {
    const portrait = window.innerHeight > window.innerWidth;
    const narrow = window.innerWidth < 620;
    hint.hidden = !(portrait && narrow);
  };
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  update();
}

function boot(): void {
  initTouch();
  initRotateHint();
  createGame('game-container');
  // Desbloqueo de audio en el primer gesto (política autoplay).
  const unlock = () => AudioBus.unlock();
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
