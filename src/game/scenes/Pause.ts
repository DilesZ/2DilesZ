import Phaser from 'phaser';
import { SceneKeys, UI_FONT } from '../constants';
import { AudioBus } from '../systems/audio';
import { menuButton, titleText } from '../ui/menu';

export class Pause extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Pause);
  }

  create(data: { level: number }): void {
    const level = data.level ?? 1;
    this.add.rectangle(480, 270, 960, 540, 0x02040e, 0.72);
    titleText(this, 150, '❚❚ PAUSA', 38);
    menuButton(this, 258, '▶ CONTINUAR (P)', () => {
      this.scene.stop();
      this.scene.resume(SceneKeys.Game);
    });
    menuButton(this, 320, '↻ REINICIAR NIVEL', () => {
      this.scene.stop();
      this.scene.stop(SceneKeys.Game);
      this.scene.start(SceneKeys.Game, { level });
    });
    menuButton(this, 382, 'SALIR AL MENÚ', () => {
      this.scene.stop();
      this.scene.stop(SceneKeys.Game);
      this.scene.start(SceneKeys.Menu);
    });
    this.add
      .text(480, 440, 'P / ESC para continuar', {
        fontFamily: UI_FONT,
        fontSize: '14px',
        color: '#9aa3c7',
      })
      .setOrigin(0.5);
    const resume = () => {
      if (!this.scene.isActive()) return;
      AudioBus.click();
      this.scene.stop();
      this.scene.resume(SceneKeys.Game);
    };
    this.input.keyboard?.on('keydown-P', resume);
    this.input.keyboard?.on('keydown-ESC', resume);
  }
}
