/** Centraliza todo el tuning. Nada de valores mágicos en escenas/entidades. */
export const TUNING = {
  player: {
    maxLives: 3,
    moveSpeed: 230,
    bootsMultiplier: 1.22,
    accel: 2200,
    dragX: 1800,
    jumpVelocity: 560,
    jumpCutMultiplier: 0.45,
    coyoteMs: 110,
    bufferMs: 140,
    maxFall: 720,
    doubleJumpVelocity: 480,
    dashSpeed: 520,
    dashMs: 150,
    dashCooldownMs: 650,
    iframesMs: 1200,
    stompBounce: 420,
  },
  enemies: {
    walkerSpeed: 70,
    flyerSpeed: 90,
    flyerAmp: 46,
    golemSpeed: 110,
    golemJump: 430,
  },
  hazards: {
    sawDpsCooldownMs: 900,
  },
  score: {
    coin: 50,
    enemyStomp: 150,
    powerup: 30,
    levelBase: 500,
    timeBonusPerSec: 10,
    maxTimeBonus: 600,
    deathPenalty: 100,
  },
  powerups: {
    bootsMs: 25000,
    magnetMs: 25000,
    starMs: 20000,
    magnetRadius: 170,
  },
  camera: {
    lerp: 0.12,
    shakeHurtMs: 160,
    shakeHurtIntensity: 0.006,
    shakeDeathMs: 260,
    shakeDeathIntensity: 0.012,
  },
} as const;

export const WORLD = {
  gravityY: 1600,
} as const;
