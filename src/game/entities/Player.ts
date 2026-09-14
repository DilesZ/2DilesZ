import { TUNING } from '../config';
import { TextureKeys } from '../constants';
import type { PowerState } from '../logic/powerups';
import { speedMultiplier } from '../logic/powerups';
import { AudioBus } from '../systems/audio';
import type { Actions } from '../systems/input';

/**
 * Control del jugador: coyote-time, jump-buffer, salto variable, doble salto y dash.
 * Visual: sprite Kenney con poses (idle / walk A-B / jump / hit).
 */
export class Player {
  sprite: Phaser.Physics.Arcade.Sprite;
  private coyoteUntil = 0;
  private bufferUntil = 0;
  private airJumps = 0;
  private cutArmed = false;
  private dashUntil = 0;
  private dashCooldownUntil = 0;
  private dashDir = 1;
  private hurtUntil = 0;
  private walkMs = 0;
  facing = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, TextureKeys.PlayerIdle);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setDragX(TUNING.player.dragX);
    this.sprite.setMaxVelocity(TUNING.player.moveSpeed * 1.6, TUNING.player.maxFall);
    this.sprite.setDepth(10);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(this.sprite.width * 0.48, this.sprite.height * 0.8);
  }

  reset(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setAlpha(1);
    this.sprite.setTexture(TextureKeys.PlayerIdle);
    this.airJumps = 0;
    this.dashUntil = 0;
    this.dashCooldownUntil = 0;
    this.cutArmed = false;
    this.hurtUntil = 0;
  }

  hurt(now: number): void {
    this.hurtUntil = now + 320;
    this.sprite.setTexture(TextureKeys.PlayerHit);
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
      this.sprite.setTexture(TextureKeys.PlayerJump);
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

    // --- pose visual ---
    if (now < this.hurtUntil) {
      this.sprite.setTexture(TextureKeys.PlayerHit);
    } else if (!grounded) {
      this.sprite.setTexture(TextureKeys.PlayerJump);
    } else if (Math.abs(nvx) > 30) {
      this.walkMs += dtMs;
      this.sprite.setTexture(
        Math.floor(this.walkMs / 130) % 2 === 0 ? TextureKeys.PlayerWalkA : TextureKeys.PlayerWalkB,
      );
    } else {
      this.sprite.setTexture(TextureKeys.PlayerIdle);
    }
  }
}
