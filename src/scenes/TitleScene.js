import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    // --- Animated sky background ---
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Scrolling clouds
    this.cloudList = [];
    for (let i = 0; i < 8; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(0, 900),
        Phaser.Math.Between(30, 200),
        Phaser.Math.Between(60, 120),
        Phaser.Math.Between(25, 45),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.4, 0.7)
      );
      cloud.speed = Phaser.Math.FloatBetween(0.2, 0.6);
      this.cloudList.push(cloud);
    }

    // Green hills
    for (let i = 0; i < 5; i++) {
      const hx = i * 200 + Phaser.Math.Between(-30, 30);
      this.add.ellipse(hx, 380, 250, 100, 0x4CAF50, 0.6);
    }

    // Ground
    this.add.rectangle(400, 420, 800, 60, 0x3A7D2C);
    this.add.rectangle(400, 440, 800, 30, 0x2D5A1E);

    // Flowers on the ground
    for (let x = 30; x < 800; x += 40 + Math.random() * 30) {
      const fc = [0xFF69B4, 0xFFD700, 0xFF6B8A, 0xDA70D6][Math.floor(Math.random() * 4)];
      this.add.circle(x, 400 + Math.random() * 10, 3, fc);
    }

    // --- Title ---
    const titleShadow = this.add.text(402, 62, 'Dax the Cat', {
      fontSize: '52px', color: '#000000', fontFamily: 'Arial',
    }).setOrigin(0.5).setAlpha(0.3);

    const title = this.add.text(400, 60, 'Dax the Cat', {
      fontSize: '52px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#8B4513', strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [title, titleShadow],
      scaleX: 1.03, scaleY: 1.03,
      duration: 1200, yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtitle
    this.add.text(400, 105, 'A Daniela & Felipe Production', {
      fontSize: '12px', color: '#5D4037', fontFamily: 'Arial',
      stroke: '#FFFFFF', strokeThickness: 1
    }).setOrigin(0.5);

    // --- Dax sprite (bouncing idle) ---
    const dax = this.add.sprite(140, 155, 'dax', 0).setScale(1.6);
    if (this.anims.exists('dax-idle')) {
      dax.play('dax-idle');
    }
    this.tweens.add({
      targets: dax, y: 150, duration: 800,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // --- Dragon flying (if texture exists) ---
    if (this.textures.exists('dragon')) {
      const dragon = this.add.image(680, 130, 'dragon').setScale(0.7).setFlipX(true);
      this.tweens.add({
        targets: dragon, y: 125, x: 685,
        duration: 1500, yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // --- Level Select Buttons ---
    const btnY = 200;

    this.createLevelButton(400, btnY, 'Adventure 1: Fish Dinner', 0x4CAF50, 0x2E7D32, '🐟', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('HouseScene', { postFishing: false });
      });
    });

    this.createLevelButton(400, btnY + 50, 'Adventure 2: Kingdom of Fantasy', 0x6A0DAD, 0x4B0082, '🐉', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('DreamTransitionScene');
      });
    });

    this.createLevelButton(400, btnY + 100, 'Adventure 3: The Crystal Palace', 0x3A6EA0, 0x2A4E70, '👑', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('PalaceScene');
      });
    });

    // --- Quick Play submenu ---
    this.add.text(400, btnY + 148, 'Quick Play', {
      fontSize: '14px', color: '#5D4037', fontFamily: 'Arial',
      stroke: '#FFFFFF', strokeThickness: 1
    }).setOrigin(0.5);

    const quickBtns = [
      { label: 'Fishing', scene: 'FishingScene', data: {}, color: 0x5DADE2 },
      { label: 'Cooking', scene: 'CookingScene', data: {}, color: 0xFF8C42 },
      { label: 'Flying', scene: 'FlyingScene', data: {}, color: 0x87CEEB },
      { label: 'Gate Puzzle', scene: 'MountainPuzzleScene', data: {}, color: 0x8040C0 },
      { label: 'Wizard Battle', scene: 'WizardBattleScene', data: {}, color: 0x40E040 },
    ];

    const spacing = quickBtns.length <= 3 ? 150 : 110;
    const startX = 400 - (quickBtns.length - 1) * (spacing / 2);
    quickBtns.forEach((btn, i) => {
      this.createSmallButton(startX + i * spacing, btnY + 172, btn.label, btn.color, () => {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(btn.scene, btn.data);
        });
      });
    });

    // --- Controls hint ---
    this.add.text(400, 435, 'Arrow keys to move  |  SPACE to interact', {
      fontSize: '14px', color: '#FFFFFF', fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#2E7D32', strokeThickness: 3
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(600);
  }

  createLevelButton(x, y, label, fillColor, strokeColor, emoji, callback) {
    const btnW = 340;
    const btnH = 48;
    const bg = this.add.rectangle(x, y, btnW, btnH, fillColor, 0.9);
    bg.setStrokeStyle(2, strokeColor);
    bg.setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, `${emoji}  ${label}`, {
      fontSize: '18px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    bg.on('pointerover', () => {
      bg.setScale(1.05);
      text.setScale(1.05);
    });
    bg.on('pointerout', () => {
      bg.setScale(1);
      text.setScale(1);
    });
    bg.on('pointerdown', callback);
  }

  createSmallButton(x, y, label, color, callback) {
    const bg = this.add.rectangle(x, y, 100, 32, color, 0.8);
    bg.setStrokeStyle(1, Phaser.Display.Color.IntegerToColor(color).darken(30).color);
    bg.setInteractive({ useHandCursor: true });

    const text = this.add.text(x, y, label, {
      fontSize: '13px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 1
    }).setOrigin(0.5);

    bg.on('pointerover', () => { bg.setScale(1.08); text.setScale(1.08); });
    bg.on('pointerout', () => { bg.setScale(1); text.setScale(1); });
    bg.on('pointerdown', callback);
  }

  update() {
    for (const cloud of this.cloudList) {
      cloud.x += cloud.speed;
      if (cloud.x > 900) {
        cloud.x = -100;
        cloud.y = Phaser.Math.Between(30, 200);
      }
    }
  }
}
