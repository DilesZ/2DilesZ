import Phaser from 'phaser';
import { SceneKeys } from '../constants';
import { SaveService } from '../services/save';
import { AudioBus } from '../systems/audio';
import { bgStars, menuButton, titleText } from '../ui/menu';

export class Settings extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Settings);
  }

  create(): void {
    bgStars(this);
    titleText(this, 80, 'AJUSTES', 34);
    this.refresh();
  }

  private refresh(): void {
    this.children.removeAll();
    bgStars(this);
    titleText(this, 80, 'AJUSTES', 34);
    const save = SaveService.load();
    menuButton(this, 200, `SONIDO: ${save.muted ? 'OFF' : 'ON'}  (M)`, () => {
      save.muted = !save.muted;
      SaveService.store(save);
      AudioBus.setMuted(save.muted);
      this.refresh();
    });
    menuButton(this, 260, `VIBRACIÓN CÁMARA: ${save.shake ? 'ON' : 'OFF'}`, () => {
      save.shake = !save.shake;
      SaveService.store(save);
      this.refresh();
    });
    menuButton(this, 320, 'BORRAR PROGRESO', () => {
      SaveService.clear();
      this.refresh();
    });
    menuButton(this, 392, '← VOLVER', () => this.scene.start(SceneKeys.Menu));
    this.input.keyboard?.on('keydown-M', () => {
      const s = SaveService.load();
      s.muted = !s.muted;
      SaveService.store(s);
      AudioBus.setMuted(s.muted);
      this.refresh();
    });
  }
}
