import Phaser from 'phaser';
import { POWERUP_META, SceneKeys, TextureKeys, type PowerUpKind } from '../constants';

/** Genera todo el pixel-art en tiempo de ejecución. Cero assets externos, cero licencias. */
export class Boot extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create(): void {
    // Kenney (vía Preloader) aporta jugador, enemigos, moneda, pinchos, sierras y flags.
    // Aquí solo se genera lo propio: gólem, faro, partículas e iconos de power-ups.
    this.makeGolem();
    this.makeDot();
    this.makeGoal();
    this.makePowerups();
    this.scene.start(SceneKeys.Preloader);
  }

  private g(): Phaser.GameObjects.Graphics {
    return this.make.graphics({ x: 0, y: 0 }, false);
  }

  private gen(g: Phaser.GameObjects.Graphics, key: string, w: number, h: number): void {
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private makeGolem(): void {
    const g = this.g();
    g.fillStyle(0x6b7280, 1).fillRect(2, 2, 24, 24);
    g.fillStyle(0x4b5563, 1).fillRect(2, 20, 24, 6).fillRect(2, 2, 24, 4);
    g.fillStyle(0x9ca3af, 1).fillRect(5, 6, 18, 4);
    g.fillStyle(0xff3b3b, 1).fillRect(7, 10, 4, 4).fillRect(17, 10, 4, 4); // ojos
    g.fillStyle(0x374151, 1).fillRect(9, 18, 10, 3); // boca
    this.gen(g, TextureKeys.Golem, 28, 28);
  }

  private makeDot(): void {
    const g = this.g();
    g.fillStyle(0xffffff, 1).fillRect(0, 0, 4, 4);
    this.gen(g, TextureKeys.Dot, 4, 4);
  }

  private makeGoal(): void {
    const g = this.g();
    // faro 32x48
    g.fillStyle(0xe8ecff, 1).fillRect(10, 14, 12, 26);
    g.fillStyle(0xff5d5d, 1).fillRect(10, 18, 12, 5).fillRect(10, 28, 12, 5);
    g.fillStyle(0x374151, 1).fillRect(8, 6, 16, 8); // linterna
    g.fillStyle(0xffd23f, 1).fillRect(10, 8, 12, 4); // luz
    g.fillStyle(0xff5d5d, 1).fillTriangle(8, 6, 16, 0, 24, 6);
    g.fillStyle(0x2b3a67, 1).fillRect(4, 40, 24, 8);
    this.gen(g, TextureKeys.Goal, 32, 48);
  }

  private makePowerups(): void {
    // Solo los iconos propios; corazón y estrella usan PNG Kenney.
    const kinds: PowerUpKind[] = ['boots', 'feather', 'shield', 'magnet', 'dash'];
    for (const kind of kinds) {
      const col = POWERUP_META[kind].color;
      const g = this.g();
      g.fillStyle(0x0b1020, 1).fillRect(0, 0, 18, 18);
      g.fillStyle(col, 1).fillRect(1, 1, 16, 16);
      g.fillStyle(0x0b1020, 1);
      // glifo simple por tipo
      if (kind === 'boots') g.fillRect(4, 10, 10, 4).fillRect(10, 5, 4, 6);
      else if (kind === 'feather') g.fillRect(8, 3, 2, 12).fillRect(5, 6, 8, 2);
      else if (kind === 'shield') g.fillRect(4, 4, 10, 8).fillRect(6, 12, 6, 2);
      else if (kind === 'magnet') g.fillRect(4, 4, 3, 9).fillRect(11, 4, 3, 9).fillRect(4, 11, 10, 3);
      else if (kind === 'star') g.fillRect(8, 3, 2, 12).fillRect(3, 8, 12, 2);
      else if (kind === 'heart') g.fillRect(5, 5, 8, 6).fillRect(7, 11, 4, 3);
      else g.fillRect(3, 6, 7, 2).fillRect(8, 4, 2, 10).fillRect(10, 6, 5, 2); // dash →
      g.lineStyle(1, 0xffffff, 0.9).strokeRect(1, 1, 16, 16);
      g.generateTexture(`px-pow-${kind}`, 18, 18);
      g.destroy();
    }
  }
}
