import Phaser from 'phaser';
import { TUNING } from '../config';
import { GAME_H, POWERUP_META, SceneKeys, TextureKeys } from '../constants';
import { LEVELS, type LevelDef } from '../data/levels';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import {
  applyPowerUp,
  consumeShield,
  createInitialPowerState,
  expiredPowers,
  hasShield,
  magnetRadius,
  scoreMultiplier,
  type PowerState,
} from '../logic/powerups';
import {
  scoreForCoin,
  scoreForLevelComplete,
  scoreForPowerup,
  scoreForStomp,
} from '../logic/scoring';
import { SaveService } from '../services/save';
import { AudioBus } from '../systems/audio';
import { burst, flashSprite, floatText } from '../systems/fx';
import { readActions } from '../systems/input';
import { UI_FONT } from '../constants';
import { addVignette, buildBackdrop } from '../ui/backdrop';

interface MovingPlat {
  obj: Phaser.GameObjects.TileSprite;
  body: Phaser.Physics.Arcade.Body;
  baseX: number;
  baseY: number;
  axis: 'x' | 'y';
  range: number;
  speed: number;
  t: number;
}

interface Saw {
  img: Phaser.Physics.Arcade.Image;
  baseX: number;
  baseY: number;
  axis: 'x' | 'y';
  range: number;
  speed: number;
  t: number;
}

export class Game extends Phaser.Scene {
  private level!: LevelDef;
  private levelIndex = 1;
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enemies: Enemy[] = [];
  private movers: MovingPlat[] = [];
  private saws: Saw[] = [];
  private powers!: PowerState;
  private score = 0;
  private lives: number = TUNING.player.maxLives;
  private coinsTaken = 0;
  private coinsTotal = 0;
  private deaths = 0;
  private startMs = 0;
  private iframesUntil = 0;
  private sawCooldownUntil = 0;
  private respawn: { x: number; y: number } = { x: 80, y: 380 };
  private hud!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private finished = false;
  private animMs = 0;
  private wasGrounded = false;
  private nextTrailMs = 0;

  constructor() {
    super(SceneKeys.Game);
  }

  init(data: { level?: number }): void {
    this.levelIndex = Phaser.Math.Clamp(Math.floor(data.level ?? 1), 1, 6);
    this.level = LEVELS[this.levelIndex - 1];
    this.enemies = [];
    this.movers = [];
    this.saws = [];
    this.score = 0;
    this.lives = TUNING.player.maxLives;
    this.coinsTaken = 0;
    this.deaths = 0;
    this.finished = false;
    this.iframesUntil = 0;
    this.sawCooldownUntil = 0;
    this.animMs = 0;
    this.wasGrounded = false;
    this.nextTrailMs = 0;
    this.respawn = { ...this.level.spawn };
  }

  create(): void {
    const save = SaveService.load();
    AudioBus.setMuted(save.muted);
    this.powers = createInitialPowerState(save.dashUnlocked || this.levelIndex >= 4);
    if (this.level.unlocksDash) this.powers.dashUnlocked = true;

    this.startMs = this.time.now;
    this.physics.world.setBounds(0, 0, this.level.worldW, GAME_H + 120);
    this.buildBackground();
    this.buildPlatforms();
    this.buildGoalAndCheckpoints();
    this.buildPickups();
    this.buildEnemies();
    this.buildHazards();

    this.player = new Player(this, this.level.spawn.x, this.level.spawn.y);
    this.physics.add.collider(this.player.sprite, this.staticGroup!);
    this.cursors = this.input.keyboard!.createCursorKeys();

    // mover colliders
    for (const m of this.movers) {
      this.physics.add.collider(this.player.sprite, m.obj);
    }
    for (const e of this.enemies) {
      this.physics.add.collider(e.sprite, this.staticGroup!);
    }

    this.buildOverlaps();
    this.buildCamera();
    this.buildHUD();
    this.showHint();

    this.input.keyboard?.on('keydown-M', () => {
      const s = SaveService.load();
      s.muted = !s.muted;
      SaveService.store(s);
      AudioBus.setMuted(s.muted);
      floatText(this, this.player.x, this.player.y - 30, s.muted ? 'Sonido OFF' : 'Sonido ON', '#9aa3c7');
    });

    this.game.events.on('blur', this.autoPause, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('blur', this.autoPause, this);
    });

