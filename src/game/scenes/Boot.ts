import Phaser from 'phaser';
import { PALETTE, SceneKeys, TextureKeys, type PowerUpKind } from '../constants';

/**
 * Boot v2 "Neon Night": todo el arte se pinta por código con Canvas2D
 * (degradados, glows, siluetas). Cero assets externos, cero licencias.
 */
export class Boot extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create(): void {
    this.paintAll();
    void this.waitForFont().then(() => this.scene.start(SceneKeys.Menu));
  }

  private async waitForFont(): Promise<void> {
    try {
      const want = Promise.all([
        document.fonts.load('800 40px "Baloo 2"'),
        document.fonts.load('700 16px "Baloo 2"'),
      ]).then(() => undefined);
      await Promise.race([want, new Promise((r) => setTimeout(r, 900))]);
    } catch {
      /* fallback del sistema */
    }
  }

  // ---------- utilidades ----------

  private cv(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return [c, c.getContext('2d')!];
  }

  private put(key: string, c: HTMLCanvasElement): void {
    if (this.textures.exists(key)) this.textures.remove(key);
    this.textures.addCanvas(key, c);
  }

  private rng(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private paintAll(): void {
    this.makeGlow();
    this.makeSoftDot();
    this.makeSpirit('open', TextureKeys.Spirit);
    this.makeSpirit('blink', TextureKeys.SpiritBlink);
    this.makeSpirit('hurt', TextureKeys.SpiritHurt);
    this.makeSpirit('jump', TextureKeys.SpiritJump);
    this.makeShade(false, TextureKeys.ShadeA);
    this.makeShade(true, TextureKeys.ShadeB);
    this.makeBat(true, TextureKeys.BatA);
    this.makeBat(false, TextureKeys.BatB);
    this.makeGear(0, TextureKeys.GearA);
    this.makeGear(1, TextureKeys.GearB);
    this.makeCoinOrb();
    this.makeSpikes();
    this.makeBeacon(false);
    this.makeBeacon(true);
    this.makeTileNight();
    this.makePlankNight();
    this.makeGolem();
    this.makeGoal();
    this.makeBeam();
    this.makeFog();
    this.makeRidge(PALETTE.ridgeFar, 7, 0.5, TextureKeys.RidgeFar);
    this.makeRidge(PALETTE.ridgeMid, 21, 0.65, TextureKeys.RidgeMid);
    this.makeRidge(PALETTE.ridgeNear, 42, 0.8, TextureKeys.RidgeNear);
    this.makeAurora('#46f0c8', TextureKeys.AuroraA);
    this.makeAurora('#8a5cff', TextureKeys.AuroraB);
    this.makeVignette();
    this.makePowerups();
  }

  // ---------- glows y partículas ----------

  private makeGlow(): void {
    const [c, ctx] = this.cv(128, 128);
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    this.put(TextureKeys.Glow, c);
  }

  private makeSoftDot(): void {
    const [c, ctx] = this.cv(32, 32);
    const g = ctx.createRadialGradient(16, 16, 1, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    this.put(TextureKeys.SoftDot, c);
  }

  // ---------- protagonista: espíritu de luz ----------

  private makeSpirit(variant: 'open' | 'blink' | 'hurt' | 'jump', key: string): void {
    const [c, ctx] = this.cv(76, 88);
    // cuerpo
    const body = ctx.createRadialGradient(30, 40, 6, 38, 50, 34);
    body.addColorStop(0, '#fffbeF');
    body.addColorStop(0.55, '#ffe27a');
    body.addColorStop(1, '#eda12c');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(38, 52, 26, 29, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(146,64,14,0.45)';
    ctx.stroke();
    // barriga clara
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(38, 62, 15, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // mejillas
    ctx.fillStyle = 'rgba(255,120,80,0.5)';
    ctx.beginPath();
    ctx.arc(23, 58, 5, 0, Math.PI * 2);
    ctx.arc(53, 58, 5, 0, Math.PI * 2);
    ctx.fill();
    // ojos / boca
    ctx.fillStyle = '#2b2140';
    ctx.strokeStyle = '#2b2140';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    if (variant === 'open') {
      ctx.beginPath();
      ctx.ellipse(30, 48, 4, 5.5, 0, 0, Math.PI * 2);
      ctx.ellipse(46, 48, 4, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(31.5, 46, 1.6, 0, Math.PI * 2);
      ctx.arc(47.5, 46, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(38, 58, 4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    } else if (variant === 'blink') {
      for (const x of [30, 46]) {
        ctx.beginPath();
        ctx.arc(x, 48, 4, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(38, 58, 4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    } else if (variant === 'hurt') {
      for (const x of [30, 46]) {
        ctx.beginPath();
        ctx.moveTo(x - 4, 44);
        ctx.lineTo(x + 4, 52);
        ctx.moveTo(x + 4, 44);
        ctx.lineTo(x - 4, 52);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.ellipse(38, 62, 3.5, 4.5, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(30, 47, 4.5, 7, 0, 0, Math.PI * 2);
      ctx.ellipse(46, 47, 4.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(31.5, 44.5, 1.8, 0, Math.PI * 2);
      ctx.arc(47.5, 44.5, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b2140';
      ctx.beginPath();
      ctx.ellipse(38, 62, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // gorra de farero
    ctx.fillStyle = '#e8404f';
    ctx.beginPath();
    ctx.arc(38, 32, 21, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.arc(38, 32, 21, -0.45 * Math.PI, 0);
    ctx.lineTo(38, 32);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#a81626';
    ctx.beginPath();
    ctx.ellipse(38, 32, 27, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath();
    ctx.arc(38, 10, 3.5, 0, Math.PI * 2);
    ctx.fill();
    this.put(key, c);
  }

  // ---------- enemigos de sombra ----------

  private makeShade(squash: boolean, key: string): void {
    const [c, ctx] = this.cv(64, 52);
    const ry = squash ? 13 : 16;
    const ey = squash ? 28 : 25;
    const g = ctx.createLinearGradient(0, 6, 0, 48);
    g.addColorStop(0, '#3b3370');
    g.addColorStop(1, '#12102b');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(32, 32, 24, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(140,125,255,0.55)';
    ctx.beginPath();
    ctx.ellipse(32, 32, 24, ry, 0, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.save();
    ctx.shadowColor = '#8a5cff';
    ctx.shadowBlur = 9;
    ctx.fillStyle = '#c4aaff';
    ctx.beginPath();
    ctx.ellipse(24, ey, 5, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(40, ey, 5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#0b0920';
    ctx.fillRect(22.5, ey - 1, 3, 7);
    ctx.fillRect(38.5, ey - 1, 3, 7);
    this.put(key, c);
  }

  private makeBat(wingsUp: boolean, key: string): void {
    const [c, ctx] = this.cv(76, 56);
    ctx.fillStyle = '#1d1840';
    for (const s of [-1, 1]) {
      ctx.save();
      ctx.translate(38 + s * 8, 30);
      ctx.rotate(s * (wingsUp ? -0.7 : 0.55));
      ctx.beginPath();
      ctx.ellipse(s * 16, wingsUp ? -8 : 4, 17, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // orejas
    ctx.fillStyle = '#1d1840';
    ctx.beginPath();
    ctx.moveTo(30, 22);
    ctx.lineTo(33, 10);
    ctx.lineTo(37, 22);
    ctx.moveTo(46, 22);
    ctx.lineTo(43, 10);
    ctx.lineTo(39, 22);
    ctx.fill();
    const g = ctx.createLinearGradient(0, 18, 0, 50);
    g.addColorStop(0, '#352b66');
    g.addColorStop(1, '#151130');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(38, 34, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.shadowColor = '#46f0f0';
    ctx.shadowBlur = 9;
    ctx.fillStyle = '#8ffaff';
    ctx.beginPath();
    ctx.arc(34, 32, 3, 0, Math.PI * 2);
    ctx.arc(42, 32, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(34, 42);
    ctx.lineTo(35.5, 46);
    ctx.lineTo(37, 42);
    ctx.moveTo(39, 42);
    ctx.lineTo(40.5, 46);
    ctx.lineTo(42, 42);
    ctx.fill();
    this.put(key, c);
  }

  private makeGear(offset: number, key: string): void {
    const [c, ctx] = this.cv(76, 76);
    ctx.translate(38, 38);
    // dientes
    for (let i = 0; i < 8; i++) {
      ctx.save();
      ctx.rotate(((i * 45 + offset * 22.5) * Math.PI) / 180);
      const tg = ctx.createLinearGradient(0, -36, 0, -20);
      tg.addColorStop(0, '#ff9a3c');
      tg.addColorStop(1, '#8a3c10');
      ctx.fillStyle = tg;
      ctx.fillRect(-6, -37, 12, 15);
      ctx.restore();
    }
    const g = ctx.createRadialGradient(-6, -8, 4, 0, 0, 26);
    g.addColorStop(0, '#4d4778');
    g.addColorStop(1, '#201c3a');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.shadowColor = '#ff9a3c';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ff9a3c';
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#141126';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    this.put(key, c);
  }

  // ---------- objetos ----------

  private makeCoinOrb(): void {
    const [c, ctx] = this.cv(52, 52);
    const halo = ctx.createRadialGradient(26, 26, 4, 26, 26, 26);
    halo.addColorStop(0, 'rgba(255,210,63,0.6)');
    halo.addColorStop(1, 'rgba(255,210,63,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 52, 52);
    const core = ctx.createRadialGradient(23, 22, 2, 26, 26, 15);
    core.addColorStop(0, '#fff6c8');
    core.addColorStop(0.6, '#ffd23f');
    core.addColorStop(1, '#d88f14');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(26, 26, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff0b8';
    ctx.beginPath();
    ctx.arc(26, 26, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(26, 6);
    ctx.lineTo(26, 13);
    ctx.moveTo(22.5, 9.5);
    ctx.lineTo(29.5, 9.5);
    ctx.stroke();
    this.put(TextureKeys.CoinOrb, c);
  }

  private makeSpikes(): void {
    const [c, ctx] = this.cv(76, 44);
    ctx.fillStyle = '#22263f';
    ctx.beginPath();
    ctx.roundRect(4, 36, 68, 8, 3);
    ctx.fill();
    for (const x of [10, 29, 48]) {
      const g = ctx.createLinearGradient(0, 8, 0, 38);
      g.addColorStop(0, '#8b93c4');
      g.addColorStop(1, '#2a2f52');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x, 38);
      ctx.lineTo(x + 9, 8);
      ctx.lineTo(x + 18, 38);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#8ff5ff';
      ctx.beginPath();
      ctx.moveTo(x + 9, 8);
      ctx.lineTo(x + 12, 24);
      ctx.lineTo(x + 9, 30);
      ctx.lineTo(x + 7, 20);
      ctx.closePath();
      ctx.fill();
    }
    this.put(TextureKeys.SpikeNeon, c);
  }

  private makeBeacon(on: boolean): void {
    const [c, ctx] = this.cv(60, 100);
    // poste de piedra
    const stone = ctx.createLinearGradient(20, 0, 44, 0);
    stone.addColorStop(0, '#454b78');
    stone.addColorStop(0.5, '#2c3157');
    stone.addColorStop(1, '#1b1f3a');
    ctx.fillStyle = stone;
    ctx.beginPath();
    ctx.roundRect(22, 38, 16, 54, 5);
    ctx.fill();
    ctx.fillStyle = '#14172e';
    ctx.beginPath();
    ctx.roundRect(15, 88, 30, 9, 3);
    ctx.fill();
    // musgo
    ctx.fillStyle = 'rgba(70,240,200,0.5)';
    for (const [x, y, r] of [[24, 60, 2], [36, 70, 2.5], [28, 80, 2]] as const) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // orbe
    if (on) {
      const halo = ctx.createRadialGradient(30, 24, 2, 30, 24, 26);
      halo.addColorStop(0, 'rgba(120,255,220,0.85)');
      halo.addColorStop(1, 'rgba(70,240,200,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, 60, 54);
      ctx.save();
      ctx.shadowColor = '#46f0c8';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#eafff7';
      ctx.beginPath();
      ctx.arc(30, 24, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#484e75';
      ctx.beginPath();
      ctx.arc(30, 24, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.arc(30, 24, 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    this.put(on ? TextureKeys.BeaconOn : TextureKeys.BeaconOff, c);
  }

  private makeTileNight(): void {
    const [c, ctx] = this.cv(64, 64);
    const base = ctx.createLinearGradient(0, 0, 0, 64);
    base.addColorStop(0, '#2a2f52');
    base.addColorStop(1, '#171b33');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 64, 64);
    const rnd = this.rng(99);
    for (let i = 0; i < 46; i++) {
      ctx.fillStyle = rnd() > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.12)';
      ctx.fillRect(Math.floor(rnd() * 64), 20 + Math.floor(rnd() * 44), 2, 2);
    }
    // musgo neón con borde ondulado
    const moss = ctx.createLinearGradient(0, 0, 0, 22);
    moss.addColorStop(0, '#5ff5cb');
    moss.addColorStop(1, '#1d9e6b');
    ctx.fillStyle = moss;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(64, 0);
    ctx.lineTo(64, 14);
    for (let x = 64; x > 0; x -= 16) {
      ctx.arc(x - 8, 14, 8, 0, Math.PI, false);
    }
    ctx.lineTo(0, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c8ffe9';
    ctx.fillRect(0, 0, 64, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, 20, 64, 3);
    this.put(TextureKeys.TileNight, c);
  }

  private makePlankNight(): void {
    const [c, ctx] = this.cv(64, 64);
    ctx.fillStyle = '#171008';
    ctx.fillRect(0, 0, 64, 64);
    for (const y of [0, 33]) {
      const p = ctx.createLinearGradient(0, y, 0, y + 29);
      p.addColorStop(0, '#54402c');
      p.addColorStop(1, '#2c2015');
      ctx.fillStyle = p;
      ctx.fillRect(0, y + 1, 64, 29);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, y + 8 + i * 8);
        ctx.bezierCurveTo(20, y + 6 + i * 8, 44, y + 10 + i * 8, 64, y + 8 + i * 8);
        ctx.stroke();
      }
    }
    ctx.fillStyle = 'rgba(255,210,63,0.3)';
    ctx.fillRect(0, 1, 64, 2);
    ctx.fillStyle = '#100b06';
    for (const [x, y] of [[6, 8], [58, 8], [6, 41], [58, 41]] as const) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    this.put(TextureKeys.PlankNight, c);
  }

  private makeGolem(): void {
    const [c, ctx] = this.cv(60, 60);
    const g = ctx.createRadialGradient(24, 20, 6, 30, 30, 32);
    g.addColorStop(0, '#4a4e7d');
    g.addColorStop(1, '#17182e');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(6, 8, 48, 46, 10);
    ctx.fill();
    ctx.save();
    ctx.shadowColor = '#8a5cff';
    ctx.shadowBlur = 7;
    ctx.strokeStyle = '#9a7bff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, 40);
    ctx.lineTo(24, 30);
    ctx.lineTo(20, 20);
    ctx.moveTo(46, 42);
    ctx.lineTo(38, 32);
    ctx.lineTo(44, 22);
    ctx.stroke();
    ctx.fillStyle = '#ff6a3c';
    ctx.shadowBlur = 10;
    ctx.fillRect(17, 22, 9, 6);
    ctx.fillRect(35, 22, 9, 6);
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(6, 46, 48, 8);
    this.put(TextureKeys.Golem, c);
  }

  private makeGoal(): void {
    const [c, ctx] = this.cv(76, 128);
    // roca base
    ctx.fillStyle = '#14172e';
    ctx.beginPath();
    ctx.ellipse(38, 118, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // torre
    const tower = ctx.createLinearGradient(20, 0, 56, 0);
    tower.addColorStop(0, '#eef1ff');
    tower.addColorStop(0.6, '#c3cbf0');
    tower.addColorStop(1, '#8f9bd0');
    ctx.fillStyle = tower;
    ctx.beginPath();
    ctx.moveTo(23, 112);
    ctx.lineTo(28, 44);
    ctx.lineTo(48, 44);
    ctx.lineTo(53, 112);
    ctx.closePath();
    ctx.fill();
    // franjas rojas
    ctx.fillStyle = '#e8404f';
    ctx.fillRect(25, 66, 26, 10);
    ctx.fillRect(26.5, 90, 23, 10);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(40, 66, 11, 10);
    ctx.fillRect(40, 90, 9, 10);
    // puerta
    ctx.fillStyle = '#23263f';
    ctx.beginPath();
    ctx.moveTo(33, 112);
    ctx.lineTo(33, 102);
    ctx.arc(38, 102, 5, Math.PI, 0);
    ctx.lineTo(43, 112);
    ctx.closePath();
    ctx.fill();
    // galería + linterna
    ctx.fillStyle = '#23263f';
    ctx.fillRect(22, 36, 32, 8);
    ctx.save();
    ctx.shadowColor = '#ffcf4d';
    ctx.shadowBlur = 16;
    const lamp = ctx.createLinearGradient(0, 16, 0, 36);
    lamp.addColorStop(0, '#fff6c8');
    lamp.addColorStop(1, '#ffb63c');
    ctx.fillStyle = lamp;
    ctx.fillRect(27, 16, 22, 20);
    ctx.restore();
    ctx.fillStyle = '#23263f';
    for (const x of [27, 33, 39, 45]) ctx.fillRect(x, 16, 2, 20);
    // cúpula
    ctx.fillStyle = '#e8404f';
    ctx.beginPath();
    ctx.arc(38, 16, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd23f';
    ctx.beginPath();
    ctx.arc(38, 2, 3, 0, Math.PI * 2);
    ctx.fill();
    this.put(TextureKeys.Goal, c);
  }

  private makeBeam(): void {
    const [c, ctx] = this.cv(256, 128);
    for (const [w, a] of [[120, 0.16], [76, 0.3], [36, 0.5]] as const) {
      const g = ctx.createLinearGradient(0, 0, 256, 0);
      g.addColorStop(0, `rgba(255,240,190,${a})`);
      g.addColorStop(1, 'rgba(255,240,190,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 64);
      ctx.lineTo(256, 64 - w / 2);
      ctx.lineTo(256, 64 + w / 2);
      ctx.closePath();
      ctx.fill();
    }
    this.put(TextureKeys.Beam, c);
  }

  private makeFog(): void {
    const [c, ctx] = this.cv(480, 120);
    const rnd = this.rng(5);
    for (let i = 0; i < 9; i++) {
      const x = 40 + rnd() * 400;
      const y = 40 + rnd() * 40;
      const r = 50 + rnd() * 70;
      const g = ctx.createRadialGradient(x, y, 4, x, y, r);
      g.addColorStop(0, 'rgba(180,200,255,0.10)');
      g.addColorStop(1, 'rgba(180,200,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    this.put(TextureKeys.Fog, c);
  }

  private makeRidge(color: number, seed: number, jag: number, key: string): void {
    const [c, ctx] = this.cv(960, 180);
    const rnd = this.rng(seed);
    const css = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillStyle = css;
    ctx.beginPath();
    ctx.moveTo(0, 180);
    let y = 180 * (1 - 0.35 * jag);
    ctx.lineTo(0, y);
    for (let x = 0; x <= 960; x += 48) {
      const ny = 180 * (1 - jag) + rnd() * 180 * jag * 0.55;
      ctx.quadraticCurveTo(x + 24, y - 18 + rnd() * 36, x + 48, ny);
      y = ny;
    }
    ctx.lineTo(960, 180);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 2;
    ctx.stroke();
    this.put(key, c);
  }

  private makeAurora(color: string, key: string): void {
    const [c, ctx] = this.cv(480, 220);
    ctx.translate(240, 110);
    ctx.rotate(-0.32);
    for (const [x, w, a] of [[-120, 70, 0.5], [-30, 110, 0.65], [80, 60, 0.45]] as const) {
      const g = ctx.createLinearGradient(0, -110, 0, 110);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.5, color);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = a;
      ctx.fillStyle = g;
      ctx.fillRect(x - w / 2, -110, w, 220);
    }
    ctx.globalAlpha = 1;
    this.put(key, c);
  }

  private makeVignette(): void {
    const [c, ctx] = this.cv(960, 540);
    const g = ctx.createRadialGradient(480, 260, 220, 480, 260, 640);
    g.addColorStop(0, 'rgba(3,6,18,0)');
    g.addColorStop(1, 'rgba(3,6,18,0.6)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 960, 540);
    this.put(TextureKeys.Vignette, c);
  }

  // ---------- power-ups: orbes neón con glifo ----------

  private starPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? r : r * 0.45;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  private makePowerups(): void {
    const kinds: PowerUpKind[] = ['boots', 'feather', 'shield', 'magnet', 'star', 'heart', 'dash'];
    const cssOf: Record<PowerUpKind, string> = {
      boots: '#35d0ff',
      feather: '#9dff57',
      shield: '#7c9bff',
      magnet: '#ff7ad9',
      star: '#ffd23f',
      heart: '#ff5d6d',
      dash: '#46f0c8',
    };
    for (const kind of kinds) {
      const [cv2, ctx] = this.cv(48, 48);
      const col = cssOf[kind];
      const bg = ctx.createRadialGradient(24, 24, 4, 24, 24, 24);
      bg.addColorStop(0, col);
      bg.addColorStop(0.55, col);
      bg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(24, 24, 23, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(7,11,29,0.85)';
      ctx.beginPath();
      ctx.arc(24, 24, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(24, 24, 15, 0, Math.PI * 2);
      ctx.stroke();
      // glifo
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      if (kind === 'boots') {
        ctx.fillRect(16, 28, 16, 6);
        ctx.fillRect(26, 16, 6, 14);
      } else if (kind === 'feather') {
        ctx.beginPath();
        ctx.ellipse(24, 24, 6, 11, 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0b1020';
        ctx.fillRect(22, 16, 3, 16);
      } else if (kind === 'shield') {
        ctx.beginPath();
        ctx.moveTo(24, 14);
        ctx.lineTo(33, 18);
        ctx.lineTo(33, 26);
        ctx.quadraticCurveTo(33, 33, 24, 36);
        ctx.quadraticCurveTo(15, 33, 15, 26);
        ctx.lineTo(15, 18);
        ctx.closePath();
        ctx.fill();
      } else if (kind === 'magnet') {
        ctx.beginPath();
        ctx.arc(24, 24, 9, Math.PI, 0, false);
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.fillRect(12, 22, 6, 8);
        ctx.fillRect(30, 22, 6, 8);
      } else if (kind === 'star') {
        this.starPath(ctx, 24, 24, 11);
        ctx.fill();
      } else if (kind === 'heart') {
        ctx.beginPath();
        ctx.arc(19, 21, 6, Math.PI, 0);
        ctx.arc(29, 21, 6, Math.PI, 0);
        ctx.lineTo(24, 35);
        ctx.closePath();
        ctx.fill();
      } else {
        for (const dx of [-7, 1]) {
          ctx.beginPath();
          ctx.moveTo(20 + dx, 15);
          ctx.lineTo(28 + dx, 24);
          ctx.lineTo(20 + dx, 33);
          ctx.stroke();
        }
      }
      this.put(`px-pow-${kind}`, cv2);
    }
  }
}
