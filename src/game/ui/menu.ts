import { AudioBus } from '../systems/audio';

export function titleText(scene: Phaser.Scene, y: number, str: string, size = 44): Phaser.GameObjects.Text {
  return scene.add
    .text(480, y, str, {
      fontFamily: '"Courier New", monospace',
      fontSize: `${size}px`,
      color: '#ffd23f',
      stroke: '#000',
      strokeThickness: 6,
    })
    .setOrigin(0.5);
}

export function bodyText(scene: Phaser.Scene, y: number, str: string, size = 16): Phaser.GameObjects.Text {
  return scene.add
    .text(480, y, str, {
      fontFamily: '"Courier New", monospace',
      fontSize: `${size}px`,
      color: '#e8ecff',
      align: 'center',
      lineSpacing: 6,
      wordWrap: { width: 860 },
    })
    .setOrigin(0.5, 0);
}

export function menuButton(
  scene: Phaser.Scene,
  y: number,
  label: string,
  onClick: () => void,
  opts?: { small?: boolean },
): Phaser.GameObjects.Container {
  const w = opts?.small ? 300 : 380;
  const h = opts?.small ? 40 : 52;
  const bg = scene.add.rectangle(0, 0, w, h, 0x1c2450).setStrokeStyle(2, 0x6f7bd9);
  const t = scene.add
    .text(0, 0, label, {
      fontFamily: '"Courier New", monospace',
      fontSize: opts?.small ? '16px' : '20px',
      color: '#ffffff',
    })
    .setOrigin(0.5);
  const c = scene.add.container(480, y, [bg, t]);
  c.setSize(w, h);
  c.setInteractive({ useHandCursor: true });
  c.on('pointerover', () => bg.setFillStyle(0x2b3a67));
  c.on('pointerout', () => bg.setFillStyle(0x1c2450));
  c.on('pointerdown', () => {
    AudioBus.unlock();
    AudioBus.click();
    scene.tweens.add({ targets: c, scale: 0.96, duration: 60, yoyo: true });
    onClick();
  });
  return c;
}

export function bgStars(scene: Phaser.Scene): void {
  scene.cameras.main.setBackgroundColor('#0b1020');
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * 960;
    const y = Math.random() * 540;
    const s = Math.random() < 0.2 ? 2 : 1;
    scene.add.rectangle(x, y, s, s, 0xffffff, 0.25 + Math.random() * 0.5);
  }
  scene.add.rectangle(480, 470, 960, 140, 0x141c3d);
  scene.add.rectangle(480, 402, 960, 4, 0x2b3a67);
}
