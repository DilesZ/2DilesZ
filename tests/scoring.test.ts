import { describe, expect, it } from 'vitest';
import { TUNING } from '../src/game/config';
import {
  scoreForCoin,
  scoreForLevelComplete,
  scoreForPowerup,
  scoreForStomp,
} from '../src/game/logic/scoring';

describe('scoring', () => {
  it('moneda y stomp escalan con multiplicador', () => {
    expect(scoreForCoin(1)).toBe(TUNING.score.coin);
    expect(scoreForCoin(2)).toBe(TUNING.score.coin * 2);
    expect(scoreForStomp(2)).toBe(TUNING.score.enemyStomp * 2);
    expect(scoreForPowerup(1)).toBe(TUNING.score.powerup);
  });

  it('completar nivel da base + bonus de tiempo y penaliza muertes', () => {
    const fast = scoreForLevelComplete(1, 30_000, 0);
    const slow = scoreForLevelComplete(1, 300_000, 0);
    expect(fast).toBeGreaterThan(slow);
    const withDeaths = scoreForLevelComplete(1, 30_000, 3);
    expect(withDeaths).toBeLessThan(fast);
    expect(scoreForLevelComplete(6, 999_999, 20)).toBeGreaterThanOrEqual(100);
  });

  it('niveles altos pagan más base', () => {
    expect(scoreForLevelComplete(6, 60_000, 0)).toBeGreaterThan(scoreForLevelComplete(1, 60_000, 0));
  });
});
