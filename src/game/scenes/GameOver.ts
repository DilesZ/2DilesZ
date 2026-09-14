import Phaser from 'phaser';
import { SceneKeys } from '../constants';
import { bgStars, bodyText, menuButton, titleText } from '../ui/menu';
import { AudioBus } from '../systems/audio';

export class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GameOver);
  }

  create(data: { level: number; score: number }): void {
    bgStars(this);
    AudioBus.lose();
    titleText(this, 120, 'GAME OVER', 46);
    bodyText(this, 220, `Nivel ${data.level} · Puntos: ${data.score}\nEl faro sigue apagado… ¡inténtalo de nuevo!`);
    menuButton(this, 340, '↻ REINTENTAR', () => this.scene.start(SceneKeys.Game, { level: data.level }));
    menuButton(this, 400, 'MENÚ', () => this.scene.start(SceneKeys.Menu));
  }
}
