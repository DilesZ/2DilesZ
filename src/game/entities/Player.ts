import { TUNING } from '../config';
import { TextureKeys } from '../constants';
import type { PowerState } from '../logic/powerups';
import { speedMultiplier } from '../logic/powerups';
import { AudioBus } from '../systems/audio';
import type { Actions } from '../systems/input';

/**
 * Pip, espíritu de luz: coyote-time, jump-buffer, salto variable, doble salto y dash.
 * Aura aditiva, parpadeo, inclinación por velocidad y estela al dashear.
 */
export class Player {
  sprite: Phaser.Physics.Arcade.Sprite;
  private aura: Phaser.GameObjects.Image;
  private coyoteUntil = 0;
  private bufferUntil = 0;
  private airJumps = 0;
  private cutArmed = false;
  private dashUntil = 0;
  private dashCooldownUntil = 0;
  private dashDir = 1;
  private hurtUntil = 0;
  private blinkUntil = 0;
  private nextBlink = 0;
  facing = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, TextureKeys.Spirit);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setDragX(TUNING.player.dragX);
    this.sprite.setMaxVelocity(TUNING.player.moveSpeed * 1.6, TUNING.player.maxFall);
    this.sprite.setDepth(10);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.sprite.width * 0.52, this.sprite.height * 0.78);
    this.aura = scene.add
      .image(x, y, TextureKeys.Glow)
      .setTint(0xffd98a)
      .setAlpha(0.55)
      .setScale(0.85)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(9);
    this.nextBlink = 1500 + Math.random() * 2000;
  }

  reset(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setAlpha(1);
    this.sprite.setTexture(TextureKeys.Spirit);
    this.sprite.setAngle(0);
    this.airJumps = 0;
    this.dashUntil = 0;
    this.dashCooldownUntil = 0;
    this.cutArmed = false;
    this.hurtUntil = 0;
  }

  hurt(now: number): void {
    this.hurtUntil = now + 320;
  }

  destroyAura(): void {
    try {
      this.aura.destroy();
    } catch {
      /* noop */
    }
  }

  get x(): number {
    return this.sprite.x;
  }
  get y(): number {
    return this.sprite.y;
  }

  isDashing(now: number): boolean {
    return now < this.dashUntil;
  }

  update(dtMs: number, a: Actions, powers: PowerState, now: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const dt = dtMs / 1000;
    const grounded = body.blocked.down || body.touching.down;
    const cfg = TUNING.player;

    if (grounded) {
      this.coyoteUntil = now + cfg.coyoteMs;
      this.airJumps = 0;
    }
    if (a.jumpPressed) this.bufferUntil = now + cfg.bufferMs;

    // --- dash ---
    const dashReady = powers.dashUnlocked && now >= this.dashCooldownUntil && !this.isDashing(now);
    if (a.dashPressed && dashReady) {
      const dir = a.left && !a.right ? -1 : !a.left && a.right ? 1 : this.facing;
      this.dashDir = dir;
      this.facing = dir;
      this.dashUntil = now + cfg.dashMs;
      this.dashCooldownUntil = now + cfg.dashCooldownMs;
      body.setAllowGravity(false);
      this.sprite.setVelocity(dir * cfg.dashSpeed, 0);
      AudioBus.dash();
    }
    if (this.isDashing(now)) {
      this.sprite.setFlipX(this.dashDir < 0);
      this.sprite.setTexture(TextureKeys.SpiritJump);
      this.sprite.setAngle(this.dashDir * -12);
      this.syncAura(now, 1.5, 0.8);
      return;
    }
    if (!body.allowGravity) body.setAllowGravity(true);

    // --- horizontal ---
    const dir = (a.right ? 1 : 0) - (a.left ? 1 : 0);
    if (dir !== 0) this.facing = dir;
    const target = dir * cfg.moveSpeed * speedMultiplier(powers, now);
    const vx = body.velocity.x;
    const approach = cfg.accel * dt;
    const nvx = vx < target ? Math.min(target, vx + approach) : Math.max(target, vx - approach);
    this.sprite.setVelocityX(nvx);
    this.sprite.setFlipX(this.facing < 0);

    // --- salto ---
    const buffered = now < this.bufferUntil;
    if (buffered) {
      if (grounded || now < this.coyoteUntil) {
        this.sprite.setVelocityY(-cfg.jumpVelocity);
        this.bufferUntil = 0;
        this.coyoteUntil = 0;
        this.cutArmed = true;
        AudioBus.jump();
      } else if (powers.feather && this.airJumps < 1) {
        this.airJumps += 1;
        this.sprite.setVelocityY(-cfg.doubleJumpVelocity);
        this.bufferUntil = 0;
        this.cutArmed = true;
        AudioBus.doubleJump();
      }
    }
    // salto variable: al soltar, corta la subida
    if (this.cutArmed && !a.jumpHeld && body.velocity.y < -160) {
      this.sprite.setVelocityY(body.velocity.y * cfg.jumpCutMultiplier);
      this.cutArmed = false;
    }
    if (grounded) this.cutArmed = false;

    // --- pose visual: inclinación + squash + parpadeo ---
    const vy = body.velocity.y;
    this.sprite.setAngle(Phaser.Math.Clamp(nvx / 28, -10, 10));
    const squash = grounded && Math.abs(nvx) > 40 ? 1 + Math.sin(now / 90) * 0.035 : 1;
    this.sprite.setScale(squash, 1 / Math.sqrt(squash));
    if (now >= this.nextBlink) {
      this.blinkUntil = now + 130;
      this.nextBlink = now + 2200 + Math.random() * 2600;
    }
    if (now < this.hurtUntil) {
      this.sprite.setTexture(TextureKeys.SpiritHurt);
    } else if (!grounded) {
      this.sprite.setTexture(TextureKeys.SpiritJump);
    } else if (now < this.blinkUntil) {
      this.sprite.setTexture(TextureKeys.SpiritBlink);
    } else {
      this.sprite.setTexture(TextureKeys.Spirit);
    }
    void vy;

    const starOn = now < powers.starUntil;
    this.syncAura(now, starOn ? 1.25 : 0.85, starOn ? 0.75 : 0.55);
  }

  private syncAura(now: number, scale: number, alpha: number): void {
    this.aura.setPosition(this.sprite.x, this.sprite.y);
    this.aura.setScale(scale * (1 + Math.sin(now / 240) * 0.06));
    this.aura.setAlpha(alpha);
  }
}
