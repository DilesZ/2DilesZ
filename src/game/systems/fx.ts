import { TextureKeys, UI_FONT } from '../constants';

/** Game-feel: destellos aditivos suaves, textos flotantes y flashes. */
export function burst(
  scene: Phaser.Scene,
  x: number,
  y: number,
  color: number,
  count = 12,
  speed = 160,
): void {
  try {
    const parts = scene.add.particles(x, y, TextureKeys.SoftDot, {
      speed: { min: speed * 0.4, max: speed },
      lifespan: { min: 220, max: 480 },
      quantity: count,
      scale: { min: 0.22, max: 0.55 },
      tint: color,
      blendMode: 'ADD',
      emitting: false,
    });
    parts.explode(count, x, y);
    scene.time.delayedCall(600, () => parts.destroy());
  } catch {
    /* fx opcional */
  }
}

export function floatText(scene: Phaser.Scene, x: number, y: number, msg: string, color = '#ffd23f'): void {
  try {
    const t = scene.add
      .text(x, y, msg, {
        fontFamily: UI_FONT,
        fontSize: '15px',
        fontStyle: '800',
        color,
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);
    scene.tweens.add({
      targets: t,
      y: y - 34,
      alpha: 0,
      duration: 750,
      ease: 'Cubic.easeOut',
      onComplete: () => t.destroy(),
    });
  } catch {
    /* noop */
  }
}

export function flashSprite(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite): void {
  try {
    scene.tweens.add({
      targets: sprite,
      alpha: 0.25,
      duration: 70,
      yoyo: true,
      repeat: 3,
      onComplete: () => sprite.setAlpha(1),
    });
  } catch {
    sprite.setAlpha(1);
  }
}
