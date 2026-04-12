import Phaser from 'phaser';

export default class Fish extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fish');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(28, 14);
    this.body.setAllowGravity(true);
    this.caught = false;
  }

  launch(fromX, velocityY, velocityX) {
    this.setPosition(fromX, 460);
    this.setVisible(true);
    this.setActive(true);
    this.body.enable = true;
    this.caught = false;
    this.setAlpha(1);
    this.setScale(1);
    this.setAngle(0);

    this.body.setVelocity(velocityX, velocityY);

    // Slight wobble rotation while airborne
    this.scene.tweens.add({
      targets: this,
      angle: { from: -15, to: 15 },
      duration: 300,
      yoyo: true,
      repeat: -1
    });
  }

  catch() {
    if (this.caught) return;
    this.caught = true;
    this.body.enable = false;

    // Fun catch animation — spin and shrink
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      angle: 360,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        this.setVisible(false);
        this.setActive(false);
      }
    });
  }

  update() {
    // Remove if fallen below screen
    if (!this.caught && this.y > 470) {
      this.setVisible(false);
      this.setActive(false);
      this.body.enable = false;
    }
  }
}
