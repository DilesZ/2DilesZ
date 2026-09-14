import { GAME_H, GAME_W, PALETTE, TextureKeys } from '../constants';

export interface BackdropOptions {
  worldW?: number;
  animated?: boolean;
  gameplay?: boolean;
}

/**
 * Fondo "Neon Night" compartido: gradiente, auroras, luna con halo,
 * estrellas, ridges en parallax, luciérnagas, niebla y viñeta.
 */
export function buildBackdrop(scene: Phaser.Scene, opts: BackdropOptions = {}): void {
  const worldW = opts.worldW ?? GAME_W;
  const animated = opts.animated ?? true;
  const cam = scene.cameras.main;
  cam.setBackgroundColor(PALETTE.bg);

  // cielo en gradiente (detrás de todo)
  const sky = scene.add.graphics();
  sky.fillGradientStyle(0x070b1d, 0x070b1d, 0x101a3f, 0x101a3f, 1);
  sky.fillRect(0, 0, worldW, 420);
  const skyLow = scene.add.graphics();
  skyLow.fillGradientStyle(0x101a3f, 0x101a3f, 0x1f3370, 0x1f3370, 1);
  skyLow.fillRect(0, 420, worldW, 120);
  sky.setScrollFactor(0.05).setDepth(-10);
  skyLow.setScrollFactor(0.05).setDepth(-10);

  // auroras
  for (const [tex, x, alpha] of [
    [TextureKeys.AuroraA, worldW * 0.3, 0.5],
    [TextureKeys.AuroraB, worldW * 0.7, 0.45],
  ] as const) {
    const a = scene.add
      .image(x, 130, tex)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(alpha)
      .setScrollFactor(0.15)
      .setDepth(-9);
    if (animated) {
      scene.tweens.add({
        targets: a,
        x: x + 60,
        alpha: alpha * 0.7,
        duration: 7000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  // luna + halo
  const halo = scene.add
    .image(worldW - 130, 95, TextureKeys.Glow)
    .setTint(0xcfd8ff)
    .setScale(2.4)
    .setAlpha(0.5)
    .setBlendMode(Phaser.BlendModes.ADD)
    .setScrollFactor(0.12)
    .setDepth(-8);
  void halo;
  const moon = scene.add.circle(worldW - 130, 95, 24, 0xe9edff).setScrollFactor(0.12).setDepth(-8);
  scene.add.circle(worldW - 139, 88, 20, 0x101a3f).setScrollFactor(0.12).setDepth(-8);
  void moon;

  // estrellas (2 profundidades, algunas titilan)
  for (let i = 0; i < 150; i++) {
    const far = Math.random() < 0.6;
    const s = scene.add
      .rectangle(Math.random() * worldW, Math.random() * 360, far ? 1 : 2, far ? 1 : 2, 0xffffff, far ? 0.35 : 0.7)
      .setScrollFactor(far ? 0.08 : 0.15)
      .setDepth(-7);
    if (animated && !far && Math.random() < 0.25) {
      scene.tweens.add({
        targets: s,
        alpha: 0.15,
        duration: 900 + Math.random() * 1600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  // ridges en parallax
  const ridges = [
    { tex: TextureKeys.RidgeFar, y: 470, sf: 0.35 },
    { tex: TextureKeys.RidgeMid, y: 492, sf: 0.55 },
    { tex: TextureKeys.RidgeNear, y: 512, sf: 0.75 },
  ];
  for (const r of ridges) {
    scene.add.tileSprite(worldW / 2, r.y, worldW, 180, r.tex).setScrollFactor(r.sf).setDepth(-5);
  }

  if (opts.gameplay) {
    // luciérnagas
    for (let i = 0; i < 22; i++) {
      const f = scene.add
        .image(Math.random() * worldW, 120 + Math.random() * 300, TextureKeys.Glow)
        .setTint(Math.random() < 0.5 ? 0x9dff57 : 0xffd23f)
        .setScale(0.12 + Math.random() * 0.12)
        .setAlpha(0.7)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(3);
      if (animated) {
        scene.tweens.add({
          targets: f,
          x: f.x + Phaser.Math.Between(-70, 70),
          y: f.y + Phaser.Math.Between(-45, 45),
          alpha: 0.25,
          duration: 2200 + Math.random() * 2600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    }
    // niebla a la deriva
    for (let i = 0; i < 3; i++) {
      const fog = scene.add
        .image(Math.random() * worldW, 400 + i * 30, TextureKeys.Fog)
        .setAlpha(0.5)
        .setDepth(4)
        .setScrollFactor(0.85);
      if (animated) {
        scene.tweens.add({
          targets: fog,
          x: fog.x + 220,
          duration: 26000 + i * 7000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    }
  }
}

/** Viñeta cinematográfica fija a cámara. Llamar al final del create(). */
export function addVignette(scene: Phaser.Scene, depth = 90): void {
  scene.add.image(GAME_W / 2, GAME_H / 2, TextureKeys.Vignette).setScrollFactor(0).setDepth(depth);
}
