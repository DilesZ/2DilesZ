export const GAME_W = 960;
export const GAME_H = 540;

/** Tipografía UI (Baloo 2 vía Google Fonts, con fallbacks offline). */
export const UI_FONT = '"Baloo 2", "Trebuchet MS", "Segoe UI", sans-serif';

export const SceneKeys = {
  Boot: 'Boot',
  Menu: 'Menu',
  HowTo: 'HowTo',
  Settings: 'Settings',
  Game: 'Game',
  Pause: 'Pause',
  GameOver: 'GameOver',
  Victory: 'Victory',
} as const;

/** Todo procedural propio v2 ("Neon Night"). Sin assets externos. */
export const TextureKeys = {
  Spirit: 'px-spirit',
  SpiritBlink: 'px-spirit-blink',
  SpiritHurt: 'px-spirit-hurt',
  SpiritJump: 'px-spirit-jump',
  ShadeA: 'px-shade-a',
  ShadeB: 'px-shade-b',
  BatA: 'px-bat-a',
  BatB: 'px-bat-b',
  GearA: 'px-gear-a',
  GearB: 'px-gear-b',
  CoinOrb: 'px-coin-orb',
  SpikeNeon: 'px-spike-neon',
  BeaconOff: 'px-beacon-off',
  BeaconOn: 'px-beacon-on',
  TileNight: 'px-tile-night',
  PlankNight: 'px-plank-night',
  Golem: 'px-golem',
  Goal: 'px-goal',
  Beam: 'px-beam',
  Glow: 'px-glow',
  SoftDot: 'px-soft-dot',
  Fog: 'px-fog',
  RidgeFar: 'px-ridge-far',
  RidgeMid: 'px-ridge-mid',
  RidgeNear: 'px-ridge-near',
  AuroraA: 'px-aurora-a',
  AuroraB: 'px-aurora-b',
  Vignette: 'px-vignette',
} as const;

export type PowerUpKind =
  | 'boots'
  | 'feather'
  | 'shield'
  | 'magnet'
  | 'star'
  | 'heart'
  | 'dash';

export const POWERUP_META: Record<PowerUpKind, { name: string; desc: string; color: number; css: string }> = {
  boots: { name: 'Botas ligeras', desc: '+20% velocidad (25s)', color: 0x35d0ff, css: '#35d0ff' },
  feather: { name: 'Pluma', desc: 'Doble salto (este nivel)', color: 0x9dff57, css: '#9dff57' },
  shield: { name: 'Escudo', desc: 'Bloquea 1 golpe', color: 0x7c9bff, css: '#7c9bff' },
  magnet: { name: 'Imán', desc: 'Atrae fragmentos (25s)', color: 0xff7ad9, css: '#ff7ad9' },
  star: { name: 'Estrella x2', desc: 'Puntos dobles (20s)', color: 0xffd23f, css: '#ffd23f' },
  heart: { name: 'Corazón', desc: '+1 vida', color: 0xff5d6d, css: '#ff5d6d' },
  dash: { name: 'Dash', desc: 'Desbloquea dash (este nivel)', color: 0x46f0c8, css: '#46f0c8' },
};

export const SAVE_KEY = '2dilesz-save-v1';

/** Paleta "Neon Night" v2. */
export const PALETTE = {
  bg: 0x070b1d,
  skyTop: '#070b1d',
  skyMid: '#101a3f',
  skyLow: '#1b2a5e',
  ridgeFar: 0x232c63,
  ridgeMid: 0x171d47,
  ridgeNear: 0x0e1330,
  tileBase: '#232742',
  tileDark: '#191d33',
  moss: '#37e08b',
  neon: '#46f0c8',
  gold: '#ffd23f',
  violet: '#8a5cff',
  danger: '#ff5d6e',
  text: '#f2f5ff',
  dim: '#9aa3c7',
  accent: '#ffd23f',
};
