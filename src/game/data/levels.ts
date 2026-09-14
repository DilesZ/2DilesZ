import type { PowerUpKind } from '../constants';

export interface PlatformDef {
  x: number;
  y: number;
  w: number;
  h: number;
  moving?: { axis: 'x' | 'y'; range: number; speed: number };
}
export interface CoinDef {
  x: number;
  y: number;
}
export interface PowerUpDef {
  kind: PowerUpKind;
  x: number;
  y: number;
}
export type EnemyKind = 'walker' | 'flyer' | 'golem';
export interface EnemyDef {
  kind: EnemyKind;
  x: number;
  y: number;
  minX: number;
  maxX: number;
  speed?: number;
}
export interface SpikeDef {
  x: number;
  y: number;
  w: number;
}
export interface SawDef {
  x: number;
  y: number;
  axis: 'x' | 'y';
  range: number;
  speed: number;
}
export interface LevelDef {
  id: number;
  name: string;
  hint: string;
  worldW: number;
  spawn: { x: number; y: number };
  goal: { x: number; y: number };
  platforms: PlatformDef[];
  coins: CoinDef[];
  powerups: PowerUpDef[];
  enemies: EnemyDef[];
  spikes: SpikeDef[];
  saws: SawDef[];
  checkpoints: { x: number; y: number }[];
  unlocksDash: boolean;
}

const G = 476; // top del suelo base

