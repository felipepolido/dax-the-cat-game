import Phaser from 'phaser';

export function createAnimations(scene) {
  scene.anims.create({
    key: 'dax-idle',
    frames: scene.anims.generateFrameNumbers('dax', { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1
  });

  scene.anims.create({
    key: 'dax-walk',
    frames: scene.anims.generateFrameNumbers('dax', { start: 2, end: 3 }),
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
    key: 'dax-jump',
    frames: [{ key: 'dax', frame: 4 }],
    frameRate: 1
  });

  scene.anims.create({
    key: 'dax-swipe',
    frames: [{ key: 'dax', frame: 5 }],
    frameRate: 8,
    duration: 200
  });
}
