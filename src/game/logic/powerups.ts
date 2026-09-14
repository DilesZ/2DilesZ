import { TUNING } from '../config';
import type { PowerUpKind } from '../constants';

export interface PowerState {
  bootsUntil: number;
  magnetUntil: number;
  starUntil: number;
  shieldCharges: number;
  feather: boolean;
  dashUnlocked: boolean;
}

export function createInitialPowerState(dashUnlockedGlobally: boolean): PowerState {
  return {
    bootsUntil: 0,
    magnetUntil: 0,
    starUntil: 0,
    shieldCharges: 0,
    feather: false,
    dashUnlocked: dashUnlockedGlobally,
  };
}

/** Aplica un power-up. Retorna descripción para HUD/sonido. Puro y testeable. */
export function applyPowerUp(s: PowerState, kind: PowerUpKind, now: number): string {
  switch (kind) {
    case 'boots':
      s.bootsUntil = now + TUNING.powerups.bootsMs;
      return 'Botas ligeras: +velocidad';
    case 'magnet':
      s.magnetUntil = now + TUNING.powerups.magnetMs;
      return 'Imán activado';
    case 'star':
      s.starUntil = now + TUNING.powerups.starMs;
      return 'Puntos x2';
    case 'shield':
      s.shieldCharges = Math.min(2, s.shieldCharges + 1);
      return 'Escudo +1';
    case 'heart':
      return 'heart';
    case 'feather':
      s.feather = true;
      return '¡Doble salto!';
    case 'dash':
      s.dashUnlocked = true;
      return '¡Dash desbloqueado! (SHIFT)';
  }
}

export function speedMultiplier(s: PowerState, now: number): number {
  return now < s.bootsUntil ? TUNING.player.bootsMultiplier : 1;
}

export function scoreMultiplier(s: PowerState, now: number): number {
  return now < s.starUntil ? 2 : 1;
}

export function magnetRadius(s: PowerState, now: number): number {
  return now < s.magnetUntil ? TUNING.powerups.magnetMs && TUNING.powerups.magnetRadius : 0;
}

export function hasShield(s: PowerState): boolean {
  return s.shieldCharges > 0;
}

/** Consume escudo si existe. Retorna true si el daño fue bloqueado. */
export function consumeShield(s: PowerState): boolean {
  if (s.shieldCharges > 0) {
    s.shieldCharges -= 1;
    return true;
  }
  return false;
}

/** Limpia expirados de forma segura (no borra, solo deja que now los invalide). Retorna lista de expirados para feedback. */
export function expiredPowers(s: PowerState, now: number): string[] {
  const out: string[] = [];
  if (s.bootsUntil !== 0 && now >= s.bootsUntil) {
    s.bootsUntil = 0;
    out.push('boots');
  }
  if (s.magnetUntil !== 0 && now >= s.magnetUntil) {
    s.magnetUntil = 0;
    out.push('magnet');
  }
  if (s.starUntil !== 0 && now >= s.starUntil) {
    s.starUntil = 0;
    out.push('star');
  }
  return out;
}
