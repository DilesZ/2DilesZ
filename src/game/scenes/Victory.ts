import Phaser from 'phaser';
import { SceneKeys } from '../constants';
import { SaveService } from '../services/save';
import { bgStars, bodyText, menuButton, titleText } from '../ui/menu';
import { AudioBus } from '../systems/audio';

export class Victory extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Victory);
  }

  create(data: { score: number; timeMs: number }): void {
    bgStars(this);
    AudioBus.win();
    const save = SaveService.load();
    titleText(this, 100, '¡FARO ENCENDIDO!', 40);
    const secs = Math.floor(data.timeMs / 1000);
    bodyText(
      this,
      190,
      `Has reactivado los 6 faros. La montaña vuelve a brillar.\n\nPuntos del nivel: ${data.score}\nTiempo: ${secs}s\nRécord total: ${save.totalBest}`,
    );
    // confeti simple
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 960;
      const r = this.add.rectangle(x, -10, 5, 5, [0xffd23f, 0x35d0ff, 0xff5d5d, 0x9dff57][i % 4]);
      this.tweens.add({ targets: r, y: 560, duration: 1800 + Math.random() * 1600, repeat: -1, delay: Math.random() * 1500 });
    }
    menuButton(this, 380, '↻ JUGAR OTRA VEZ (nivel 1)', () => this.scene.start(SceneKeys.Game, { level: 1 }));
    menuButton(this, 440, 'MENÚ', () => this.scene.start(SceneKeys.Menu));
  }
}
