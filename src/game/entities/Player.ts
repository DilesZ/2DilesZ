import { TUNING } from '../config';
import { TextureKeys } from '../constants';
import type { PowerState } from '../logic/powerups';
import { speedMultiplier } from '../logic/powerups';
import { AudioBus } from '../systems/audio';
import type { Actions } from '../systems/input';

/** Control del jugador: coyote-time, jump-buffer, salto variable, doble salto y dash. */
export class Player {
  sprite: Phaser.Physics.Arcade.Sprite;
  private coyoteUntil = 0;
  private bufferUntil = 0;
  private airJumps = 0;
  private cutArmed = false;
  private dashUntil = 0;
  private dashCooldownUntil = 0;
  private dashDir = 1;
  facing = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, TextureKeys.Player);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setDragX(TUNING.player.dragX);
    this.sprite.setMaxVelocity(TUNING.player.moveSpeed * 1.6, TUNING.player.maxFall);
    this.sprite.setDepth(10);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(12, 18);
    body.setOffset(2, 2);
  }

  reset(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setAlpha(1);
    this.airJumps = 0;
    this.dashUntil = 0;
    this.dashCooldownUntil = 0;
    this.cutArmed = false;
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

    // squash & stretch sutil
    const stretch = Phaser.Math.Clamp(1 + Math.abs(nvx) / 2400, 1, 1.12);
    this.sprite.setScale(this.facing < 0 ? -stretch : stretch, 2 - stretch > 0 ? 1 / Math.sqrt(stretch) : 1);

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
  }
}
