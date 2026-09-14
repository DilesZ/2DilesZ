import Phaser from 'phaser';
import { SceneKeys } from '../constants';
import { AudioBus } from '../systems/audio';

export class Pause extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Pause);
  }

  create(data: { level: number }): void {
    const level = data.level ?? 1;
    this.add.rectangle(480, 270, 960, 540, 0x000000, 0.6);
    this.add
      .text(480, 170, '❚❚ PAUSA', {
        fontFamily: '"Courier New", monospace',
        fontSize: '36px',
        color: '#ffd23f',
        stroke: '#000',
        strokeThickness: 5,
      })
      .setOrigin(0.5);
    const btn = (y: number, label: string, fn: () => void) => {
      const bg = this.add.rectangle(480, y, 320, 48, 0x1c2450).setStrokeStyle(2, 0x6f7bd9);
      const t = this.add
        .text(480, y, label, { fontFamily: '"Courier New", monospace', fontSize: '18px', color: '#fff' })
        .setOrigin(0.5);
      const c = this.add.container(0, 0);
      void c;
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerover', () => bg.setFillStyle(0x2b3a67));
      bg.on('pointerout', () => bg.setFillStyle(0x1c2450));
      bg.on('pointerdown', () => {
        AudioBus.click();
        fn();
      });
      void t;
    };
    btn(260, '▶ CONTINUAR (P)', () => {
      this.scene.stop();
      this.scene.resume(SceneKeys.Game);
    });
    btn(320, '↻ REINICIAR NIVEL', () => {
      this.scene.stop();
      this.scene.stop(SceneKeys.Game);
      this.scene.start(SceneKeys.Game, { level });
    });
    btn(380, 'SALIR AL MENÚ', () => {
      this.scene.stop();
      this.scene.stop(SceneKeys.Game);
      this.scene.start(SceneKeys.Menu);
    });
    this.input.keyboard?.on('keydown-P', () => {
      this.scene.stop();
      this.scene.resume(SceneKeys.Game);
    });
    this.input.keyboard?.on('keydown-ESC', () => {
      this.scene.stop();
      this.scene.resume(SceneKeys.Game);
    });
  }
}
