import { UI_FONT } from '../constants';
import { AudioBus } from '../systems/audio';
import { buildBackdrop } from './backdrop';

export function titleText(scene: Phaser.Scene, y: number, str: string, size = 52): Phaser.GameObjects.Text {
  const glow = scene.add
    .text(480, y, str, {
      fontFamily: UI_FONT,
      fontSize: `${size}px`,
      fontStyle: '800',
      color: '#46f0c8',
    })
    .setOrigin(0.5)
    .setAlpha(0.35);
  glow.setScale(1.02);
  const main = scene.add
    .text(480, y, str, {
      fontFamily: UI_FONT,
      fontSize: `${size}px`,
      fontStyle: '800',
      color: '#ffd23f',
      stroke: '#3a2200',
      strokeThickness: 7,
    })
    .setOrigin(0.5);
  main.setShadow(0, 4, '#000000', 10, true, true);
  void glow;
  return main;
}

export function subtitleText(scene: Phaser.Scene, y: number, str: string): Phaser.GameObjects.Text {
  return scene.add
    .text(480, y, str, {
      fontFamily: UI_FONT,
      fontSize: '19px',
      fontStyle: '700',
      color: '#9aa3c7',
    })
    .setOrigin(0.5);
}

export function bodyText(scene: Phaser.Scene, y: number, str: string, size = 17): Phaser.GameObjects.Text {
  return scene.add
    .text(480, y, str, {
      fontFamily: UI_FONT,
      fontSize: `${size}px`,
      color: '#f2f5ff',
      align: 'center',
      lineSpacing: 8,
      wordWrap: { width: 860 },
    })
    .setOrigin(0.5, 0);
}

export function menuButton(
  scene: Phaser.Scene,
  y: number,
  label: string,
  onClick: () => void,
  opts?: { small?: boolean; primary?: boolean },
): Phaser.GameObjects.Container {
  const w = opts?.small ? 300 : 400;
  const h = opts?.small ? 42 : 54;
  const primary = opts?.primary ?? false;
  const bg = scene.add
    .rectangle(0, 0, w, h, primary ? 0x3a2c10 : 0x141b3d)
    .setStrokeStyle(2, primary ? 0xffd23f : 0x46f0c8, primary ? 1 : 0.75);
  const t = scene.add
    .text(0, 1, label, {
      fontFamily: UI_FONT,
      fontSize: opts?.small ? '17px' : '21px',
      fontStyle: '800',
      color: primary ? '#ffd23f' : '#ffffff',
    })
    .setOrigin(0.5);
  const c = scene.add.container(480, y, [bg, t]);
  c.setSize(w, h);
  c.setInteractive({ useHandCursor: true });
  c.on('pointerover', () => {
    bg.setFillStyle(primary ? 0x54400f : 0x1e2a5e);
    bg.setStrokeStyle(2, primary ? 0xffe9a8 : 0x8ff5ff, 1);
  });
  c.on('pointerout', () => {
    bg.setFillStyle(primary ? 0x3a2c10 : 0x141b3d);
    bg.setStrokeStyle(2, primary ? 0xffd23f : 0x46f0c8, primary ? 1 : 0.75);
  });
  c.on('pointerdown', () => {
    AudioBus.unlock();
    AudioBus.click();
    scene.tweens.add({ targets: c, scale: 0.95, duration: 70, yoyo: true });
    onClick();
  });
  return c;
}

export function bgStars(scene: Phaser.Scene): void {
  buildBackdrop(scene, {});
}
