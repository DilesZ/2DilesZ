import { describe, expect, it } from 'vitest';
import { POWERUP_META } from '../src/game/constants';
import { LEVELS } from '../src/game/data/levels';

describe('levels', () => {
  it('hay 6 niveles ordenados 1..6', () => {
    expect(LEVELS).toHaveLength(6);
    expect(LEVELS.map((l) => l.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('cada nivel es jugable en lo básico', () => {
    for (const l of LEVELS) {
      expect(l.worldW).toBeGreaterThanOrEqual(2000);
      expect(l.platforms.length).toBeGreaterThan(0);
      expect(l.coins.length).toBeGreaterThan(0);
      expect(l.checkpoints.length).toBeGreaterThanOrEqual(1);
      expect(l.spawn.x).toBeGreaterThanOrEqual(0);
      expect(l.spawn.x).toBeLessThan(l.worldW);
      expect(l.goal.x).toBeGreaterThan(l.worldW * 0.7);
      for (const p of l.platforms) {
        expect(p.w).toBeGreaterThan(0);
        expect(p.x + p.w).toBeLessThanOrEqual(l.worldW + 1);
      }
      for (const c of l.coins) {
        expect(c.x).toBeGreaterThanOrEqual(0);
        expect(c.x).toBeLessThanOrEqual(l.worldW);
      }
    }
  });

  it('powerups y enemigos usan kinds válidos', () => {
    const validPow = new Set(Object.keys(POWERUP_META));
    const validEnemy = new Set(['walker', 'flyer', 'golem']);
    for (const l of LEVELS) {
      for (const p of l.powerups) expect(validPow.has(p.kind)).toBe(true);
      for (const e of l.enemies) {
        expect(validEnemy.has(e.kind)).toBe(true);
        expect(e.minX).toBeLessThanOrEqual(e.maxX);
      }
    }
  });

  it('la dificultad escala: más peligros en niveles altos', () => {
    const danger = (i: number) =>
      LEVELS[i].enemies.length + LEVELS[i].spikes.length + LEVELS[i].saws.length;
    expect(danger(5)).toBeGreaterThan(danger(0));
    expect(danger(4)).toBeGreaterThan(danger(1));
  });

  it('dash se desbloquea en el nivel 3', () => {
    expect(LEVELS[2].unlocksDash).toBe(true);
    expect(LEVELS[2].powerups.some((p) => p.kind === 'dash')).toBe(true);
    expect(LEVELS[2].powerups.some((p) => p.kind === 'feather')).toBe(true);
  });
});
