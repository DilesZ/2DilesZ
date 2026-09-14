import Phaser from 'phaser';
import { SceneKeys } from '../constants';
import { SaveService } from '../services/save';
import { AudioBus } from '../systems/audio';
import { bgStars, bodyText, menuButton, titleText } from '../ui/menu';

export class Menu extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Menu);
  }

  create(): void {
    bgStars(this);
    const save = SaveService.load();
    AudioBus.setMuted(save.muted);

    titleText(this, 84, '2DilesZ');
    this.add
      .text(480, 132, '— EL FARO PERDIDO —', {
        fontFamily: '"Courier New", monospace',
        fontSize: '20px',
        color: '#9aa3c7',
      })
      .setOrigin(0.5);
    bodyText(
      this,
      168,
      `Reactiva los 6 faros de la montaña.\nSalta, esquiva, derrota enemigos y combina power-ups.\nRécord total: ${save.totalBest} pts · Nivel desbloqueado: ${save.unlocked}/6`,
      15,
    );

    menuButton(this, 300, '▶  JUGAR', () => {
      this.scene.start(SceneKeys.Game, { level: save.unlocked });
    });
    menuButton(this, 360, 'NIVELES', () => this.showLevels(save.unlocked));
    menuButton(this, 420, 'CÓMO JUGAR', () => this.scene.start(SceneKeys.HowTo));
    menuButton(this, 480, `AJUSTES  (sonido: ${save.muted ? 'OFF' : 'ON'})`, () =>
      this.scene.start(SceneKeys.Settings),
    );

    this.add
      .text(
        480,
        516,
        'WASD/flechas + ESPACIO · SHIFT dash · P pausa · táctil en móvil',
        {
          fontFamily: '"Courier New", monospace',
          fontSize: '12px',
          color: '#9aa3c7',
        },
      )
      .setOrigin(0.5);

    this.input.keyboard?.on('keydown-SPACE', () => {
      AudioBus.unlock();
      this.scene.start(SceneKeys.Game, { level: save.unlocked });
    });
  }

  private showLevels(unlocked: number): void {
    AudioBus.click();
    const save = SaveService.load();
    this.children.removeAll();
    bgStars(this);
    titleText(this, 70, 'NIVELES', 34);
    for (let i = 1; i <= 6; i++) {
      const y = 140 + (i - 1) * 52;
      const locked = i > unlocked;
      const best = save.best[i] ? ` · récord ${save.best[i]}` : '';
      menuButton(this, y, locked ? `🔒 Nivel ${i}` : `Nivel ${i}${best}`, () => {
        if (locked) return;
        this.scene.start(SceneKeys.Game, { level: i });
      });
    }
    menuButton(this, 480, '← VOLVER', () => this.scene.restart(), { small: true });
  }
}
