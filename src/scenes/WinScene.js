import Phaser from 'phaser';

export default class WinScene extends Phaser.Scene {
  constructor() {
    super('WinScene');
  }

  create(data) {
    const adventure = data?.adventure || 1;

    if (adventure === 3) {
      this.createAdventure3End();
    } else if (adventure === 2) {
      this.createAdventure2End();
    } else {
      this.createAdventure1End();
    }
  }

  createAdventure1End() {
    this.cameras.main.setBackgroundColor('#1A1A2E');

    // Stars background
    for (let i = 0; i < 40; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 300),
        Phaser.Math.Between(1, 3),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.3, 1)
      );
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0.1 },
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true,
        repeat: -1
      });
    }

    // Victory text
    const title = this.add.text(400, 100, 'You did it, Dax!', {
      fontSize: '42px',
      color: '#FFD700',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Dax celebrating
    const dax = this.add.sprite(400, 250, 'dax', 0);
    dax.setScale(2);
    this.tweens.add({
      targets: dax,
      y: 240,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Fish caught display
    this.add.text(400, 320, '10 fish caught!', {
      fontSize: '24px',
      color: '#5DADE2',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(400, 355, 'Dinner is served! The family is happy!', {
      fontSize: '16px',
      color: '#FFFFFF',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Confetti effect
    this.createConfetti();

    // Buttons
    this.createButton(400, 395, 'Play Again!', 0x4CAF50, 0x2E7D32, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('HouseScene', { postFishing: false });
      });
    });

    this.createButton(400, 435, 'Main Menu', 0x5D4037, 0x3E2723, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TitleScene');
      });
    });

    this.cameras.main.fadeIn(600);
  }

  createAdventure2End() {
    this.cameras.main.setBackgroundColor('#0A0A1E');

    // Dreamy stars
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 350),
        Phaser.Math.Between(1, 3),
        [0xFFFFFF, 0xFFD700, 0xE0C0FF][Phaser.Math.Between(0, 2)],
        Phaser.Math.FloatBetween(0.3, 0.9)
      );
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: Phaser.Math.Between(600, 2000),
        yoyo: true, repeat: -1
      });
    }

    // Title
    const title = this.add.text(400, 80, 'Adventure 2', {
      fontSize: '20px', color: '#C084FC', fontFamily: 'Arial',
      stroke: '#2E0854', strokeThickness: 3
    }).setOrigin(0.5);

    const subtitle = this.add.text(400, 115, 'Kingdom of Fantasy', {
      fontSize: '34px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#1A0A3E', strokeThickness: 4
    }).setOrigin(0.5);
    this.tweens.add({
      targets: subtitle, scaleX: 1.03, scaleY: 1.03,
      duration: 800, yoyo: true, repeat: -1
    });

    // Dax and Silver together
    const dax = this.add.sprite(340, 250, 'dax', 0).setScale(1.8);
    const dragon = this.add.image(490, 240, 'dragon').setScale(1.6).setFlipX(true);

    this.tweens.add({
      targets: [dax, dragon], y: '-=8',
      duration: 1200, yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Story text
    this.add.text(400, 320, 'Dax and Silver are off to see the Queen!', {
      fontSize: '16px', color: '#E0C0FF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(400, 350, 'What quest awaits them at the Crystal Palace?', {
      fontSize: '14px', color: '#C0A0DD', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 1
    }).setOrigin(0.5);

    this.add.text(400, 385, 'To be continued...', {
      fontSize: '22px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#2E0854', strokeThickness: 3
    }).setOrigin(0.5);

    // Confetti (magical sparkle version)
    this.createConfetti();

    // Buttons
    this.createButton(400, 415, 'Play Again!', 0x6A0DAD, 0x4B0082, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('DreamTransitionScene');
      });
    });

    this.createButton(400, 450, 'Main Menu', 0x5D4037, 0x3E2723, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TitleScene');
      });
    });

    this.cameras.main.fadeIn(800);
  }

  createAdventure3End() {
    this.cameras.main.setBackgroundColor('#0A0A2A');

    // Deep space stars
    for (let i = 0; i < 60; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 350),
        Phaser.Math.Between(1, 3),
        [0xFFFFFF, 0xFFD700, 0x87CEEB, 0xE0C0FF][Phaser.Math.Between(0, 3)],
        Phaser.Math.FloatBetween(0.2, 0.9)
      );
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: Phaser.Math.Between(600, 2000),
        yoyo: true, repeat: -1
      });
    }

    // Title
    const title = this.add.text(400, 60, 'Adventure 3', {
      fontSize: '20px', color: '#87CEEB', fontFamily: 'Arial',
      stroke: '#1A1A3E', strokeThickness: 3
    }).setOrigin(0.5);

    const subtitle = this.add.text(400, 95, 'Malachar Defeated!', {
      fontSize: '28px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#1A0A3E', strokeThickness: 4
    }).setOrigin(0.5);
    this.tweens.add({
      targets: subtitle, scaleX: 1.03, scaleY: 1.03,
      duration: 800, yoyo: true, repeat: -1
    });

    // Dax and Silver together
    const dax = this.add.sprite(320, 220, 'dax', 0).setScale(1.8);
    const dragon = this.add.image(470, 210, 'dragon').setScale(1.4).setFlipX(true);

    this.tweens.add({
      targets: [dax, dragon], y: '-=6',
      duration: 1200, yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Story text
    this.add.text(400, 285, 'Dax defeated Malachar with the magic shield!', {
      fontSize: '15px', color: '#E0C0FF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(400, 310, 'But the wizard escaped... leaving a clue behind:', {
      fontSize: '13px', color: '#C0A0DD', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 1
    }).setOrigin(0.5);

    this.add.text(400, 335, '"Fang Village — the village of the wolves"', {
      fontSize: '15px', color: '#FF9040', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2,
      fontStyle: 'italic'
    }).setOrigin(0.5);

    this.add.text(400, 365, 'To be continued...', {
      fontSize: '24px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#1A1A3E', strokeThickness: 3
    }).setOrigin(0.5);

    this.createConfetti();

    // Buttons
    this.createButton(400, 395, 'Play Again!', 0x3A6EA0, 0x2A4E70, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('DreamTransitionScene');
      });
    });

    this.createButton(400, 435, 'Main Menu', 0x5D4037, 0x3E2723, () => {
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TitleScene');
      });
    });

    this.cameras.main.fadeIn(800);
  }

  createConfetti() {
    for (let i = 0; i < 30; i++) {
      const colors = [0xFF6B8A, 0xFFD700, 0x5DADE2, 0x4CAF50, 0xDA70D6, 0xFF8C42];
      const confetti = this.add.rectangle(
        Phaser.Math.Between(50, 750),
        -20,
        Phaser.Math.Between(6, 12),
        Phaser.Math.Between(6, 12),
        colors[Phaser.Math.Between(0, colors.length - 1)]
      );

      this.tweens.add({
        targets: confetti,
        y: 500,
        x: confetti.x + Phaser.Math.Between(-80, 80),
        angle: Phaser.Math.Between(0, 720),
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 2000),
        repeat: -1,
        onRepeat: () => {
          confetti.y = -20;
          confetti.x = Phaser.Math.Between(50, 750);
        }
      });
    }
  }

  createButton(x, y, label, fillColor, strokeColor, callback) {
    const btnBg = this.add.rectangle(x, y, 200, 45, fillColor, 0.9);
    btnBg.setStrokeStyle(2, strokeColor);
    btnBg.setInteractive({ useHandCursor: true });

    const btnText = this.add.text(x, y, label, {
      fontSize: '20px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(Phaser.Display.Color.ComponentToHex(
        Math.min(255, (fillColor >> 16) + 30),
        Math.min(255, ((fillColor >> 8) & 0xFF) + 30),
        Math.min(255, (fillColor & 0xFF) + 30)
      ));
      btnText.setScale(1.05);
    });
    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(fillColor);
      btnText.setScale(1);
    });
    btnBg.on('pointerdown', callback);
  }
}
