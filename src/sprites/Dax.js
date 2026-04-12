import Phaser from 'phaser';

export default class Dax extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'dax');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCollideWorldBounds(true);
    this.body.setSize(36, 52);
    this.body.setOffset(14, 12);

    this.speed = 160;
    this.jumpForce = -350;
    this.state = 'idle';
    this.swiping = false;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.play('dax-idle');
  }

  update() {
    const onGround = this.body.blocked.down;

    // Handle swipe
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && !this.swiping) {
      this.swiping = true;
      this.play('dax-swipe');
      this.scene.time.delayedCall(250, () => {
        this.swiping = false;
      });
      // Emit swipe event for fishing mechanic later
      this.scene.events.emit('dax-swipe', this);
      return;
    }

    if (this.swiping) return;

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
      this.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
      this.setFlipX(false);
    } else {
      this.body.setVelocityX(0);
    }

    // Jump
    if (this.cursors.up.isDown && onGround) {
      this.body.setVelocityY(this.jumpForce);
    }

    // Animation state
    if (!onGround) {
      if (this.anims.currentAnim?.key !== 'dax-jump') {
        this.play('dax-jump');
      }
    } else if (this.body.velocity.x !== 0) {
      if (this.anims.currentAnim?.key !== 'dax-walk') {
        this.play('dax-walk');
      }
    } else {
      if (this.anims.currentAnim?.key !== 'dax-idle') {
        this.play('dax-idle');
      }
    }
  }
}
