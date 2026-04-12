import Phaser from 'phaser';

const GAME_W = 800;
const GAME_H = 450;
const VALLEY_LEFT = 80;   // left valley wall edge
const VALLEY_RIGHT = 720; // right valley wall edge
const SCROLL_SPEED = 120; // pixels per second base speed
const PLAYER_SPEED = 300; // left-right movement speed
const CASTLE_DISTANCE = 30; // obstacles to pass before castle appears

export default class FlyingScene extends Phaser.Scene {
  constructor() {
    super('FlyingScene');
  }

  create() {
    this.obstaclesPassed = 0;
    this.castleApproaching = false;
    this.landed = false;
    this.scrollSpeed = SCROLL_SPEED;

    // --- Sky background (fantasy gradient) ---
    this.add.rectangle(400, 75, 800, 150, 0x6BC5E8);
    this.add.rectangle(400, 200, 800, 100, 0x87CEEB);
    this.add.rectangle(400, 300, 800, 100, 0xA8D8EA);
    this.add.rectangle(400, 400, 800, 100, 0xC5E8D5);

    // --- Valley walls (scrolling green terrain on sides) ---
    this.leftWall = this.add.tileSprite(40, 225, 80, 450, 'ground-tile');
    this.rightWall = this.add.tileSprite(760, 225, 80, 450, 'ground-tile');

    // Valley edge decorations (darker green strips with gradient)
    this.add.rectangle(VALLEY_LEFT - 6, 225, 8, 450, 0x4CAF50, 0.6);
    this.leftEdge = this.add.rectangle(VALLEY_LEFT, 225, 4, 450, 0x2D5A1E);
    this.add.rectangle(VALLEY_RIGHT + 6, 225, 8, 450, 0x4CAF50, 0.6);
    this.rightEdge = this.add.rectangle(VALLEY_RIGHT, 225, 4, 450, 0x2D5A1E);

    // Tiny trees on valley edges (decorative)
    for (let y = 0; y < 450; y += 60) {
      this.add.circle(VALLEY_LEFT - 15, y + Math.random() * 30, 8, 0x3A7D2C, 0.7);
      this.add.circle(VALLEY_RIGHT + 15, y + Math.random() * 30, 8, 0x3A7D2C, 0.7);
    }

    // --- Scrolling clouds (decorative, non-colliding) ---
    this.clouds = [];
    for (let i = 0; i < 6; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(VALLEY_LEFT + 40, VALLEY_RIGHT - 40),
        Phaser.Math.Between(-50, GAME_H),
        Phaser.Math.Between(50, 90),
        Phaser.Math.Between(20, 35),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.2, 0.4)
      );
      cloud.scrollFactor = Phaser.Math.FloatBetween(0.3, 0.6); // parallax
      this.clouds.push(cloud);
    }

    // --- Obstacle group ---
    this.obstacles = this.physics.add.group();

    // --- Player (flying dragon with Dax) ---
    this.player = this.physics.add.sprite(400, 350, 'flying-dragon');
    this.player.setScale(1.2);
    this.player.body.setAllowGravity(false);
    this.player.body.setCollideWorldBounds(true);
    this.player.setDepth(10);

    // Smaller hitbox (forgiving for young player)
    this.player.body.setSize(40, 50);
    this.player.body.setOffset(20, 20);

    // --- Overlap detection (not hard collision — more forgiving) ---
    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

    // --- Controls ---
    this.cursors = this.input.keyboard.createCursorKeys();

    // --- HUD ---
    this.progressText = this.add.text(400, 16, '', {
      fontSize: '14px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    // Progress bar background
    this.add.rectangle(400, 36, 204, 10, 0x000000, 0.5).setDepth(20);
    this.progressBar = this.add.rectangle(299, 36, 0, 8, 0xFFD700).setOrigin(0, 0.5).setDepth(20);

    // --- Obstacle spawn timer ---
    this.obstacleTimer = this.time.addEvent({
      delay: 1200,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true
    });

    // Speed increases gradually
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        if (!this.castleApproaching) {
          this.scrollSpeed = Math.min(220, this.scrollSpeed + 10);
          // Also spawn slightly faster
          const newDelay = Math.max(600, this.obstacleTimer.delay - 50);
          this.obstacleTimer.reset({ delay: newDelay, callback: this.spawnObstacle, callbackScope: this, loop: true });
        }
      },
      callbackScope: this,
      loop: true
    });

    // --- Intro text ---
    const introText = this.add.text(400, 200, 'Fly to the Crystal Palace!\nUse ← → to dodge!', {
      fontSize: '22px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5).setDepth(30);

    this.tweens.add({
      targets: introText, alpha: 0,
      delay: 2500, duration: 500
    });

    // Player wobble (flying feel)
    this.tweens.add({
      targets: this.player,
      y: this.player.y - 4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Shadow under player
    this.playerShadow = this.add.ellipse(400, 420, 50, 12, 0x000000, 0.2).setDepth(5);

    this.cameras.main.fadeIn(800);

    // Invincibility frames tracking
    this.invincible = false;
    this.lives = 3;
    this.heartsDisplay = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.add.text(20 + i * 28, 12, '❤️', {
        fontSize: '18px'
      }).setDepth(20);
      this.heartsDisplay.push(heart);
    }
  }

  spawnObstacle() {
    if (this.castleApproaching || this.landed) return;

    const types = ['obstacle-tree', 'obstacle-tree', 'obstacle-mountain', 'obstacle-house'];
    const type = types[Phaser.Math.Between(0, types.length - 1)];

    // Keep obstacles within the valley
    const x = Phaser.Math.Between(VALLEY_LEFT + 40, VALLEY_RIGHT - 40);

    const obs = this.obstacles.create(x, -50, type);
    obs.body.setAllowGravity(false);
    obs.body.setVelocityY(this.scrollSpeed);
    obs.setDepth(8);

    // Smaller hitbox for forgiveness
    if (type === 'obstacle-mountain') {
      obs.setScale(1.2);
      obs.body.setSize(30, 30);
      obs.body.setOffset(9, 9);
    } else if (type === 'obstacle-tree') {
      obs.body.setSize(18, 18);
      obs.body.setOffset(7, 7);
    } else {
      obs.body.setSize(18, 22);
      obs.body.setOffset(5, 5);
    }

    // Sometimes spawn a pair
    if (Math.random() < 0.3 && this.obstaclesPassed > 15) {
      const x2 = Phaser.Math.Between(VALLEY_LEFT + 40, VALLEY_RIGHT - 40);
      if (Math.abs(x2 - x) > 80) { // ensure gap between them
        const obs2 = this.obstacles.create(x2, -80, types[Phaser.Math.Between(0, types.length - 1)]);
        obs2.body.setAllowGravity(false);
        obs2.body.setVelocityY(this.scrollSpeed);
        obs2.setDepth(8);
        obs2.body.setSize(18, 18);
        obs2.body.setOffset(7, 7);
      }
    }
  }

  hitObstacle(player, obstacle) {
    if (this.invincible || this.landed) return;

    obstacle.destroy();
    this.lives--;

    // Update hearts
    if (this.heartsDisplay[this.lives]) {
      this.heartsDisplay[this.lives].setText('🖤');
    }

    // Screen shake
    this.cameras.main.shake(200, 0.01);

    // Flash player (invincibility frames)
    this.invincible = true;
    this.tweens.add({
      targets: player,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 8,
      onComplete: () => {
        player.setAlpha(1);
        this.invincible = false;
      }
    });

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.landed = true;
    this.physics.pause();
    this.obstacleTimer.remove();

    const overlay = this.add.rectangle(400, 225, 800, 450, 0x000000, 0.6).setDepth(50);
    this.add.text(400, 160, 'Oh no! Crash landing!', {
      fontSize: '28px', color: '#FF6B6B', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(51);

    this.add.text(400, 210, 'Silver says: "Let\'s try again!"', {
      fontSize: '16px', color: '#C0C0C0', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(51);

    // Retry button
    const btnBg = this.add.rectangle(400, 280, 200, 45, 0x4CAF50, 0.9).setDepth(51);
    btnBg.setStrokeStyle(2, 0x2E7D32);
    btnBg.setInteractive({ useHandCursor: true });
    this.add.text(400, 280, 'Try Again!', {
      fontSize: '20px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(51);

    btnBg.on('pointerdown', () => {
      this.scene.restart();
    });

    // Main Menu button
    const menuBg = this.add.rectangle(400, 330, 200, 35, 0x5D4037, 0.9).setDepth(51);
    menuBg.setStrokeStyle(1, 0x3E2723);
    menuBg.setInteractive({ useHandCursor: true });
    this.add.text(400, 330, 'Main Menu', {
      fontSize: '16px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 1
    }).setOrigin(0.5).setDepth(51);

    menuBg.on('pointerdown', () => {
      this.scene.start('TitleScene');
    });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.restart();
    });
  }

  startCastleApproach() {
    this.castleApproaching = true;
    this.obstacleTimer.remove();

    // Slow down
    this.tweens.add({
      targets: this,
      scrollSpeed: 40,
      duration: 3000
    });

    // Clear remaining obstacles
    this.time.delayedCall(2000, () => {
      this.obstacles.clear(true, true);
    });

    // Castle appears from top
    this.castle = this.add.image(400, -100, 'crystal-palace').setDepth(9).setScale(1.5);

    this.tweens.add({
      targets: this.castle,
      y: 120,
      duration: 4000,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.landAtCastle();
      }
    });

    // Fanfare text
    const arriveText = this.add.text(400, 380, 'The Crystal Palace!', {
      fontSize: '24px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#2E0854', strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0).setDepth(25);

    this.tweens.add({
      targets: arriveText, alpha: 1,
      delay: 1500, duration: 800
    });
  }

  landAtCastle() {
    this.landed = true;

    // Player flies up toward castle
    this.tweens.add({
      targets: this.player,
      y: 200, x: 400,
      duration: 1500,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: this.player,
      scaleX: 0.6, scaleY: 0.6,
      duration: 1500,
      ease: 'Sine.easeIn'
    });
    this.tweens.add({
      targets: this.playerShadow,
      alpha: 0,
      duration: 1000
    });

    this.time.delayedCall(2000, () => {
      // "Landing" text
      const landText = this.add.text(400, 320, 'Safe landing! Time to meet the Queen!', {
        fontSize: '18px', color: '#E0C0FF', fontFamily: 'Arial',
        stroke: '#000000', strokeThickness: 2
      }).setOrigin(0.5).setDepth(25);

      this.time.delayedCall(2500, () => {
        this.cameras.main.fadeOut(1200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('PalaceScene');
        });
      });
    });
  }

  update() {
    if (this.landed) return;

    // Player movement (left-right only)
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-PLAYER_SPEED);
      this.player.setAngle(-10); // slight tilt
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(PLAYER_SPEED);
      this.player.setAngle(10);
    } else {
      this.player.body.setVelocityX(0);
      this.player.setAngle(0);
    }

    // Keep player within valley
    if (this.player.x < VALLEY_LEFT + 30) this.player.x = VALLEY_LEFT + 30;
    if (this.player.x > VALLEY_RIGHT - 30) this.player.x = VALLEY_RIGHT - 30;

    // Shadow follows player
    if (this.playerShadow) {
      this.playerShadow.x = this.player.x;
    }

    // Scroll valley walls
    this.leftWall.tilePositionY -= this.scrollSpeed * 0.016;
    this.rightWall.tilePositionY -= this.scrollSpeed * 0.016;

    // Scroll clouds (parallax)
    for (const cloud of this.clouds) {
      cloud.y += cloud.scrollFactor * this.scrollSpeed * 0.016;
      if (cloud.y > GAME_H + 40) {
        cloud.y = -40;
        cloud.x = Phaser.Math.Between(VALLEY_LEFT + 40, VALLEY_RIGHT - 40);
      }
    }

    // Clean up off-screen obstacles & count passed
    this.obstacles.getChildren().forEach(obs => {
      if (obs.y > GAME_H + 60) {
        obs.destroy();
        this.obstaclesPassed++;
      }
    });

    // Update HUD
    const progress = Math.min(1, this.obstaclesPassed / CASTLE_DISTANCE);
    this.progressText.setText(`${Math.floor(progress * 100)}% to Crystal Palace`);
    this.progressBar.width = 200 * progress;

    // Trigger castle approach
    if (this.obstaclesPassed >= CASTLE_DISTANCE && !this.castleApproaching) {
      this.startCastleApproach();
    }
  }
}
