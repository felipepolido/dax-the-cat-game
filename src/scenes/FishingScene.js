import Phaser from 'phaser';
import Dax from '../sprites/Dax.js';
import Fish from '../sprites/Fish.js';

const BRIDGE_Y = 370;
const FISH_GOAL = 10;

export default class FishingScene extends Phaser.Scene {
  constructor() {
    super('FishingScene');
  }

  create() {
    this.fishCaught = 0;
    this.tomCaught = 0;
    this.daxCaught = 0;

    // --- Background ---
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Water
    this.add.rectangle(400, 430, 800, 80, 0x2E86C1, 0.9);
    this.add.rectangle(400, 395, 800, 10, 0x5DADE2, 0.6);

    // Shimmer lines
    for (let i = 0; i < 12; i++) {
      const shimmer = this.add.rectangle(
        40 + i * 65, 410 + Math.random() * 25,
        40 + Math.random() * 30, 2, 0x85C1E9, 0.4
      );
      this.tweens.add({
        targets: shimmer, x: shimmer.x + 20,
        alpha: { from: 0.2, to: 0.5 },
        duration: 1500 + Math.random() * 1000, yoyo: true, repeat: -1
      });
    }

    // --- Riverbanks ---
    this.add.rectangle(60, BRIDGE_Y + 30, 120, 80, 0x5C4410);
    this.add.rectangle(60, BRIDGE_Y - 5, 120, 14, 0x4A8C2A);
    this.add.circle(15, BRIDGE_Y + 5, 7, 0x808080);
    this.add.circle(105, BRIDGE_Y + 3, 5, 0x909090);
    this.add.rectangle(740, BRIDGE_Y + 30, 120, 80, 0x5C4410);
    this.add.rectangle(740, BRIDGE_Y - 5, 120, 14, 0x4A8C2A);

    // --- Bridge ---
    const bridgeStartX = 120;
    const bridgeEndX = 680;
    const bridgeWidth = bridgeEndX - bridgeStartX;

    const postColor = 0x5C3A1E;
    this.add.rectangle(bridgeStartX + 20, BRIDGE_Y + 20, 10, 40, postColor);
    this.add.rectangle(bridgeEndX - 20, BRIDGE_Y + 20, 10, 40, postColor);
    this.add.rectangle(400, BRIDGE_Y + 25, 10, 50, postColor);

    for (let x = bridgeStartX; x < bridgeEndX; x += 18) {
      const plank = this.add.rectangle(x + 9, BRIDGE_Y, 16, 10, 0x8B6914);
      plank.setStrokeStyle(1, 0x6B4E10);
    }

    this.add.rectangle(bridgeStartX + bridgeWidth / 2, BRIDGE_Y - 18, bridgeWidth, 3, 0x6B4226);
    for (let x = bridgeStartX + 30; x < bridgeEndX; x += 60) {
      this.add.rectangle(x, BRIDGE_Y - 10, 4, 16, 0x6B4226);
    }

    // Bridge collision
    const bridgeGround = this.add.rectangle(
      bridgeStartX + bridgeWidth / 2, BRIDGE_Y + 4,
      bridgeWidth + 120, 8, 0x000000, 0
    );
    this.physics.add.existing(bridgeGround, true);

    // --- Dax ---
    this.dax = new Dax(this, 80, BRIDGE_Y - 50);
    this.dax.body.setCollideWorldBounds(true);
    this.physics.add.collider(this.dax, bridgeGround);

    // --- Tom on the bridge ---
    this.tom = this.add.image(130, BRIDGE_Y - 28, 'cat-brother').setScale(0.9);
    this.tomLabel = this.add.text(130, BRIDGE_Y - 55, 'Tom', {
      fontSize: '9px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);
    // Tom follows Dax
    this.tomPositions = [];
    this.tomFollowDelay = 18;

    // Tom auto-catches fish independently
    this.tomSwipeTimer = this.time.addEvent({
      delay: 2500,
      callback: this.tomTrySwipe,
      callbackScope: this,
      loop: true
    });

    this.physics.world.setBounds(10, 0, 780, 450);

    // --- Fish group ---
    this.fishGroup = this.physics.add.group({
      classType: Fish,
      maxSize: 8,
      runChildUpdate: true
    });

    // Swipe hitbox detection
    this.events.on('dax-swipe', (dax) => {
      this.checkSwipeCatch(dax, true);
    });

    // Fish spawn timer (faster with two cats!)
    this.spawnTimer = this.time.addEvent({
      delay: 1200,
      callback: this.spawnFish,
      callbackScope: this,
      loop: true
    });
    this.time.delayedCall(400, () => this.spawnFish());

    // --- HUD ---
    this.fishCountText = this.add.text(400, 16, `Fish: 0 / ${FISH_GOAL}`, {
      fontSize: '22px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(400, 44, 'SPACE to swipe! Tom is helping too!', {
      fontSize: '14px', color: '#ffffff', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // Score breakdown
    this.scoreText = this.add.text(400, 90, '', {
      fontSize: '11px', color: '#CCCCCC', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 1
    }).setOrigin(0.5);

    // Fish icons
    this.fishIcons = [];
    for (let i = 0; i < FISH_GOAL; i++) {
      const icon = this.add.sprite(315 + i * 18, 70, 'fish', 0)
        .setScale(0.8).setAlpha(0.3);
      this.fishIcons.push(icon);
    }

    this.cameras.main.fadeIn(500);
  }

  spawnFish() {
    if (this.fishCaught >= FISH_GOAL) return;
    const fish = this.fishGroup.get();
    if (!fish) return;

    const fromX = Phaser.Math.Between(150, 650);
    const velY = Phaser.Math.Between(-520, -420);
    const velX = Phaser.Math.Between(-30, 30);
    fish.launch(fromX, velY, velX);
    fish.play('fish-swim');
  }

  tomTrySwipe() {
    if (this.fishCaught >= FISH_GOAL) return;

    // Find nearest active fish to Tom
    let nearest = null;
    let nearestDist = Infinity;

    this.fishGroup.getChildren().forEach(fish => {
      if (!fish.active || fish.caught) return;
      const dist = Phaser.Math.Distance.Between(this.tom.x, this.tom.y, fish.x, fish.y);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = fish;
      }
    });

    // Tom can catch if a fish is close enough
    if (nearest && nearestDist < 80) {
      // Tom swipe animation — brief scale pulse
      this.tweens.add({
        targets: this.tom, scaleX: 1.1, scaleY: 0.8,
        duration: 100, yoyo: true
      });

      this.catchFish(nearest, false);

      // Tom says something
      const tomWords = ['Got one!', 'Easy!', 'Haha!', 'Teamwork!'];
      const word = tomWords[Phaser.Math.Between(0, tomWords.length - 1)];
      const floatText = this.add.text(this.tom.x, this.tom.y - 40, word, {
        fontSize: '14px', color: '#5DADE2', fontFamily: 'Arial',
        stroke: '#000000', strokeThickness: 2
      }).setOrigin(0.5);
      this.tweens.add({
        targets: floatText, y: floatText.y - 30, alpha: 0,
        duration: 700, onComplete: () => floatText.destroy()
      });
    }
  }

  checkSwipeCatch(dax, isDax) {
    if (this.fishCaught >= FISH_GOAL) return;

    const dirX = dax.flipX ? -1 : 1;
    const swipeX = dax.x + dirX * 30;
    const swipeY = dax.y - 10;

    const swipeBounds = new Phaser.Geom.Rectangle(
      swipeX - 30, swipeY - 28, 60, 56
    );

    this.fishGroup.getChildren().forEach(fish => {
      if (!fish.active || fish.caught) return;
      if (Phaser.Geom.Rectangle.Overlaps(fish.getBounds(), swipeBounds)) {
        this.catchFish(fish, isDax);
      }
    });
  }

  catchFish(fish, isDax) {
    fish.catch();
    this.fishCaught++;
    if (isDax) {
      this.daxCaught++;
    } else {
      this.tomCaught++;
    }

    this.fishCountText.setText(`Fish: ${this.fishCaught} / ${FISH_GOAL}`);
    this.scoreText.setText(`Dax: ${this.daxCaught}  |  Tom: ${this.tomCaught}`);

    // Light up icon
    if (this.fishCaught <= FISH_GOAL) {
      const icon = this.fishIcons[this.fishCaught - 1];
      icon.setAlpha(1);
      // Tint based on who caught it
      if (!isDax) icon.setTint(0x5DADE2);
      this.tweens.add({
        targets: icon, scaleX: 1.3, scaleY: 1.3,
        duration: 150, yoyo: true
      });
    }

    // Floating text (only for Dax catches — Tom has his own)
    if (isDax) {
      const niceWords = ['Nice!', 'Got it!', 'Yay!', 'Great!', 'Meow!', 'Purrfect!'];
      const word = niceWords[Phaser.Math.Between(0, niceWords.length - 1)];
      const floatText = this.add.text(fish.x, fish.y - 20, word, {
        fontSize: '18px', color: '#FFD700', fontFamily: 'Arial',
        stroke: '#000000', strokeThickness: 2
      }).setOrigin(0.5);
      this.tweens.add({
        targets: floatText, y: floatText.y - 40, alpha: 0,
        duration: 800, onComplete: () => floatText.destroy()
      });
    }

    this.cameras.main.shake(80, 0.004);

    // Win check
    if (this.fishCaught >= FISH_GOAL) {
      this.spawnTimer.remove();
      this.tomSwipeTimer.remove();
      this.fishCountText.setText('All 10 fish caught! Head home!');
      this.scoreText.setText(`Dax: ${this.daxCaught}  |  Tom: ${this.tomCaught}  — Great teamwork!`);
      this.time.delayedCall(1500, () => {
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('PlatformScene', { returnFromFishing: true });
        });
      });
    }
  }

  update() {
    this.dax.update();

    // Tom follows Dax on the bridge
    this.tomPositions.push({ x: this.dax.x, flipX: this.dax.flipX });
    if (this.tomPositions.length > this.tomFollowDelay) {
      const delayed = this.tomPositions.shift();
      this.tom.x += (delayed.x - this.tom.x) * 0.12;
      this.tom.y = BRIDGE_Y - 28;
      this.tom.setFlipX(delayed.flipX);
      this.tomLabel.x = this.tom.x;
      this.tomLabel.y = this.tom.y - 27;
    }
  }
}