    this.exposeDebugHook();
  }

  private staticGroup: Phaser.Physics.Arcade.StaticGroup | null = null;
  private coinGroup: Phaser.Physics.Arcade.StaticGroup | null = null;
  private powGroup: Phaser.Physics.Arcade.StaticGroup | null = null;
  private checkpointGroup: Phaser.Physics.Arcade.StaticGroup | null = null;
  private goalZone: Phaser.GameObjects.Zone | null = null;

  private buildBackground(): void {
    buildBackdrop(this, { worldW: this.level.worldW, gameplay: true });
    addVignette(this);
  }

  private addStaticPlatform(x: number, y: number, w: number, h: number): void {
    // Cuerpo invisible + visual de hierba Kenney repetida.
    const r = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0xffffff, 0);
    r.setVisible(false);
    this.physics.add.existing(r, true);
    this.staticGroup!.add(r);
    this.add.tileSprite(x + w / 2, y + h / 2, w, h, TextureKeys.TileNight).setDepth(1);
  }

  private buildPlatforms(): void {
    this.staticGroup = this.physics.add.staticGroup();
    this.level.platforms.forEach((p, i) => {
      if (p.moving) {
        const ts = this.add.tileSprite(p.x + p.w / 2, p.y + p.h / 2, p.w, p.h, TextureKeys.PlankNight);
        ts.setDepth(2);
        this.physics.add.existing(ts);
        const body = ts.body as Phaser.Physics.Arcade.Body;
        body.setAllowGravity(false);
        body.setImmovable(true);
        body.setFriction(1, 1);
        this.movers.push({
          obj: ts,
          body,
          baseX: p.x + p.w / 2,
          baseY: p.y + p.h / 2,
          axis: p.moving.axis,
          range: p.moving.range,
          speed: p.moving.speed,
          t: i * 700,
        });
      } else {
        this.addStaticPlatform(p.x, p.y, p.w, p.h);
      }
    });
  }

  private buildGoalAndCheckpoints(): void {
    this.checkpointGroup = this.physics.add.staticGroup();
    for (const c of this.level.checkpoints) {
      const img = this.add.image(c.x, c.y + 12, TextureKeys.BeaconOff).setOrigin(0.5, 1);
      this.physics.add.existing(img, true);
      img.setData('taken', false);
      img.setData('cx', c.x);
      img.setData('cy', c.y - 20);
      this.checkpointGroup.add(img);
    }
    // halo del faro
    this.add
      .image(this.level.goal.x, this.level.goal.y - 20, TextureKeys.Glow)
      .setTint(0xffd98a)
      .setScale(3.2)
      .setAlpha(0.45)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(6);
    const gl = this.add.image(this.level.goal.x, this.level.goal.y, TextureKeys.Goal);
    gl.setDepth(8);
    this.tweens.add({ targets: gl, y: this.level.goal.y - 6, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    // haz de luz oscilante
    const beam = this.add
      .image(this.level.goal.x - 4, this.level.goal.y - 38, TextureKeys.Beam)
      .setOrigin(0, 0.5)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setAlpha(0.85)
      .setDepth(7);
    this.tweens.add({
      targets: beam,
      angle: 14,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    beam.setAngle(-14);
    this.goalZone = this.add.zone(this.level.goal.x, this.level.goal.y, 56, 70);
    this.physics.add.existing(this.goalZone);
    const zb = this.goalZone.body as Phaser.Physics.Arcade.Body;
    zb.setAllowGravity(false);
    zb.setImmovable(true);
  }

  private buildPickups(): void {
    this.coinGroup = this.physics.add.staticGroup();
    this.coinsTotal = this.level.coins.length;
    for (const c of this.level.coins) {
      const img = this.add.image(c.x, c.y, TextureKeys.CoinOrb);
      this.physics.add.existing(img, true);
      this.tweens.add({ targets: img, y: c.y - 5, duration: 700 + Math.random() * 400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.coinGroup.add(img);
    }
    this.powGroup = this.physics.add.staticGroup();
    for (const p of this.level.powerups) {
      const img = this.add.image(p.x, p.y, `px-pow-${p.kind}`);
      this.physics.add.existing(img, true);
      img.setData('kind', p.kind);
      this.tweens.add({ targets: img, y: p.y - 7, duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.powGroup.add(img);
    }
  }

  private buildEnemies(): void {
    for (const def of this.level.enemies) {
      const e = new Enemy(this, def);
      this.enemies.push(e);
      this.physics.add.collider(e.sprite, this.staticGroup!);
    }
  }

  private buildHazards(): void {
    // pinchos de neón (base apoyada en la plataforma: def.y + 16)
    const spikeFrame = this.textures.getFrame(TextureKeys.SpikeNeon);
    const spikeScale = 18 / spikeFrame.height;
    const spikeW = spikeFrame.width * spikeScale;
    for (const s of this.level.spikes) {
      const count = Math.max(1, Math.round(s.w / spikeW));
      for (let i = 0; i < count; i++) {
        const img = this.add
          .image(s.x + spikeW / 2 + i * spikeW, s.y + 16, TextureKeys.SpikeNeon)
          .setOrigin(0.5, 1)
          .setScale(spikeScale);
        this.physics.add.existing(img, true);
        img.setData('spike', true);
        this.staticGroup!.add(img);
      }
    }
    // engranajes de sombra (intercambio de frames, sin rotación)
    for (const sd of this.level.saws) {
      const img = this.physics.add.image(sd.x, sd.y, TextureKeys.GearA);
      const body = img.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      body.setImmovable(true);
      const r = (Math.min(img.width, img.height) / 2) * 0.8;
      body.setCircle(r, (img.width - r * 2) / 2, (img.height - r * 2) / 2);
      this.saws.push({ img, baseX: sd.x, baseY: sd.y, axis: sd.axis, range: sd.range, speed: sd.speed, t: Math.random() * 1000 });
    }
  }

  private buildOverlaps(): void {
    const ps = this.player.sprite;
    this.physics.add.overlap(ps, this.coinGroup!, (_p, coin) => {
      const img = coin as Phaser.GameObjects.Image;
      if (!img.active) return;
      this.collectCoin(img);
    });
    this.physics.add.overlap(ps, this.powGroup!, (_p, pow) => {
      const img = pow as Phaser.GameObjects.Image;
      if (!img.active) return;
      const kind = img.getData('kind') as keyof typeof POWERUP_META;
      this.takePickup(img);
      this.collectPower(kind, img.x, img.y);
    });
    this.physics.add.overlap(ps, this.checkpointGroup!, (_p, cp) => {
      const img = cp as Phaser.GameObjects.Image;
      if (img.getData('taken')) return;
      img.setData('taken', true);
      img.setTexture(TextureKeys.BeaconOn);
      this.tweens.add({ targets: img, scale: 1.12, duration: 350, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.respawn = { x: Number(img.getData('cx')), y: Number(img.getData('cy')) };
      AudioBus.checkpoint();
      burst(this, img.x, img.y - 10, 0x35ff70, 10, 120);
      floatText(this, img.x, img.y - 34, 'Checkpoint', '#35ff70');
    });
    if (this.goalZone) {
      this.physics.add.overlap(ps, this.goalZone, () => this.completeLevel());
    }
  }

  private buildCamera(): void {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.level.worldW, GAME_H);
    cam.startFollow(this.player.sprite, true, TUNING.camera.lerp, TUNING.camera.lerp);
    cam.setDeadzone(120, 80);
    cam.setFollowOffset(0, 40);
  }

  private buildHUD(): void {
    this.hud = this.add
      .text(12, 8, '', {
        fontFamily: UI_FONT,
        fontSize: '16px',
        fontStyle: '700',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 4,
        lineSpacing: 4,
      })
      .setScrollFactor(0)
      .setDepth(100);
    const pauseBtn = this.add
      .text(948, 8, '❚❚', {
        fontFamily: UI_FONT,
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#1c2450',
        padding: { x: 8, y: 4 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(100)
      .setInteractive({ useHandCursor: true });
    pauseBtn.on('pointerdown', () => this.pauseGame());
    this.updateHUD();
  }

  private showHint(): void {
    this.hintText = this.add
      .text(480, 500, this.level.hint, {
        fontFamily: UI_FONT,
        fontSize: '15px',
        color: '#ffd23f',
        stroke: '#000',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100);
    this.time.delayedCall(6000, () => {
      if (this.hintText) this.tweens.add({ targets: this.hintText, alpha: 0, duration: 600 });
    });
  }

  private takePickup(img: Phaser.GameObjects.Image): void {
    img.setActive(false);
    img.setVisible(false);
    try {
      this.physics.world.disable(img);
    } catch {
      /* sin cuerpo: solo ocultar */
    }
  }

  private collectCoin(img: Phaser.GameObjects.Image): void {
    const now = this.time.now;
    const mult = scoreMultiplier(this.powers, now);
    const pts = scoreForCoin(mult);
    this.score += pts;
    this.coinsTaken += 1;
    AudioBus.coin();
    burst(this, img.x, img.y, 0xffd23f, 8, 110);
    floatText(this, img.x, img.y - 14, `+${pts}`, mult > 1 ? '#ff7ad9' : '#ffd23f');
    this.takePickup(img);
    this.updateHUD();
  }

  private collectPower(kind: keyof typeof POWERUP_META, x: number, y: number): void {
    const now = this.time.now;
    if (kind === 'heart') {
      this.lives = Math.min(TUNING.player.maxLives + 1, this.lives + 1);
      floatText(this, x, y - 16, '+1 VIDA', '#ff5d5d');
      AudioBus.power();
      burst(this, x, y, 0xff5d5d, 12, 140);
      this.updateHUD();
      return;
    }
    const msg = applyPowerUp(this.powers, kind, now);
    const mult = scoreMultiplier(this.powers, now);
    this.score += scoreForPowerup(mult);
    AudioBus.power();
    burst(this, x, y, POWERUP_META[kind].color, 14, 150);
    floatText(this, x, y - 16, POWERUP_META[kind].name, POWERUP_META[kind].css);
    floatText(this, x, y + 2, msg, '#ffffff');
    if (kind === 'dash') {
      const s = SaveService.load();
      s.dashUnlocked = true;
      SaveService.store(s);
    }
    this.updateHUD();
  }

  private damage(kind: string): void {
    if (this.finished) return;
    const now = this.time.now;
    if (now < this.iframesUntil) return;
    if (this.player.isDashing(now) && kind === 'enemy-side') {
      // dash atraviesa walkers sin daño (game-feel)
      return;
    }
    this.player.hurt(now);
    if (consumeShield(this.powers)) {
      this.iframesUntil = now + TUNING.player.iframesMs;
      AudioBus.hurt();
      flashSprite(this, this.player.sprite);
      burst(this, this.player.x, this.player.y, 0x7c9bff, 12, 150);
      floatText(this, this.player.x, this.player.y - 30, '¡Escudo!', '#7c9bff');
      this.shake(TUNING.camera.shakeHurtMs, TUNING.camera.shakeHurtIntensity);
      this.updateHUD();
      return;
    }
    this.lives -= 1;
    this.deaths += 1;
    AudioBus.hurt();
    flashSprite(this, this.player.sprite);
    burst(this, this.player.x, this.player.y, 0xff5d5d, 16, 180);
    this.shake(TUNING.camera.shakeDeathMs, TUNING.camera.shakeDeathIntensity);
    if (this.lives <= 0) {
      this.finished = true;
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(450, () => {
        this.scene.start(SceneKeys.GameOver, { level: this.levelIndex, score: this.score });
      });
      return;
    }
    this.iframesUntil = now + TUNING.player.iframesMs;
    this.player.reset(this.respawn.x, this.respawn.y);
    this.player.sprite.setVelocityY(-260);
    floatText(this, this.respawn.x, this.respawn.y - 34, `¡Ay! Quedan ${this.lives}`, '#ff5d5d');
    this.updateHUD();
  }

  private shake(ms: number, intensity: number): void {
    try {
      if (SaveService.load().shake) this.cameras.main.shake(ms, intensity);
    } catch {
      /* noop */
    }
  }

  private completeLevel(): void {
    if (this.finished) return;
    this.finished = true;
    const timeMs = this.time.now - this.startMs;
    const bonus = scoreForLevelComplete(this.levelIndex, timeMs, this.deaths);
    this.score += bonus;
    AudioBus.win();
    burst(this, this.level.goal.x, this.level.goal.y - 20, 0xffd23f, 30, 240);
    floatText(this, this.level.goal.x, this.level.goal.y - 70, `+${bonus} ¡Faro encendido!`, '#ffd23f');

    const save = SaveService.load();
    save.best[this.levelIndex] = Math.max(save.best[this.levelIndex] ?? 0, this.score);
    save.unlocked = Math.max(save.unlocked, Math.min(6, this.levelIndex + 1));
    save.totalBest = Math.max(save.totalBest, this.score);
    SaveService.store(save);

    this.time.delayedCall(1400, () => {
      if (this.levelIndex >= 6) {
        this.scene.start(SceneKeys.Victory, { score: this.score, timeMs });
      } else {
        this.scene.start(SceneKeys.Game, { level: this.levelIndex + 1 });
      }
    });
  }

  private pauseGame(): void {
    if (this.finished) return;
    AudioBus.click();
    this.scene.launch(SceneKeys.Pause, { level: this.levelIndex });
    this.scene.pause();
  }

  private autoPause(): void {
    if (this.finished || !this.scene.isActive()) return;
    this.pauseGame();
  }

  private updateHUD(): void {
    const now = this.time.now;
    const powers: string[] = [];
    if (now < this.powers.bootsUntil) powers.push(`Botas ${Math.ceil((this.powers.bootsUntil - now) / 1000)}s`);
    if (now < this.powers.magnetUntil) powers.push(`Imán ${Math.ceil((this.powers.magnetUntil - now) / 1000)}s`);
    if (now < this.powers.starUntil) powers.push(`x2 ${Math.ceil((this.powers.starUntil - now) / 1000)}s`);
    if (hasShield(this.powers)) powers.push(`Escudo x${this.powers.shieldCharges}`);
    if (this.powers.feather) powers.push('Doble salto');
    if (this.powers.dashUnlocked) powers.push('Dash ✓');
    const hearts = '❤'.repeat(Math.max(0, Math.min(5, this.lives))) || '—';
    const secs = Math.floor((this.time.now - this.startMs) / 1000);
    this.hud.setText(
      `N${this.levelIndex} ${this.level.name}   ${hearts}   ★ ${this.score}   ◉ ${this.coinsTaken}/${this.coinsTotal}   ⏱ ${secs}s` +
        (powers.length ? `\n${powers.join(' · ')}` : ''),
    );
  }

  override update(_time: number, delta: number): void {
    if (this.finished) return;
    const now = this.time.now;
    const actions = readActions(this, this.cursors);

    if (actions.pausePressed) {
      this.pauseGame();
      return;
    }

    // expirados → feedback
    for (const e of expiredPowers(this.powers, now)) {
      floatText(this, this.player.x, this.player.y - 30, e === 'star' ? 'x2 terminado' : e === 'boots' ? 'Botas off' : 'Imán off', '#9aa3c7');
    }

    this.player.update(delta, actions, this.powers, now);

    // polvo al aterrizar
    const pbody = this.player.sprite.body as Phaser.Physics.Arcade.Body;
    const groundedNow = pbody.blocked.down || pbody.touching.down;
    if (groundedNow && !this.wasGrounded) {
      burst(this, this.player.x, this.player.y + 22, 0x9aa3c7, 8, 90);
    }
    this.wasGrounded = groundedNow;

    // estela de luz a velocidad o dash
    const fast = Math.abs(pbody.velocity.x) > 200 || this.player.isDashing(now);
    if (fast && now >= this.nextTrailMs) {
      this.nextTrailMs = now + 70;
      const tr = this.add
        .image(this.player.x, this.player.y, TextureKeys.Glow)
        .setTint(0xffd98a)
        .setScale(0.5)
        .setAlpha(0.5)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(8);
      this.tweens.add({ targets: tr, alpha: 0, scale: 0.15, duration: 380, onComplete: () => tr.destroy() });
    }

    // plataformas móviles (sine)
    for (const m of this.movers) {
      m.t += delta;
      const phase = (m.t * m.speed) / 1000;
      if (m.axis === 'x') {
        const nx = m.baseX + Math.sin(phase / 60) * m.range;
        m.body.setVelocityX((nx - m.obj.x) * 10);
      } else {
        const ny = m.baseY + Math.sin(phase / 60) * m.range;
        m.body.setVelocityY((ny - m.obj.y) * 10);
      }
    }

    // engranajes (patrulla + dientes animados)
    this.animMs += delta;
    const gearFrame = Math.floor(this.animMs / 140) % 2 === 0 ? TextureKeys.GearA : TextureKeys.GearB;
    for (const s of this.saws) {
      s.t += delta;
      const phase = (s.t * s.speed) / 1000;
      if (s.axis === 'x') s.img.setPosition(s.baseX + Math.sin(phase / 60) * s.range, s.baseY);
      else s.img.setPosition(s.baseX, s.baseY + Math.sin(phase / 60) * s.range);
      if (s.img.texture.key !== gearFrame) s.img.setTexture(gearFrame);
      const body = s.img.body as Phaser.Physics.Arcade.Body;
      body.updateFromGameObject();
    }

    // moneda: pulso luminoso
    const coinScale = 1 + Math.sin(this.animMs / 280) * 0.12;
    if (this.coinGroup) {
      for (const c of this.coinGroup.getChildren() as Phaser.GameObjects.Image[]) {
        if (c.active) c.setScale(coinScale);
      }
    }

    // enemigos
    for (const e of this.enemies) e.update(delta, now, this.player.x);

    // imán: atrae monedas cercanas
    const mr = magnetRadius(this.powers, now);
    if (mr > 0 && this.coinGroup) {
      const coins = this.coinGroup.getChildren() as Phaser.GameObjects.Image[];
      for (const c of coins) {
        if (!c.active) continue;
        const d = Phaser.Math.Distance.Between(c.x, c.y, this.player.x, this.player.y);
        if (d < mr) {
          const a = Phaser.Math.Angle.Between(c.x, c.y, this.player.x, this.player.y);
          c.x += Math.cos(a) * 4;
          c.y += Math.sin(a) * 4;
          const cb = c.body as Phaser.Physics.Arcade.Body | null;
          cb?.updateFromGameObject();
          if (d < 22) this.collectCoin(c);
        }
      }
    }

    // colisión jugador-enemigos (stomp vs daño)
    for (const e of this.enemies) {
      if (!e.alive || !e.sprite.active) continue;
      const overlap = Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.sprite.getBounds(),
        e.sprite.getBounds(),
      );
      if (!overlap) continue;
      const pvY = (this.player.sprite.body as Phaser.Physics.Arcade.Body).velocity.y;
      const stomping = pvY > 120 && this.player.y < e.sprite.y - 4;
      if (stomping) {
        const mult = scoreMultiplier(this.powers, now);
        const pts = scoreForStomp(mult);
        this.score += pts;
        e.kill();
        AudioBus.stomp();
        burst(this, e.sprite.x, e.sprite.y, 0xffffff, 12, 150);
        floatText(this, e.sprite.x, e.sprite.y - 20, `+${pts}`, '#9dff57');
        this.player.sprite.setVelocityY(-TUNING.player.stompBounce);
        this.updateHUD();
      } else {
        this.damage('enemy-side');
        if (this.finished) return;
      }
    }

    // sierras y pinchos
    if (now >= this.sawCooldownUntil) {
      let hit = false;
      const pb = this.player.sprite.getBounds();
      for (const s of this.saws) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(pb, s.img.getBounds())) {
          hit = true;
          break;
        }
      }
      if (hit) {
        this.sawCooldownUntil = now + TUNING.hazards.sawDpsCooldownMs;
        this.damage('saw');
        if (this.finished) return;
      }
    }

    // pinchos: overlap con staticGroup marcados
    const spikes = this.staticGroup!.getChildren().filter(
      (o) => (o as Phaser.GameObjects.Image).getData?.('spike'),
    ) as Phaser.GameObjects.Image[];
    const pb2 = this.player.sprite.getBounds();
    for (const sp of spikes) {
      if (!sp.active) continue;
      const r = sp.getBounds();
      const shave = r.height * 0.35;
      r.height -= shave;
      r.y += shave;
      if (Phaser.Geom.Intersects.RectangleToRectangle(pb2, r)) {
        this.damage('spike');
        break;
      }
    }

    // caída
    if (this.player.y > GAME_H + 60) {
      this.lives -= 1;
      this.deaths += 1;
      AudioBus.hurt();
      this.shake(TUNING.camera.shakeDeathMs, TUNING.camera.shakeDeathIntensity);
      if (this.lives <= 0) {
        this.finished = true;
        this.scene.start(SceneKeys.GameOver, { level: this.levelIndex, score: this.score });
        return;
      }
      this.player.reset(this.respawn.x, this.respawn.y);
      this.iframesUntil = now + TUNING.player.iframesMs;
      this.updateHUD();
    }

    if (Math.floor(now / 250) !== Math.floor((now - delta) / 250)) this.updateHUD();
  }

  private exposeDebugHook(): void {
    try {
      const w = window as unknown as {
        __2dilesz?: () => string;
        __2dileszState?: unknown;
      };
      w.__2dilesz = () =>
        [
          `level=${this.levelIndex}`,
          `score=${this.score}`,
          `lives=${this.lives}`,
          `coins=${this.coinsTaken}/${this.coinsTotal}`,
          `player=${Math.round(this.player.x)},${Math.round(this.player.y)}`,
          `powers=boots:${this.powers.bootsUntil > this.time.now},star:${this.powers.starUntil > this.time.now},shield:${this.powers.shieldCharges},feather:${this.powers.feather},dash:${this.powers.dashUnlocked}`,
        ].join(' ');
      w.__2dileszState = {
        level: this.levelIndex,
        getScore: () => this.score,
        getLives: () => this.lives,
      };
    } catch {
      /* noop */
    }
  }
}
