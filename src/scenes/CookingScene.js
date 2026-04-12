import Phaser from 'phaser';

const TOTAL_FISH = 10;

export default class CookingScene extends Phaser.Scene {
  constructor() {
    super('CookingScene');
  }

  create() {
    this.fishCooked = 0;
    this.canChop = false;

    this.cameras.main.setBackgroundColor('#F5E6C8');

    // Kitchen background
    // Back wall
    this.add.rectangle(400, 200, 800, 400, 0xF0DCC0);
    this.add.rectangle(400, 350, 800, 100, 0xD4A86A);
    this.add.rectangle(400, 298, 800, 4, 0xB8903C);
    // Floor
    this.add.rectangle(400, 420, 800, 60, 0x8B6914);

    // --- Stove with pot (right side) ---
    this.add.rectangle(650, 340, 80, 70, 0x555555);
    this.add.rectangle(650, 340, 80, 70).setStrokeStyle(2, 0x333333);
    this.add.circle(640, 318, 8, 0x333333);
    this.add.circle(660, 318, 8, 0x333333);
    // Pot
    this.add.rectangle(650, 295, 40, 25, 0x444444).setStrokeStyle(2, 0x333333);
    this.add.rectangle(650, 280, 44, 5, 0x555555).setStrokeStyle(1, 0x333333);
    // Pot handles
    this.add.circle(628, 290, 4, 0x333333);
    this.add.circle(672, 290, 4, 0x333333);

    // Fire under pot
    this.potFire = this.add.circle(650, 315, 12, 0xFF6600, 0.4);
    this.tweens.add({
      targets: this.potFire,
      alpha: { from: 0.2, to: 0.5 },
      scaleX: { from: 0.8, to: 1.2 },
      duration: 300, yoyo: true, repeat: -1
    });

    // --- Cutting board (center) ---
    this.add.rectangle(350, 340, 120, 15, 0xA0784C).setStrokeStyle(2, 0x6B4226);
    // Board texture lines
    this.add.rectangle(350, 340, 1, 15, 0x8B6914);
    this.add.rectangle(330, 340, 1, 15, 0x8B6914);
    this.add.rectangle(370, 340, 1, 15, 0x8B6914);

    // Table under cutting board
    this.add.rectangle(350, 360, 140, 10, 0x8B5E3C).setStrokeStyle(1, 0x5C3A1E);
    this.add.rectangle(290, 380, 5, 30, 0x6B4226);
    this.add.rectangle(410, 380, 5, 30, 0x6B4226);

    // --- Knife (follows a chop animation) ---
    this.knife = this.add.triangle(350, 290, 0, 0, 5, -30, 10, 0, 0xCCCCCC);
    this.knife.setStrokeStyle(1, 0x999999);
    // Handle
    this.knifeHandle = this.add.rectangle(355, 294, 8, 12, 0x6B4226);
    this.knifeHandle.setStrokeStyle(1, 0x5C3A1E);

    // --- Mom watching (left side) ---
    this.add.image(120, 365, 'cat-mom');
    this.add.text(120, 330, 'Mom', {
      fontSize: '10px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // --- Tom watching (far left) ---
    this.add.image(60, 365, 'cat-brother');
    this.add.text(60, 330, 'Tom', {
      fontSize: '10px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // --- Dax at the cutting board ---
    this.daxSprite = this.add.sprite(350, 365, 'dax', 0).setScale(0.9);

    // --- HUD ---
    this.add.text(400, 20, 'Chop the fish! Press SPACE!', {
      fontSize: '20px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);

    this.progressText = this.add.text(400, 50, `Fish: 0 / ${TOTAL_FISH}`, {
      fontSize: '16px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // Fish icons
    this.fishIcons = [];
    for (let i = 0; i < TOTAL_FISH; i++) {
      const icon = this.add.sprite(315 + i * 18, 75, 'fish', 0)
        .setScale(0.8).setAlpha(0.3);
      this.fishIcons.push(icon);
    }

    // --- Steam from pot (appears as fish get added) ---
    this.steamGroup = [];

    // Timing bar
    this.barBg = this.add.rectangle(350, 250, 160, 14, 0x333333).setStrokeStyle(1, 0x111111);
    this.barFill = this.add.rectangle(350 - 78, 250, 0, 10, 0x4CAF50).setOrigin(0, 0.5);
    this.barTarget = this.add.rectangle(350 + 20, 250, 4, 14, 0xFFD700);
    this.add.text(350, 238, '| Sweet spot! |', {
      fontSize: '8px', color: '#FFD700', fontFamily: 'Arial'
    }).setOrigin(0.5, 1);

    // The moving indicator
    this.barIndicator = this.add.rectangle(350 - 78, 250, 6, 16, 0xFF4444);
    this.barDirection = 1;
    this.barSpeed = 2.5;

    // Current fish on the cutting board
    this.currentFish = this.add.sprite(350, 330, 'fish', 0).setScale(2).setVisible(false);

    // Chopped fish halves (hidden until chop)
    this.chopLeft = this.add.sprite(340, 330, 'fish', 0).setScale(1).setVisible(false).setTint(0xFFAAAA);
    this.chopRight = this.add.sprite(360, 330, 'fish', 0).setScale(1).setVisible(false).setTint(0xFFAAAA);

    // SPACE key
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Start first fish
    this.cameras.main.fadeIn(400);
    this.time.delayedCall(500, () => this.presentFish());
  }

  presentFish() {
    if (this.fishCooked >= TOTAL_FISH) return;

    // Fish slides onto cutting board
    this.currentFish.setPosition(500, 330).setVisible(true).setScale(2).setAlpha(1).setAngle(0);
    this.chopLeft.setVisible(false);
    this.chopRight.setVisible(false);

    this.tweens.add({
      targets: this.currentFish,
      x: 350,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.canChop = true;
        // Reset bar indicator
        this.barIndicator.x = 350 - 78;
        this.barDirection = 1;
      }
    });
  }

  chopFish() {
    this.canChop = false;

    // Check how close to sweet spot (center-right area)
    const indicatorPos = this.barIndicator.x;
    const sweetSpotCenter = 350 + 20;
    const distance = Math.abs(indicatorPos - sweetSpotCenter);
    const isPerfect = distance < 15;
    const isGood = distance < 30;

    // Knife chop animation
    this.tweens.add({
      targets: [this.knife, this.knifeHandle],
      y: '+=30',
      duration: 80,
      yoyo: true,
      onComplete: () => {
        // Chop result
        this.currentFish.setVisible(false);

        // Show chopped halves
        this.chopLeft.setPosition(340, 330).setVisible(true).setAngle(-10);
        this.chopRight.setPosition(360, 330).setVisible(true).setAngle(10);

        // Rating text
        let rating, color;
        if (isPerfect) {
          rating = 'PERFECT!'; color = '#FFD700';
        } else if (isGood) {
          rating = 'Good!'; color = '#90EE90';
        } else {
          rating = 'Ok!'; color = '#FFFFFF';
        }

        const ratingText = this.add.text(350, 300, rating, {
          fontSize: '20px', color, fontFamily: 'Arial',
          stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);
        this.tweens.add({
          targets: ratingText, y: 280, alpha: 0,
          duration: 600, onComplete: () => ratingText.destroy()
        });

        // Dax swipe animation
        this.daxSprite.setFrame(5);
        this.time.delayedCall(300, () => this.daxSprite.setFrame(0));

        // Screen shake on perfect
        if (isPerfect) this.cameras.main.shake(60, 0.003);

        // Fly the chopped fish to the pot
        this.time.delayedCall(300, () => {
          this.tweens.add({
            targets: this.chopLeft,
            x: 650, y: 280, alpha: 0, angle: -180, scaleX: 0.5, scaleY: 0.5,
            duration: 500, ease: 'Power2'
          });
          this.tweens.add({
            targets: this.chopRight,
            x: 650, y: 280, alpha: 0, angle: 180, scaleX: 0.5, scaleY: 0.5,
            duration: 500, ease: 'Power2',
            delay: 100,
            onComplete: () => {
              // Splash in pot
              this.potSplash();
              this.fishCooked++;
              this.progressText.setText(`Fish: ${this.fishCooked} / ${TOTAL_FISH}`);

              // Light up icon
              if (this.fishCooked <= TOTAL_FISH) {
                const icon = this.fishIcons[this.fishCooked - 1];
                icon.setAlpha(1);
                this.tweens.add({
                  targets: icon, scaleX: 1.3, scaleY: 1.3,
                  duration: 150, yoyo: true
                });
              }

              // Add more steam as we cook
              if (this.fishCooked % 3 === 0) this.addSteam();

              // Speed up the bar as we progress
              this.barSpeed = 2.5 + this.fishCooked * 0.2;

              if (this.fishCooked >= TOTAL_FISH) {
                this.finishCooking();
              } else {
                this.time.delayedCall(400, () => this.presentFish());
              }
            }
          });
        });
      }
    });
  }

  potSplash() {
    // Small splash effect above pot
    for (let i = 0; i < 5; i++) {
      const drop = this.add.circle(
        650 + Phaser.Math.Between(-15, 15),
        280,
        Phaser.Math.Between(2, 4),
        0x5DADE2
      );
      this.tweens.add({
        targets: drop,
        y: drop.y - Phaser.Math.Between(10, 25),
        x: drop.x + Phaser.Math.Between(-10, 10),
        alpha: 0,
        duration: 400,
        delay: i * 50,
        onComplete: () => drop.destroy()
      });
    }
  }

  addSteam() {
    for (let i = 0; i < 2; i++) {
      const steam = this.add.text(645 + i * 12, 265, '~', {
        fontSize: '14px', color: '#CCCCCC', fontFamily: 'Arial'
      });
      this.tweens.add({
        targets: steam, y: steam.y - 20, alpha: 0,
        duration: 1500, delay: i * 400, repeat: -1
      });
      this.steamGroup.push(steam);
    }
  }

  finishCooking() {
    this.progressText.setText('All fish cooked!');
    this.barBg.setVisible(false);
    this.barFill.setVisible(false);
    this.barTarget.setVisible(false);
    this.barIndicator.setVisible(false);

    // Big steam burst
    for (let i = 0; i < 8; i++) {
      const steam = this.add.text(640 + i * 4, 260, '~', {
        fontSize: '16px', color: '#DDDDDD', fontFamily: 'Arial'
      });
      this.tweens.add({
        targets: steam, y: steam.y - 30, alpha: 0,
        duration: 1200, delay: i * 150, repeat: 2
      });
    }

    this.time.delayedCall(1500, () => {
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('HouseScene', { postCooking: true });
      });
    });
  }

  update() {
    if (!this.canChop) return;

    // Move the bar indicator back and forth
    this.barIndicator.x += this.barDirection * this.barSpeed;
    if (this.barIndicator.x >= 350 + 78) this.barDirection = -1;
    if (this.barIndicator.x <= 350 - 78) this.barDirection = 1;

    // Update fill bar color based on position
    const pos = (this.barIndicator.x - (350 - 78)) / 156;
    this.barFill.width = pos * 156;

    const sweetDist = Math.abs(this.barIndicator.x - (350 + 20));
    if (sweetDist < 15) {
      this.barIndicator.fillColor = 0x4CAF50;
    } else if (sweetDist < 30) {
      this.barIndicator.fillColor = 0xFFD700;
    } else {
      this.barIndicator.fillColor = 0xFF4444;
    }

    // SPACE to chop
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.chopFish();
    }
  }
}