export const LEVELS: LevelDef[] = [
  {
    id: 1,
    name: 'Sendero del farol',
    hint: 'Corre con ◀ ▶ / A D. Salta con ESPACIO. Llega al faro.',
    worldW: 2400,
    spawn: { x: 80, y: 380 },
    goal: { x: 2260, y: 340 },
    platforms: [
      { x: 0, y: G, w: 640, h: 64 },
      { x: 700, y: G, w: 420, h: 64 },
      { x: 1180, y: 400, w: 140, h: 20 },
      { x: 1380, y: 340, w: 140, h: 20 },
      { x: 1580, y: G, w: 820, h: 64 },
    ],
    coins: [
      { x: 300, y: 420 }, { x: 340, y: 420 }, { x: 380, y: 420 },
      { x: 1210, y: 360 }, { x: 1250, y: 360 },
      { x: 1410, y: 300 }, { x: 1450, y: 300 },
      { x: 1800, y: 420 }, { x: 1850, y: 420 },
    ],
    powerups: [{ kind: 'boots', x: 900, y: 420 }],
    enemies: [],
    spikes: [],
    saws: [],
    checkpoints: [{ x: 1150, y: 420 }],
    unlocksDash: false,
  },
  {
    id: 2,
    name: 'Pasto inquieto',
    hint: '¡Cuidado con las babosas! Salta encima para derrotarlas.',
    worldW: 2800,
    spawn: { x: 80, y: 380 },
    goal: { x: 2660, y: 340 },
    platforms: [
      { x: 0, y: G, w: 700, h: 64 },
      { x: 760, y: G, w: 300, h: 64 },
      { x: 1120, y: 400, w: 130, h: 20 },
      { x: 1310, y: 340, w: 130, h: 20 },
      { x: 1500, y: G, w: 500, h: 64 },
      { x: 2060, y: G, w: 740, h: 64 },
    ],
    coins: [
      { x: 400, y: 420 }, { x: 440, y: 420 }, { x: 800, y: 420 },
      { x: 1150, y: 360 }, { x: 1340, y: 300 },
      { x: 1600, y: 420 }, { x: 1640, y: 420 }, { x: 1680, y: 420 },
      { x: 2200, y: 420 }, { x: 2240, y: 420 }, { x: 2400, y: 420 }, { x: 2440, y: 420 },
    ],
    powerups: [{ kind: 'heart', x: 1350, y: 290 }],
    enemies: [
      { kind: 'walker', x: 500, y: 430, minX: 380, maxX: 640 },
      { kind: 'walker', x: 1700, y: 430, minX: 1550, maxX: 1930 },
      { kind: 'walker', x: 2300, y: 430, minX: 2120, maxX: 2560 },
    ],
    spikes: [{ x: 880, y: 460, w: 64 }],
    saws: [],
    checkpoints: [{ x: 1520, y: 420 }],
    unlocksDash: false,
  },
  {
    id: 3,
    name: 'Viento y plumas',
    hint: 'La PLUMA da doble salto. Con SHIFT haces DASH.',
    worldW: 3200,
    spawn: { x: 80, y: 380 },
    goal: { x: 3060, y: 300 },
    platforms: [
      { x: 0, y: G, w: 520, h: 64 },
      { x: 580, y: 420, w: 120, h: 20 },
      { x: 760, y: 360, w: 120, h: 20 },
      { x: 940, y: G, w: 420, h: 64 },
      { x: 1420, y: G, w: 300, h: 64 },
      { x: 1780, y: 400, w: 130, h: 20, moving: { axis: 'y', range: 90, speed: 70 } },
      { x: 1980, y: G, w: 420, h: 64 },
      { x: 2460, y: 400, w: 120, h: 20 },
      { x: 2640, y: 340, w: 120, h: 20 },
      { x: 2820, y: G, w: 380, h: 64 },
    ],
    coins: [
      { x: 600, y: 380 }, { x: 780, y: 320 }, { x: 1000, y: 420 },
      { x: 1100, y: 420 }, { x: 1500, y: 420 }, { x: 1560, y: 420 },
      { x: 2050, y: 420 }, { x: 2100, y: 420 }, { x: 2480, y: 360 },
      { x: 2660, y: 300 }, { x: 2900, y: 420 }, { x: 2940, y: 420 },
    ],
    powerups: [
      { kind: 'feather', x: 610, y: 380 },
      { kind: 'dash', x: 1450, y: 420 },
    ],
    enemies: [
      { kind: 'walker', x: 1050, y: 430, minX: 960, maxX: 1300 },
      { kind: 'flyer', x: 2100, y: 300, minX: 2000, maxX: 2360 },
      { kind: 'walker', x: 2900, y: 430, minX: 2840, maxX: 3120 },
    ],
    spikes: [{ x: 1200, y: 460, w: 64 }],
    saws: [],
    checkpoints: [{ x: 1440, y: 420 }, { x: 2470, y: 420 }],
    unlocksDash: true,
  },
  {
    id: 4,
    name: 'Sierras del acantilado',
    hint: 'Las sierras patrullan. El IMÁN atrae fragmentos.',
    worldW: 3600,
    spawn: { x: 80, y: 380 },
    goal: { x: 3460, y: 300 },
    platforms: [
      { x: 0, y: G, w: 560, h: 64 },
      { x: 620, y: G, w: 260, h: 64 },
      { x: 940, y: 400, w: 120, h: 20, moving: { axis: 'x', range: 120, speed: 80 } },
      { x: 1180, y: G, w: 420, h: 64 },
      { x: 1660, y: 400, w: 120, h: 20 },
      { x: 1840, y: 340, w: 120, h: 20 },
      { x: 2020, y: G, w: 380, h: 64 },
      { x: 2460, y: G, w: 200, h: 64 },
      { x: 2720, y: 400, w: 120, h: 20, moving: { axis: 'y', range: 100, speed: 90 } },
      { x: 2920, y: G, w: 680, h: 64 },
    ],
    coins: [
      { x: 300, y: 420 }, { x: 340, y: 420 }, { x: 700, y: 420 },
      { x: 1250, y: 420 }, { x: 1300, y: 420 }, { x: 1690, y: 360 },
      { x: 1870, y: 300 }, { x: 2100, y: 420 }, { x: 2150, y: 420 },
      { x: 2500, y: 420 }, { x: 3000, y: 420 }, { x: 3050, y: 420 },
      { x: 3200, y: 420 }, { x: 3250, y: 420 },
    ],
    powerups: [
      { kind: 'magnet', x: 1210, y: 420 },
      { kind: 'star', x: 2050, y: 420 },
      { kind: 'feather', x: 640, y: 420 },
    ],
    enemies: [
      { kind: 'flyer', x: 1300, y: 300, minX: 1200, maxX: 1560 },
      { kind: 'walker', x: 2150, y: 430, minX: 2040, maxX: 2340 },
      { kind: 'flyer', x: 3050, y: 300, minX: 2940, maxX: 3300 },
    ],
    spikes: [
      { x: 700, y: 460, w: 64 },
      { x: 2520, y: 460, w: 64 },
    ],
    saws: [
      { x: 950, y: 430, axis: 'x', range: 130, speed: 110 },
      { x: 1750, y: 300, axis: 'y', range: 90, speed: 100 },
    ],
    checkpoints: [{ x: 1200, y: 420 }, { x: 2480, y: 420 }],
    unlocksDash: false,
  },
  {
    id: 5,
    name: 'La subida',
    hint: 'Combina todo: doble salto + dash + escudo.',
    worldW: 4200,
    spawn: { x: 80, y: 380 },
    goal: { x: 4060, y: 260 },
    platforms: [
      { x: 0, y: G, w: 480, h: 64 },
      { x: 540, y: 410, w: 110, h: 20 },
      { x: 710, y: 350, w: 110, h: 20 },
      { x: 880, y: G, w: 360, h: 64 },
      { x: 1300, y: G, w: 220, h: 64 },
      { x: 1580, y: 400, w: 120, h: 20, moving: { axis: 'x', range: 140, speed: 90 } },
      { x: 1800, y: G, w: 400, h: 64 },
      { x: 2260, y: 400, w: 110, h: 20 },
      { x: 2430, y: 340, w: 110, h: 20 },
      { x: 2600, y: G, w: 340, h: 64 },
      { x: 3000, y: G, w: 180, h: 64 },
      { x: 3240, y: 400, w: 120, h: 20, moving: { axis: 'y', range: 110, speed: 100 } },
      { x: 3440, y: 340, w: 120, h: 20 },
      { x: 3620, y: G, w: 580, h: 64 },
    ],
    coins: [
      { x: 300, y: 420 }, { x: 560, y: 370 }, { x: 730, y: 310 },
      { x: 950, y: 420 }, { x: 1000, y: 420 }, { x: 1360, y: 420 },
      { x: 1900, y: 420 }, { x: 1950, y: 420 }, { x: 2280, y: 360 },
      { x: 2450, y: 300 }, { x: 2700, y: 420 }, { x: 2750, y: 420 },
      { x: 3050, y: 420 }, { x: 3470, y: 300 }, { x: 3750, y: 420 }, { x: 3800, y: 420 },
    ],
    powerups: [
      { kind: 'shield', x: 900, y: 420 },
      { kind: 'boots', x: 1830, y: 420 },
      { kind: 'star', x: 2630, y: 420 },
      { kind: 'heart', x: 3460, y: 300 },
    ],
    enemies: [
      { kind: 'walker', x: 1000, y: 430, minX: 900, maxX: 1180 },
      { kind: 'flyer', x: 1900, y: 300, minX: 1820, maxX: 2160 },
      { kind: 'walker', x: 2700, y: 430, minX: 2620, maxX: 2900 },
      { kind: 'flyer', x: 3500, y: 280, minX: 3440, maxX: 3760 },
      { kind: 'walker', x: 3850, y: 430, minX: 3660, maxX: 4080 },
    ],
    spikes: [
      { x: 1330, y: 460, w: 64 },
      { x: 3030, y: 460, w: 64 },
    ],
    saws: [
      { x: 1450, y: 430, axis: 'x', range: 120, speed: 120 },
      { x: 2340, y: 300, axis: 'y', range: 100, speed: 110 },
      { x: 3330, y: 350, axis: 'x', range: 110, speed: 130 },
    ],
    checkpoints: [{ x: 1320, y: 420 }, { x: 2620, y: 420 }],
    unlocksDash: false,
  },
  {
    id: 6,
    name: 'El Faro Perdido',
    hint: 'El Gólem guarda el faro. Usa el escudo y tu destreza.',
    worldW: 4600,
    spawn: { x: 80, y: 380 },
    goal: { x: 4440, y: 260 },
    platforms: [
      { x: 0, y: G, w: 500, h: 64 },
      { x: 560, y: 410, w: 110, h: 20 },
      { x: 730, y: 350, w: 110, h: 20 },
      { x: 900, y: G, w: 380, h: 64 },
      { x: 1340, y: G, w: 220, h: 64 },
      { x: 1620, y: 400, w: 120, h: 20, moving: { axis: 'x', range: 150, speed: 100 } },
      { x: 1840, y: G, w: 380, h: 64 },
      { x: 2280, y: 400, w: 110, h: 20 },
      { x: 2450, y: 340, w: 110, h: 20 },
      { x: 2620, y: G, w: 360, h: 64 },
      { x: 3040, y: G, w: 180, h: 64 },
      { x: 3280, y: 400, w: 120, h: 20, moving: { axis: 'y', range: 120, speed: 110 } },
      { x: 3480, y: 340, w: 120, h: 20 },
      { x: 3660, y: G, w: 940, h: 64 },
    ],
    coins: [
      { x: 300, y: 420 }, { x: 580, y: 370 }, { x: 750, y: 310 },
      { x: 1000, y: 420 }, { x: 1050, y: 420 }, { x: 1400, y: 420 },
      { x: 1950, y: 420 }, { x: 2000, y: 420 }, { x: 2300, y: 360 },
      { x: 2470, y: 300 }, { x: 2720, y: 420 }, { x: 2770, y: 420 },
      { x: 3090, y: 420 }, { x: 3510, y: 300 }, { x: 3900, y: 420 },
      { x: 3950, y: 420 }, { x: 4100, y: 420 }, { x: 4150, y: 420 },
    ],
    powerups: [
      { kind: 'shield', x: 920, y: 420 },
      { kind: 'star', x: 1870, y: 420 },
      { kind: 'heart', x: 3500, y: 300 },
      { kind: 'magnet', x: 2650, y: 420 },
      { kind: 'boots', x: 3700, y: 420 },
    ],
    enemies: [
      { kind: 'walker', x: 1050, y: 430, minX: 920, maxX: 1220 },
      { kind: 'flyer', x: 1950, y: 300, minX: 1860, maxX: 2180 },
      { kind: 'walker', x: 2720, y: 430, minX: 2640, maxX: 2940 },
      { kind: 'golem', x: 4200, y: 380, minX: 3950, maxX: 4380 },
    ],
    spikes: [
      { x: 1370, y: 460, w: 64 },
      { x: 3070, y: 460, w: 64 },
    ],
    saws: [
      { x: 1480, y: 430, axis: 'x', range: 120, speed: 130 },
      { x: 2360, y: 300, axis: 'y', range: 100, speed: 120 },
      { x: 3370, y: 350, axis: 'x', range: 120, speed: 140 },
    ],
    checkpoints: [{ x: 1360, y: 420 }, { x: 2640, y: 420 }, { x: 3680, y: 420 }],
    unlocksDash: false,
  },
];
