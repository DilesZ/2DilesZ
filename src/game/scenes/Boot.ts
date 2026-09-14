import Phaser from 'phaser';
import { POWERUP_META, SceneKeys, TextureKeys, type PowerUpKind } from '../constants';

/** Genera todo el pixel-art en tiempo de ejecución. Cero assets externos, cero licencias. */
export class Boot extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create(): void {
    this.makePlayer();
    this.makeWalker();
    this.makeFlyer();
    this.makeGolem();
    this.makeCoin();
    this.makeDot();
    this.makeSpike();
    this.makeSaw();
    this.makeCheckpoint(false);
    this.makeCheckpoint(true);
    this.makeGoal();
    this.makePowerups();
    this.scene.start(SceneKeys.Menu);
  }

  private g(): Phaser.GameObjects.Graphics {
    return this.make.graphics({ x: 0, y: 0 }, false);
  }

  private gen(g: Phaser.GameObjects.Graphics, key: string, w: number, h: number): void {
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private makePlayer(): void {
    const g = this.g();
    // 16x20 farero con chubasquero amarillo
    g.fillStyle(0x222222, 1).fillRect(2, 17, 4, 3).fillRect(10, 17, 4, 3); // botas
    g.fillStyle(0xffd23f, 1).fillRect(3, 9, 10, 8); // cuerpo
    g.fillStyle(0xc98d5e, 1).fillRect(4, 4, 8, 5); // cara
    g.fillStyle(0x111111, 1).fillRect(5, 6, 2, 2).fillRect(9, 6, 2, 2); // ojos
    g.fillStyle(0xff5d5d, 1).fillRect(3, 1, 10, 3); // gorra
    g.fillStyle(0xffffff, 1).fillRect(7, 0, 2, 1);
    this.gen(g, TextureKeys.Player, 16, 20);
  }

  private makeWalker(): void {
    const g = this.g();
    g.fillStyle(0xd23b3b, 1).fillRect(2, 4, 16, 8); // cuerpo cangrejo
    g.fillStyle(0x7e1d1d, 1).fillRect(2, 10, 16, 2);
    g.fillStyle(0xffffff, 1).fillRect(5, 2, 3, 3).fillRect(12, 2, 3, 3);
    g.fillStyle(0x111111, 1).fillRect(6, 3, 1, 1).fillRect(13, 3, 1, 1);
    g.fillStyle(0xd23b3b, 1).fillRect(0, 6, 2, 3).fillRect(18, 6, 2, 3); // pinzas
    g.fillStyle(0x7e1d1d, 1);
    g.fillRect(4, 12, 2, 2).fillRect(9, 12, 2, 2).fillRect(14, 12, 2, 2); // patas
    this.gen(g, TextureKeys.Walker, 20, 14);
  }

  private makeFlyer(): void {
    const g = this.g();
    g.fillStyle(0x8a5cff, 1).fillRect(0, 5, 6, 4).fillRect(14, 5, 6, 4); // alas
    g.fillStyle(0x5b34b8, 1).fillRect(7, 3, 6, 10); // cuerpo
    g.fillStyle(0xffffff, 1).fillRect(8, 5, 2, 2).fillRect(11, 5, 2, 2);
    g.fillStyle(0xffd23f, 1).fillRect(9, 6, 1, 1).fillRect(12, 6, 1, 1);
    this.gen(g, TextureKeys.Flyer, 20, 16);
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

  private makeCoin(): void {
    const g = this.g();
    g.fillStyle(0xffd23f, 1).fillCircle(6, 6, 5);
    g.fillStyle(0xb8860b, 1).fillCircle(6, 6, 5).fillStyle(0xffd23f, 1).fillCircle(6, 6, 4);
    g.fillStyle(0xfff3b0, 1).fillRect(4, 3, 2, 2);
    this.gen(g, TextureKeys.Coin, 12, 12);
  }

  private makeDot(): void {
    const g = this.g();
    g.fillStyle(0xffffff, 1).fillRect(0, 0, 4, 4);
    this.gen(g, TextureKeys.Dot, 4, 4);
  }

  private makeSpike(): void {
    const g = this.g();
    g.fillStyle(0x9ca3af, 1);
    g.fillTriangle(0, 16, 8, 0, 16, 16);
    g.fillStyle(0x4b5563, 1).fillTriangle(4, 16, 8, 8, 12, 16);
    this.gen(g, TextureKeys.Spike, 16, 16);
  }

  private makeSaw(): void {
    const g = this.g();
    g.fillStyle(0xd1d5db, 1).fillCircle(10, 10, 9);
    g.fillStyle(0x6b7280, 1).fillCircle(10, 10, 6);
    g.fillStyle(0x374151, 1).fillCircle(10, 10, 2);
    g.fillStyle(0xd1d5db, 1);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.fillRect(10 + Math.cos(a) * 8 - 1, 10 + Math.sin(a) * 8 - 1, 3, 3);
    }
    this.gen(g, TextureKeys.Saw, 20, 20);
  }

  private makeCheckpoint(on: boolean): void {
    const g = this.g();
    g.fillStyle(0x6b7280, 1).fillRect(3, 2, 2, 22); // mástil
    g.fillStyle(on ? 0x35ff70 : 0x4b5563, 1).fillRect(5, 3, 9, 6); // bandera
    g.fillStyle(0x9ca3af, 1).fillRect(0, 22, 8, 2);
    this.gen(g, on ? TextureKeys.CheckpointOn : TextureKeys.Checkpoint, 16, 24);
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
    const kinds = Object.keys(POWERUP_META) as PowerUpKind[];
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
