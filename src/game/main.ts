import Phaser from 'phaser';
import { WORLD } from './config';
import { GAME_H, GAME_W } from './constants';
import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { HowTo } from './scenes/HowTo';
import { Menu } from './scenes/Menu';
import { Pause } from './scenes/Pause';
import { Preloader } from './scenes/Preloader';
import { Settings } from './scenes/Settings';
import { Victory } from './scenes/Victory';

export function createGame(parent: string): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: GAME_W,
    height: GAME_H,
    backgroundColor: '#0b1020',
    pixelArt: true,
    roundPixels: true,
    disableContextMenu: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: WORLD.gravityY },
        fps: 60,
        fixedStep: true,
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: false,
      powerPreference: 'high-performance',
    },
    fps: { target: 60, min: 30 },
    scene: [Boot, Preloader, Menu, HowTo, Settings, Game, Pause, GameOver, Victory],
  };
  return new Phaser.Game(config);
}
