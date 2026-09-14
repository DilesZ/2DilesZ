import { TUNING } from '../config';
import { TextureKeys } from '../constants';
import type { EnemyDef } from '../data/levels';

/** Criaturas de sombra con ojos neón (squash + aleteo por frames). */
export class Enemy {
  sprite: Phaser.Physics.Arcade.Sprite;
  def: EnemyDef;
  private dir = 1;
  private baseY: number;
  private t = Math.random() * 1000;
  alive = true;

  constructor(scene: Phaser.Scene, def: EnemyDef) {
    this.def = def;
    const tex =
      def.kind === 'walker' ? TextureKeys.ShadeA : def.kind === 'flyer' ? TextureKeys.BatA : TextureKeys.Golem;
    this.sprite = scene.physics.add.sprite(def.x, def.y, tex);
    this.sprite.setDepth(9);
    this.sprite.setData('enemyRef', this);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (def.kind === 'flyer') {
      body.setAllowGravity(false);
      body.setSize(this.sprite.width * 0.55, this.sprite.height * 0.6);
    } else if (def.kind === 'golem') {
      body.setSize(this.sprite.width * 0.7, this.sprite.height * 0.85);
      this.sprite.setBounce(0.1);
    } else {
      body.setSize(this.sprite.width * 0.62, this.sprite.height * 0.6);
    }
    this.baseY = def.y;
    this.sprite.setVelocityX(this.dir * (def.speed ?? TUNING.enemies.walkerSpeed));
  }

  kill(): void {
    this.alive = false;
    try {
      this.sprite.disableBody(true, true);
    } catch {
      this.sprite.destroy();
    }
  }

  update(dtMs: number, now: number, playerX: number): void {
    if (!this.alive) return;
    this.t += dtMs;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (!body) return;
    const speed = this.def.speed ?? TUNING.enemies.walkerSpeed;
    void now;

    if (this.def.kind === 'walker') {
      if (this.sprite.x < this.def.minX) this.dir = 1;
      if (this.sprite.x > this.def.maxX) this.dir = -1;
      this.sprite.setVelocityX(this.dir * speed);
      this.sprite.setFlipX(this.dir < 0);
      // respiración gelatinosa
      const s = 1 + Math.sin(this.t / 220) * 0.06;
      this.sprite.setScale(s, 1 / Math.sqrt(s));
      this.sprite.setTexture(Math.floor(this.t / 420) % 2 === 0 ? TextureKeys.ShadeA : TextureKeys.ShadeB);
    } else if (this.def.kind === 'flyer') {
      const fSpeed = TUNING.enemies.flyerSpeed;
      if (this.sprite.x < this.def.minX) this.dir = 1;
      if (this.sprite.x > this.def.maxX) this.dir = -1;
      this.sprite.setVelocityX(this.dir * fSpeed);
      this.sprite.y = this.baseY + Math.sin(this.t / 450) * TUNING.enemies.flyerAmp;
      this.sprite.setFlipX(this.dir < 0);
      this.sprite.setTexture(Math.floor(this.t / 150) % 2 === 0 ? TextureKeys.BatA : TextureKeys.BatB);
    } else {
      // golem de obsidiana: patrulla + salto hacia el jugador
      if (this.sprite.x < this.def.minX) this.dir = 1;
      if (this.sprite.x > this.def.maxX) this.dir = -1;
      const dx = playerX - this.sprite.x;
      if (Math.abs(dx) < 300) this.dir = dx > 0 ? 1 : -1;
      this.sprite.setVelocityX(this.dir * TUNING.enemies.golemSpeed);
      const grounded = body.blocked.down || body.touching.down;
      if (grounded && Math.abs(dx) < 280 && this.t % 1600 < dtMs) {
        this.sprite.setVelocityY(-TUNING.enemies.golemJump);
      }
      this.sprite.setFlipX(this.dir < 0);
    }
  }
}
