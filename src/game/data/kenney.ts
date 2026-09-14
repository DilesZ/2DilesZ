/** Manifiesto único de assets Kenney. Preloader lo carga, tests lo verifican. */
export const KENNEY_DIR = 'assets/kenney';

export interface KenneyFile {
  key: string;
  file: string;
}

export const KENNEY_FILES: KenneyFile[] = [
  { key: 'k-player-idle', file: 'Characters_character_yellow_idle.png' },
  { key: 'k-player-jump', file: 'Characters_character_yellow_jump.png' },
  { key: 'k-player-walk-a', file: 'Characters_character_yellow_walk_a.png' },
  { key: 'k-player-walk-b', file: 'Characters_character_yellow_walk_b.png' },
  { key: 'k-player-hit', file: 'Characters_character_yellow_hit.png' },
  { key: 'k-slime-rest', file: 'Enemies_slime_normal_rest.png' },
  { key: 'k-slime-walk-a', file: 'Enemies_slime_normal_walk_a.png' },
  { key: 'k-slime-walk-b', file: 'Enemies_slime_normal_walk_b.png' },
  { key: 'k-fly-rest', file: 'Enemies_fly_rest.png' },
  { key: 'k-fly-a', file: 'Enemies_fly_a.png' },
  { key: 'k-fly-b', file: 'Enemies_fly_b.png' },
  { key: 'k-saw-a', file: 'Enemies_saw_a.png' },
  { key: 'k-saw-b', file: 'Enemies_saw_b.png' },
  { key: 'k-coin', file: 'Tiles_coin_gold.png' },
  { key: 'k-coin-side', file: 'Tiles_coin_gold_side.png' },
  { key: 'k-spikes', file: 'Tiles_spikes.png' },
  { key: 'k-flag-off', file: 'Tiles_flag_off.png' },
  { key: 'k-flag-a', file: 'Tiles_flag_green_a.png' },
  { key: 'k-flag-b', file: 'Tiles_flag_green_b.png' },
  { key: 'k-torch-a', file: 'Tiles_torch_on_a.png' },
  { key: 'k-torch-b', file: 'Tiles_torch_on_b.png' },
  { key: 'k-grass', file: 'Tiles_terrain_grass_block_top.png' },
  { key: 'k-bridge', file: 'Tiles_bridge_logs.png' },
  { key: 'k-heart', file: 'Tiles_heart.png' },
  { key: 'k-star', file: 'Tiles_star.png' },
];

/** Grupos para recorte con bounding-box unión (evita jitter al alternar frames). */
export interface TrimGroup {
  outPrefix: string;
  srcKeys: string[];
  outKeys: string[];
}

export const TRIM_GROUPS: TrimGroup[] = [
  {
    outPrefix: 't-player',
    srcKeys: ['k-player-idle', 'k-player-jump', 'k-player-walk-a', 'k-player-walk-b', 'k-player-hit'],
    outKeys: ['t-player-idle', 't-player-jump', 't-player-walk-a', 't-player-walk-b', 't-player-hit'],
  },
  {
    outPrefix: 't-slime',
    srcKeys: ['k-slime-rest', 'k-slime-walk-a', 'k-slime-walk-b'],
    outKeys: ['t-slime-rest', 't-slime-walk-a', 't-slime-walk-b'],
  },
  {
    outPrefix: 't-fly',
    srcKeys: ['k-fly-rest', 'k-fly-a', 'k-fly-b'],
    outKeys: ['t-fly-rest', 't-fly-a', 't-fly-b'],
  },
  {
    outPrefix: 't-saw',
    srcKeys: ['k-saw-a', 'k-saw-b'],
    outKeys: ['t-saw-a', 't-saw-b'],
  },
  {
    outPrefix: 't-coin',
    srcKeys: ['k-coin', 'k-coin-side'],
    outKeys: ['t-coin', 't-coin-side'],
  },
  {
    outPrefix: 't-flag',
    srcKeys: ['k-flag-off', 'k-flag-a', 'k-flag-b'],
    outKeys: ['t-flag-off', 't-flag-a', 't-flag-b'],
  },
  {
    outPrefix: 't-torch',
    srcKeys: ['k-torch-a', 'k-torch-b'],
    outKeys: ['t-torch-a', 't-torch-b'],
  },
  { outPrefix: 't-spikes', srcKeys: ['k-spikes'], outKeys: ['t-spikes'] },
  { outPrefix: 't-grass', srcKeys: ['k-grass'], outKeys: ['t-grass'] },
  { outPrefix: 't-bridge', srcKeys: ['k-bridge'], outKeys: ['t-bridge'] },
  { outPrefix: 't-heart', srcKeys: ['k-heart'], outKeys: ['t-heart'] },
  { outPrefix: 't-star', srcKeys: ['k-star'], outKeys: ['t-star'] },
];
