import Phaser from 'phaser';
import { SceneKeys } from '../constants';
import { KENNEY_DIR, KENNEY_FILES, TRIM_GROUPS } from '../data/kenney';
import { trimTextureGroups } from '../systems/trim';

/** Carga los PNG Kenney con barra de progreso y los recorta. */
export class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload(): void {
    this.cameras.main.setBackgroundColor('#0b1020');
    const cx = 480;
    const cy = 270;
    this.add
      .text(cx, cy - 40, 'Cargando…', {
        fontFamily: '"Courier New", monospace',
        fontSize: '20px',
        color: '#ffd23f',
      })
      .setOrigin(0.5);
    const barBg = this.add.rectangle(cx, cy, 420, 22, 0x1c2450).setStrokeStyle(2, 0x6f7bd9);
    void barBg;
    const bar = this.add.rectangle(cx - 207, cy, 0, 14, 0xffd23f).setOrigin(0, 0.5);
    const pct = this.add
      .text(cx, cy + 30, '0%', {
        fontFamily: '"Courier New", monospace',
        fontSize: '14px',
        color: '#9aa3c7',
      })
      .setOrigin(0.5);
    this.load.on('progress', (v: number) => {
      bar.width = 414 * v;
      pct.setText(`${Math.round(v * 100)}%`);
    });
    for (const f of KENNEY_FILES) {
      this.load.image(f.key, `${KENNEY_DIR}/${f.file}`);
    }
  }

  create(): void {
    trimTextureGroups(this, TRIM_GROUPS);
    this.scene.start(SceneKeys.Menu);
  }
}
