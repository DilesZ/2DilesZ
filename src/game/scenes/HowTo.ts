import Phaser from 'phaser';
import { SceneKeys } from '../constants';
import { bgStars, bodyText, menuButton, titleText } from '../ui/menu';

export class HowTo extends Phaser.Scene {
  constructor() {
    super(SceneKeys.HowTo);
  }

  create(): void {
    bgStars(this);
    titleText(this, 60, 'CÓMO JUGAR', 34);
    bodyText(
      this,
      120,
      'MOVERSE: ◀ ▶ o A D\nSALTAR: ESPACIO / W / ▲ (mantén para saltar más alto)\n' +
        'DASH: SHIFT o K (se desbloquea en el nivel 3)\nPAUSA: P o ESC · SILENCIO: M\n\n' +
        '• Salta ENCIMA de los enemigos para derrotarlos (+150).\n' +
        '• Los pinchos y sierras quitan 1 vida. Tienes 3.\n' +
        '• Las banderas grises son checkpoints.\n' +
        '• Recoge fragmentos de luz (+50) y power-ups:\n' +
        '  Botas=velocidad · Pluma=doble salto · Escudo=1 golpe\n' +
        '  Imán=atrae luz · Estrella=puntos x2 · Corazón=+1 vida\n\n' +
        'En móvil usa los botones táctiles. ¡Llega al faro de cada nivel!',
      15,
    );
    menuButton(this, 488, '← VOLVER', () => this.scene.start(SceneKeys.Menu));
  }
}
