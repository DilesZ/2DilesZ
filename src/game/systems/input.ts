/** Abstracción de input en ACCIONES (skill game-development). Teclado + táctil DOM. */
export interface Actions {
  left: boolean;
  right: boolean;
  jumpHeld: boolean;
  jumpPressed: boolean;
  dashPressed: boolean;
  pausePressed: boolean;
  anyPressed: boolean;
}

/** Estado táctil escrito por los botones DOM (main.ts) y leído por la escena. */
export const TouchState = {
  left: false,
  right: false,
  jumpHeld: false,
  jumpPressed: false,
  dashPressed: false,
  consumeJump(): boolean {
    const v = this.jumpPressed;
    this.jumpPressed = false;
    return v;
  },
  consumeDash(): boolean {
    const v = this.dashPressed;
    this.dashPressed = false;
    return v;
  },
};

export function readActions(scene: Phaser.Scene, cursors: Phaser.Types.Input.Keyboard.CursorKeys): Actions {
  const kb = scene.input.keyboard;
  const aLeft = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  const aRight = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  const space = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  const shift = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  const keyK = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.K);
  const keyP = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.P);
  const keyEsc = kb?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

  const left = Boolean(cursors.left?.isDown || aLeft?.isDown || TouchState.left);
  const right = Boolean(cursors.right?.isDown || aRight?.isDown || TouchState.right);
  const jumpHeld = Boolean(cursors.up?.isDown || space?.isDown || TouchState.jumpHeld);
  const jumpPressed =
    Boolean(
      Phaser.Input.Keyboard.JustDown(cursors.up as Phaser.Input.Keyboard.Key) ||
        (space && Phaser.Input.Keyboard.JustDown(space)) ||
        TouchState.consumeJump(),
    );
  const dashPressed = Boolean(
    (shift && Phaser.Input.Keyboard.JustDown(shift)) ||
      (keyK && Phaser.Input.Keyboard.JustDown(keyK)) ||
      TouchState.consumeDash(),
  );
  const pausePressed = Boolean(
    (keyP && Phaser.Input.Keyboard.JustDown(keyP)) || (keyEsc && Phaser.Input.Keyboard.JustDown(keyEsc)),
  );
  return {
    left,
    right,
    jumpHeld,
    jumpPressed,
    dashPressed,
    pausePressed,
    anyPressed: jumpPressed || dashPressed || pausePressed || left || right,
  };
}
