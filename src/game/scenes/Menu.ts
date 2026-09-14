import Phaser from 'phaser';
import { SceneKeys, TextureKeys, UI_FONT } from '../constants';
import { SaveService } from '../services/save';
import { AudioBus } from '../systems/audio';
import { bgStars, bodyText, menuButton, subtitleText, titleText } from '../ui/menu';

export class Menu extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Menu);
  }

  create(): void {
    bgStars(this);
    const save = SaveService.load();
    AudioBus.setMuted(save.muted);

    titleText(this, 70, '2DilesZ', 46);
    subtitleText(this, 116, '— EL FARO PERDIDO —');
    bodyText(
      this,
      148,
      `Reactiva los 6 faros de la montaña.\nSalta, esquiva, derrota enemigos y combina power-ups.\nRécord total: ${save.totalBest} pts · Nivel desbloqueado: ${save.unlocked}/6`,
      14,
    );

    // fila decorativa: espíritu, sombra, murciélago, moneda y engranaje
    const deco = [
      TextureKeys.Spirit,
      TextureKeys.ShadeA,
      TextureKeys.BatA,
      TextureKeys.CoinOrb,
      TextureKeys.GearA,
    ];
    deco.forEach((tex, i) => {
      const img = this.add.image(360 + i * 60, 254, tex).setScale(0.5);
      this.tweens.add({
        targets: img,
        y: 246,
        duration: 700 + i * 120,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    menuButton(this, 304, '▶  JUGAR', () => {
      this.scene.start(SceneKeys.Game, { level: save.unlocked });
    }, { primary: true });
    menuButton(this, 360, 'NIVELES', () => this.showLevels(save.unlocked));
    menuButton(this, 416, 'CÓMO JUGAR', () => this.scene.start(SceneKeys.HowTo));
    menuButton(this, 472, `AJUSTES  (sonido: ${save.muted ? 'OFF' : 'ON'})`, () =>
      this.scene.start(SceneKeys.Settings),
    );

    this.add
      .text(
        480,
        520,
        'WASD/flechas + ESPACIO · SHIFT dash · P pausa · táctil en móvil',
        {
          fontFamily: UI_FONT,
          fontSize: '13px',
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
