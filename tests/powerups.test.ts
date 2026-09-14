import { describe, expect, it } from 'vitest';
import { TUNING } from '../src/game/config';
import {
  applyPowerUp,
  consumeShield,
  createInitialPowerState,
  expiredPowers,
  hasShield,
  magnetRadius,
  scoreMultiplier,
  speedMultiplier,
} from '../src/game/logic/powerups';

describe('powerups', () => {
  it('boots aumenta velocidad durante su duración y luego expira', () => {
    const s = createInitialPowerState(false);
    applyPowerUp(s, 'boots', 1000);
    expect(speedMultiplier(s, 1000)).toBeCloseTo(TUNING.player.bootsMultiplier);
    expect(speedMultiplier(s, 1000 + TUNING.powerups.bootsMs + 1)).toBe(1);
    expect(expiredPowers(s, 1000 + TUNING.powerups.bootsMs + 1)).toContain('boots');
    expect(speedMultiplier(s, 999999)).toBe(1);
  });

  it('star duplica puntos durante 20s', () => {
    const s = createInitialPowerState(false);
    applyPowerUp(s, 'star', 0);
    expect(scoreMultiplier(s, 1000)).toBe(2);
    expect(scoreMultiplier(s, TUNING.powerups.starMs + 5)).toBe(1);
  });

  it('magnet define radio y expira', () => {
    const s = createInitialPowerState(false);
    expect(magnetRadius(s, 0)).toBe(0);
    applyPowerUp(s, 'magnet', 500);
    expect(magnetRadius(s, 600)).toBe(TUNING.powerups.magnetRadius);
    expect(expiredPowers(s, 500 + TUNING.powerups.magnetMs + 1)).toContain('magnet');
    expect(magnetRadius(s, 999999)).toBe(0);
  });

  it('shield acumula hasta 2 y se consume', () => {
    const s = createInitialPowerState(false);
    expect(hasShield(s)).toBe(false);
    applyPowerUp(s, 'shield', 0);
    applyPowerUp(s, 'shield', 0);
    applyPowerUp(s, 'shield', 0);
    expect(s.shieldCharges).toBe(2);
    expect(consumeShield(s)).toBe(true);
    expect(consumeShield(s)).toBe(true);
    expect(consumeShield(s)).toBe(false);
  });

  it('feather y dash son flags permanentes del nivel', () => {
    const s = createInitialPowerState(false);
    expect(s.feather).toBe(false);
    applyPowerUp(s, 'feather', 0);
    expect(s.feather).toBe(true);
    expect(s.dashUnlocked).toBe(false);
    applyPowerUp(s, 'dash', 0);
    expect(s.dashUnlocked).toBe(true);
  });

  it('los efectos se combinan', () => {
    const s = createInitialPowerState(true);
    applyPowerUp(s, 'boots', 0);
    applyPowerUp(s, 'star', 0);
    applyPowerUp(s, 'shield', 0);
    expect(speedMultiplier(s, 100)).toBeGreaterThan(1);
    expect(scoreMultiplier(s, 100)).toBe(2);
    expect(hasShield(s)).toBe(true);
  });
});
