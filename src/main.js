import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import HouseScene from './scenes/HouseScene.js';
import PlatformScene from './scenes/PlatformScene.js';
import FishingScene from './scenes/FishingScene.js';
import CookingScene from './scenes/CookingScene.js';
import WinScene from './scenes/WinScene.js';
import DreamTransitionScene from './scenes/DreamTransitionScene.js';
import FantasyScene from './scenes/FantasyScene.js';
import FlyingScene from './scenes/FlyingScene.js';
import PalaceScene from './scenes/PalaceScene.js';
import MountainPuzzleScene from './scenes/MountainPuzzleScene.js';
import WizardScene from './scenes/WizardScene.js';
import WizardBattleScene from './scenes/WizardBattleScene.js';
import TravelScene from './scenes/TravelScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  parent: 'game',
  backgroundColor: '#87CEEB',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false
    }
  },
  scene: [BootScene, TitleScene, HouseScene, PlatformScene, FishingScene, CookingScene, WinScene, DreamTransitionScene, FantasyScene, FlyingScene, PalaceScene, TravelScene, MountainPuzzleScene, WizardScene, WizardBattleScene]
};

// Patch text factory so ALL text renders at native resolution (fixes blurry text on Retina/HiDPI)
const dpr = Math.max(window.devicePixelRatio || 1, 1);
if (dpr > 1) {
  const origText = Phaser.GameObjects.GameObjectFactory.prototype.text;
  Phaser.GameObjects.GameObjectFactory.prototype.text = function (...args) {
    const t = origText.apply(this, args);
    t.setResolution(dpr);
    return t;
  };
}

window.game = new Phaser.Game(config);
