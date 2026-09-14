export const GAME_W = 960;
export const GAME_H = 540;

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

export const TextureKeys = {
  Player: 'px-player',
  Walker: 'px-walker',
  Flyer: 'px-flyer',
  Golem: 'px-golem',
  Tile: 'px-tile',
  TileDark: 'px-tile-dark',
  Coin: 'px-coin',
  Spike: 'px-spike',
  Saw: 'px-saw',
  Checkpoint: 'px-checkpoint',
  CheckpointOn: 'px-checkpoint-on',
  Goal: 'px-goal',
  Dot: 'px-dot',
  Moving: 'px-moving',
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
  heart: { name: 'Corazón', desc: '+1 vida', color: 0xff5d5d, css: '#ff5d5d' },
  dash: { name: 'Dash', desc: 'Desbloquea dash (este nivel)', color: 0xffffff, css: '#ffffff' },
};

export const SAVE_KEY = '2dilesz-save-v1';

export const PALETTE = {
  bg: 0x0b1020,
  sky1: 0x141c3d,
  sky2: 0x0b1020,
  tile: 0x3a2d5c,
  tileTop: 0x6f5da8,
  tileDark: 0x241d3d,
  text: '#e8ecff',
  dim: '#9aa3c7',
  accent: '#ffd23f',
};
