import { TUNING } from '../config';

export function scoreForCoin(multiplier: number): number {
  return TUNING.score.coin * multiplier;
}

export function scoreForStomp(multiplier: number): number {
  return TUNING.score.enemyStomp * multiplier;
}

export function scoreForPowerup(multiplier: number): number {
  return TUNING.score.powerup * multiplier;
}

export function scoreForLevelComplete(levelId: number, timeMs: number, deaths: number): number {
  const secs = Math.floor(timeMs / 1000);
  const timeBonus = Math.max(0, TUNING.score.maxTimeBonus - secs * TUNING.score.timeBonusPerSec);
  const base = TUNING.score.levelBase * levelId;
  const penalty = deaths * TUNING.score.deathPenalty;
  return Math.max(100, base + timeBonus - penalty);
}
