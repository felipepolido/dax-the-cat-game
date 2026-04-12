import Phaser from 'phaser';
import Dax from '../sprites/Dax.js';

const FLOOR_Y = 390;

export default class HouseScene extends Phaser.Scene {
  constructor() {
    super('HouseScene');
  }

  create(data) {
    this.postFishing = data?.postFishing || false;
    this.postCooking = data?.postCooking || false;
    this.dialogActive = false;
    this.dialogQueue = [];
    this.dialogCallback = null;

    this.cameras.main.setBackgroundColor('#F5E6C8');

    // --- Walls & floor ---
    // Upper wall
    this.add.rectangle(400, 170, 800, 340, 0xF0DCC0);
    // Wallpaper stripe pattern (subtle)
    for (let x = 20; x < 800; x += 40) {
      this.add.rectangle(x, 170, 1, 300, 0xE8D4B0, 0.3);
    }
    // Wainscoting (lower wall panel)
    this.add.rectangle(400, 340, 800, 80, 0xD4A86A);
    this.add.rectangle(400, 298, 800, 4, 0xB8903C);
    // Wainscoting panel details
    for (let x = 40; x < 800; x += 100) {
      this.add.rectangle(x, 340, 80, 60, 0xD4A86A).setStrokeStyle(1, 0xC49A5C);
    }
    // Baseboard
    this.add.rectangle(400, FLOOR_Y - 2, 800, 4, 0x6B4226);
    // Floor
    this.add.rectangle(400, FLOOR_Y + 25, 800, 50, 0x8B6914);
    for (let x = 0; x < 800; x += 80) {
      this.add.rectangle(x, FLOOR_Y + 25, 1, 50, 0x7A5C10);
    }
    // Floor highlight strip
    this.add.rectangle(400, FLOOR_Y + 2, 800, 3, 0x9B7924, 0.5);

    // --- Ceiling lamp ---
    this.add.rectangle(400, 100, 3, 40, 0x888888);
    this.add.rectangle(400, 140, 40, 6, 0xCCBB88).setStrokeStyle(1, 0xAA9968);
    this.add.ellipse(400, 144, 50, 14, 0xFFF8DC).setStrokeStyle(1, 0xCCBB88);
    // Light glow
    this.add.circle(400, 148, 8, 0xFFE88C, 0.3);

    // --- Wall pictures ---
    // Family portrait (left wall)
    this.add.rectangle(220, 190, 50, 40, 0xFFE4C4).setStrokeStyle(3, 0x8B6914);
    // Tiny cats in portrait
    this.add.circle(207, 195, 4, 0xF0B860); // Dax
    this.add.circle(220, 195, 4, 0xC0C0C8); // Mom
    this.add.circle(233, 195, 4, 0xD49040); // Tom
    this.add.circle(220, 185, 3, 0xFF6B8A); // Heart

    // Fish painting (right of window)
    this.add.rectangle(710, 190, 40, 30, 0xB8E4F0).setStrokeStyle(2, 0x6B4226);
    this.add.sprite(710, 190, 'fish', 0).setScale(1.2);

    // --- Clock ---
    this.add.circle(330, 170, 16, 0xFFF8DC).setStrokeStyle(2, 0x6B4226);
    this.add.circle(330, 170, 14, 0xFFFFFF).setStrokeStyle(1, 0xDDCCAA);
    // Clock hands
    this.add.rectangle(330, 165, 2, 10, 0x333333).setOrigin(0.5, 1);
    this.add.rectangle(332, 170, 8, 2, 0x333333).setOrigin(0, 0.5);
    // Clock numbers
    this.add.text(330, 158, '12', { fontSize: '5px', color: '#333', fontFamily: 'Arial' }).setOrigin(0.5);
    this.add.text(342, 170, '3', { fontSize: '5px', color: '#333', fontFamily: 'Arial' }).setOrigin(0.5);
    this.add.text(330, 182, '6', { fontSize: '5px', color: '#333', fontFamily: 'Arial' }).setOrigin(0.5);
    this.add.text(318, 170, '9', { fontSize: '5px', color: '#333', fontFamily: 'Arial' }).setOrigin(0.5);

    // --- Window (improved with curtains) ---
    // Window recess
    this.add.rectangle(600, 200, 90, 80, 0xCCBB98);
    // Glass
    this.add.rectangle(600, 200, 80, 70, 0x87CEEB);
    // Sky gradient inside window
    this.add.rectangle(600, 175, 78, 20, 0x6AB0E0, 0.5);
    // Frame
    this.add.rectangle(600, 200, 80, 70).setStrokeStyle(3, 0x6B4226);
    this.add.rectangle(600, 200, 2, 70, 0x6B4226);
    this.add.rectangle(600, 200, 80, 2, 0x6B4226);
    // Curtains (draped on sides)
    this.add.rectangle(556, 195, 14, 75, 0xCC3333, 0.8);
    this.add.rectangle(556, 195, 14, 75).setStrokeStyle(1, 0xAA2222);
    this.add.rectangle(644, 195, 14, 75, 0xCC3333, 0.8);
    this.add.rectangle(644, 195, 14, 75).setStrokeStyle(1, 0xAA2222);
    // Curtain rod
    this.add.rectangle(600, 160, 110, 3, 0x8B6914);
    this.add.circle(544, 160, 4, 0x8B6914);
    this.add.circle(656, 160, 4, 0x8B6914);
    // Windowsill
    this.add.rectangle(600, 237, 90, 5, 0x6B4226);

    // --- Bookshelf (left wall, above bed) ---
    // Shelf boards
    this.add.rectangle(100, 200, 70, 5, 0x8B6914).setStrokeStyle(1, 0x6B4226);
    this.add.rectangle(100, 230, 70, 5, 0x8B6914).setStrokeStyle(1, 0x6B4226);
    // Books on top shelf
    this.add.rectangle(75, 192, 8, 14, 0xCC3333);
    this.add.rectangle(84, 194, 6, 10, 0x4A90D9);
    this.add.rectangle(92, 191, 7, 16, 0x4CAF50);
    this.add.rectangle(101, 193, 8, 12, 0xDA70D6);
    this.add.rectangle(110, 190, 6, 18, 0xFFD700);
    this.add.rectangle(120, 194, 7, 10, 0xFF8C42);
    // Books on bottom shelf
    this.add.rectangle(78, 222, 8, 14, 0x5B8DBE);
    this.add.rectangle(88, 224, 6, 10, 0xCC3333);
    this.add.rectangle(97, 221, 9, 16, 0x8B6914);
    this.add.rectangle(108, 223, 7, 12, 0x4CAF50);
    this.add.rectangle(118, 222, 6, 14, 0xDA70D6);

    // --- Couch/Sofa (left-center) ---
    // Sofa body
    this.add.rectangle(230, FLOOR_Y - 15, 80, 25, 0x6A5ACD).setStrokeStyle(2, 0x483D8B);
    // Sofa back
    this.add.rectangle(230, FLOOR_Y - 32, 80, 14, 0x7B68EE).setStrokeStyle(1, 0x483D8B);
    // Arm rests
    this.add.rectangle(189, FLOOR_Y - 18, 8, 30, 0x6A5ACD).setStrokeStyle(1, 0x483D8B);
    this.add.rectangle(271, FLOOR_Y - 18, 8, 30, 0x6A5ACD).setStrokeStyle(1, 0x483D8B);
    // Cushion lines
    this.add.rectangle(215, FLOOR_Y - 15, 1, 20, 0x483D8B, 0.4);
    this.add.rectangle(245, FLOOR_Y - 15, 1, 20, 0x483D8B, 0.4);
    // Cushion/pillow
    this.add.ellipse(205, FLOOR_Y - 22, 18, 12, 0xFF8C42, 0.8);

    // --- Bed (improved) ---
    // Bed frame
    this.add.rectangle(100, FLOOR_Y - 10, 100, 30, 0x8B5E3C).setStrokeStyle(2, 0x5C3A1E);
    // Headboard
    this.add.rectangle(52, FLOOR_Y - 30, 8, 40, 0x6B4226);
    this.add.rectangle(52, FLOOR_Y - 45, 14, 10, 0x6B4226); // Headboard top
    // Pillow
    this.add.ellipse(70, FLOOR_Y - 24, 30, 14, 0xFFFFFF).setStrokeStyle(1, 0xDDDDDD);
    // Blanket
    this.add.rectangle(110, FLOOR_Y - 18, 60, 16, 0x4A90D9, 0.7);
    // Blanket pattern
    this.add.rectangle(110, FLOOR_Y - 18, 60, 2, 0x3A80C0, 0.5);
    // Bed legs
    this.add.rectangle(55, FLOOR_Y + 4, 4, 8, 0x5C3A1E);
    this.add.rectangle(148, FLOOR_Y + 4, 4, 8, 0x5C3A1E);
    if (!this.postFishing && !this.postCooking) {
      this.sleepText = this.add.text(120, FLOOR_Y - 55, 'Zzz...', {
        fontSize: '14px', color: '#6666AA', fontFamily: 'Arial',
        stroke: '#FFFFFF', strokeThickness: 1
      });
      this.tweens.add({
        targets: this.sleepText, y: this.sleepText.y - 8,
        alpha: { from: 1, to: 0.3 }, duration: 1000, yoyo: true, repeat: -1
      });
    }

    // --- Plant (next to window) ---
    // Pot
    this.add.rectangle(540, FLOOR_Y - 8, 18, 16, 0xCC6633).setStrokeStyle(1, 0x994422);
    this.add.rectangle(540, FLOOR_Y - 17, 22, 4, 0xCC6633).setStrokeStyle(1, 0x994422);
    // Leaves
    this.add.ellipse(536, FLOOR_Y - 28, 8, 12, 0x4CAF50).setAngle(-15);
    this.add.ellipse(544, FLOOR_Y - 30, 8, 12, 0x4CAF50).setAngle(10);
    this.add.ellipse(540, FLOOR_Y - 34, 7, 10, 0x66BB6A).setAngle(0);
    this.add.ellipse(533, FLOOR_Y - 24, 6, 10, 0x388E3C).setAngle(-25);
    this.add.ellipse(547, FLOOR_Y - 26, 6, 10, 0x388E3C).setAngle(20);

    // --- Kitchen (improved) ---
    // Counter
    this.add.rectangle(680, FLOOR_Y - 20, 120, 10, 0xA0784C).setStrokeStyle(1, 0x6B4226);
    // Counter top surface
    this.add.rectangle(680, FLOOR_Y - 26, 120, 3, 0xB8903C);
    // Counter legs
    this.add.rectangle(630, FLOOR_Y - 5, 6, 20, 0x8B6914);
    this.add.rectangle(730, FLOOR_Y - 5, 6, 20, 0x8B6914);
    // Stove
    this.add.rectangle(760, FLOOR_Y - 35, 50, 40, 0x555555).setStrokeStyle(2, 0x333333);
    this.add.circle(750, FLOOR_Y - 42, 6, 0x333333);
    this.add.circle(770, FLOOR_Y - 42, 6, 0x333333);
    this.add.rectangle(760, FLOOR_Y - 22, 30, 16, 0x444444).setStrokeStyle(1, 0x333333);
    // Stove knobs
    this.add.circle(740, FLOOR_Y - 25, 2, 0xCCCCCC);
    this.add.circle(748, FLOOR_Y - 25, 2, 0xCCCCCC);

    // Kitchen shelf
    this.add.rectangle(680, 220, 100, 6, 0x8B6914).setStrokeStyle(1, 0x6B4226);
    this.add.rectangle(650, 212, 10, 14, 0xCC3333);
    this.add.rectangle(680, 210, 12, 18, 0x4A90D9);
    this.add.circle(710, 214, 5, 0xFFD700);
    // Extra items on shelf
    this.add.rectangle(725, 213, 8, 12, 0x4CAF50); // Green jar
    this.add.rectangle(640, 214, 6, 10, 0xE8E8E8); // Salt shaker

    // --- Dining table (improved) ---
    this.add.rectangle(380, FLOOR_Y - 15, 100, 8, 0xA0784C).setStrokeStyle(1, 0x6B4226);
    this.add.rectangle(340, FLOOR_Y - 2, 5, 18, 0x8B6914);
    this.add.rectangle(420, FLOOR_Y - 2, 5, 18, 0x8B6914);
    // Table cloth edge
    this.add.rectangle(380, FLOOR_Y - 11, 96, 2, 0xCC3333, 0.4);

    // Plates after cooking
    if (this.postCooking) {
      for (let i = 0; i < 3; i++) {
        this.add.ellipse(355 + i * 30, FLOOR_Y - 22, 20, 8, 0xFFFFFF).setStrokeStyle(1, 0xCCCCCC);
        // Fish on plates
        this.add.sprite(355 + i * 30, FLOOR_Y - 26, 'fish', 0).setScale(0.6);
      }
    }

    // Rug (improved pattern)
    this.add.ellipse(400, FLOOR_Y + 2, 160, 16, 0xCC3333, 0.5);
    this.add.ellipse(400, FLOOR_Y + 2, 120, 10, 0xDD5555, 0.3);
    this.add.ellipse(400, FLOOR_Y + 2, 80, 6, 0xEE7777, 0.2);

    // --- Cat toy (yarn ball on floor) ---
    this.add.circle(460, FLOOR_Y + 1, 6, 0xDA70D6);
    this.add.circle(460, FLOOR_Y + 1, 6).setStrokeStyle(1, 0x9932CC);
    // Yarn string trailing
    const yarnString = this.add.graphics();
    yarnString.lineStyle(1, 0xDA70D6, 0.6);
    yarnString.beginPath();
    yarnString.moveTo(466, FLOOR_Y + 1);
    yarnString.lineTo(474, FLOOR_Y + 4);
    yarnString.lineTo(470, FLOOR_Y - 1);
    yarnString.lineTo(478, FLOOR_Y + 2);
    yarnString.strokePath();

    // --- Cat scratching post (near couch) ---
    // Post
    this.add.rectangle(290, FLOOR_Y - 20, 8, 40, 0xC4A46C).setStrokeStyle(1, 0x8B7340);
    // Rope wrapping lines
    for (let ry = FLOOR_Y - 38; ry < FLOOR_Y - 2; ry += 4) {
      this.add.rectangle(290, ry, 10, 1, 0xD4B880, 0.6);
    }
    // Platform on top
    this.add.rectangle(290, FLOOR_Y - 42, 20, 5, 0x8B6914).setStrokeStyle(1, 0x6B4226);
    // Tiny toy dangling
    this.add.circle(298, FLOOR_Y - 36, 3, 0xFF6B8A);
    this.add.rectangle(296, FLOOR_Y - 40, 1, 6, 0x888888);

    // --- Fireplace (left of couch, on wall) ---
    // Mantle
    this.add.rectangle(160, FLOOR_Y - 38, 60, 6, 0x8B6914).setStrokeStyle(1, 0x6B4226);
    // Firebox
    this.add.rectangle(160, FLOOR_Y - 15, 50, 40, 0x555555).setStrokeStyle(2, 0x3C2415);
    this.add.rectangle(160, FLOOR_Y - 15, 44, 34, 0x1A1A1A);
    // Fire glow
    this.add.circle(155, FLOOR_Y - 8, 8, 0xFF6600, 0.6);
    this.add.circle(165, FLOOR_Y - 10, 6, 0xFFAA00, 0.5);
    this.add.circle(160, FLOOR_Y - 6, 5, 0xFF4400, 0.4);
    // Log
    this.add.rectangle(160, FLOOR_Y - 2, 20, 4, 0x6B4226);
    // Items on mantle
    this.add.circle(140, FLOOR_Y - 44, 4, 0xFFD700); // candle
    this.add.rectangle(140, FLOOR_Y - 50, 2, 6, 0xFFE88C); // wick
    this.add.rectangle(180, FLOOR_Y - 46, 18, 12, 0xFFE4C4).setStrokeStyle(1, 0x8B6914); // small frame
    this.add.circle(180, FLOOR_Y - 46, 3, 0xF0B860); // tiny Dax in frame

    // --- Coat rack (near door) ---
    this.add.rectangle(470, FLOOR_Y - 30, 3, 50, 0x6B4226);
    // Hooks
    this.add.rectangle(465, FLOOR_Y - 48, 8, 2, 0x6B4226);
    this.add.rectangle(475, FLOOR_Y - 42, 8, 2, 0x6B4226);
    // Scarf hanging
    this.add.rectangle(463, FLOOR_Y - 40, 4, 16, 0xCC3333, 0.8);
    // Hat on top
    this.add.ellipse(470, FLOOR_Y - 56, 12, 5, 0x4A90D9);
    this.add.rectangle(470, FLOOR_Y - 58, 8, 4, 0x4A90D9);

    // --- Food/water bowls (near kitchen) ---
    // Water bowl
    this.add.ellipse(640, FLOOR_Y + 2, 16, 6, 0x5DADE2).setStrokeStyle(1, 0x4A90B0);
    this.add.ellipse(640, FLOOR_Y + 1, 12, 4, 0x87CEEB, 0.6);
    // Food bowl
    this.add.ellipse(620, FLOOR_Y + 2, 16, 6, 0xCC6633).setStrokeStyle(1, 0x994422);
    this.add.ellipse(620, FLOOR_Y + 1, 10, 3, 0x8B6914);

    // --- Wall decorations ---
    // Cat calendar (between clock and window)
    this.add.rectangle(430, 190, 24, 30, 0xFFFFFF).setStrokeStyle(1, 0xCCCCCC);
    this.add.rectangle(430, 180, 24, 10, 0xCC3333);
    this.add.text(430, 179, 'MAR', { fontSize: '6px', color: '#FFF', fontFamily: 'Arial' }).setOrigin(0.5);
    this.add.text(430, 195, '22', { fontSize: '10px', color: '#333', fontFamily: 'Arial' }).setOrigin(0.5);

    // Small shelf with trophy
    this.add.rectangle(500, 250, 30, 4, 0x8B6914).setStrokeStyle(1, 0x6B4226);
    // Trophy
    this.add.rectangle(500, 243, 6, 10, 0xFFD700);
    this.add.ellipse(500, 237, 10, 6, 0xFFD700).setStrokeStyle(1, 0xCC9900);
    this.add.rectangle(500, 248, 10, 3, 0xFFD700);

    // --- Door ---
    this.doorX = 500;
    this.add.rectangle(this.doorX, FLOOR_Y - 35, 40, 60, 0x6B4226).setStrokeStyle(2, 0x5C3A1E);
    this.add.circle(this.doorX + 14, FLOOR_Y - 35, 3, 0xFFD700);
    this.add.text(this.doorX, FLOOR_Y - 70, 'Door', {
      fontSize: '10px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    this.doorZone = this.add.rectangle(this.doorX, FLOOR_Y - 35, 50, 60, 0x000000, 0);
    this.physics.add.existing(this.doorZone, true);

    // Floor collision
    const floor = this.add.rectangle(400, FLOOR_Y + 4, 800, 8, 0x000000, 0);
    this.physics.add.existing(floor, true);

    // --- Mom ---
    this.mom = this.add.image(660, FLOOR_Y - 28, 'cat-mom');
    this.add.text(660, FLOOR_Y - 62, 'Mom', {
      fontSize: '10px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // --- Tom (brother) ---
    this.brother = this.add.image(350, FLOOR_Y - 28, 'cat-brother');
    this.add.text(350, FLOOR_Y - 62, 'Tom', {
      fontSize: '10px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // --- Dax ---
    const daxStartX = (this.postFishing || this.postCooking) ? 490 : 100;
    this.dax = new Dax(this, daxStartX, FLOOR_Y - 40);
    this.physics.add.collider(this.dax, floor);
    this.dax.body.setCollideWorldBounds(true);
    this.physics.world.setBounds(20, 0, 760, 450);

    // Door overlap
    this.physics.add.overlap(this.dax, this.doorZone, () => {
      this.tryExitDoor();
    }, null, this);
    this.canExit = false;

    // --- Dialog system ---
    this.dialogBg = this.add.rectangle(400, 430, 760, 50, 0x000000, 0.7).setVisible(false);
    this.dialogText = this.add.text(400, 430, '', {
      fontSize: '16px', color: '#FFFFFF', fontFamily: 'Arial',
      wordWrap: { width: 700 }
    }).setOrigin(0.5).setVisible(false);
    this.dialogHint = this.add.text(750, 445, 'SPACE', {
      fontSize: '10px', color: '#AAAAAA', fontFamily: 'Arial'
    }).setOrigin(1, 1).setVisible(false);

    // --- Skip button (always visible during dialog) ---
    this.skipBg = this.add.rectangle(750, 20, 70, 24, 0x000000, 0.5).setStrokeStyle(1, 0xAAAAAA);
    this.skipBg.setInteractive({ useHandCursor: true });
    this.skipText = this.add.text(750, 20, 'Skip ▶', {
      fontSize: '12px', color: '#CCCCCC', fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.skipBg.on('pointerover', () => this.skipText.setColor('#FFFFFF'));
    this.skipBg.on('pointerout', () => this.skipText.setColor('#CCCCCC'));
    this.skipBg.on('pointerdown', () => this.skipAllDialog());
    // Also ESC to skip
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // ESC via timer (reliable even when update() isn't called)
    this.time.addEvent({
      delay: 100, loop: true,
      callback: () => {
        if (this.dialogActive && Phaser.Input.Keyboard.JustDown(this.escKey)) {
          this.skipAllDialog();
        }
      }
    });


    this.cameras.main.fadeIn(400);

    // --- Start dialogue ---
    if (this.postCooking) {
      this.startPostCookingSequence();
    } else if (this.postFishing) {
      this.startPostFishingSequence();
    } else {
      this.startWakeUpSequence();
    }
  }

  startWakeUpSequence() {
    this.time.delayedCall(600, () => {
      this.showDialogSequence([
        { speaker: 'Tom', text: 'Dax! DAAAAAX! Wake up!!' },
        { speaker: 'Dax', text: 'Huh...? What time is it...?' },
        { speaker: 'Tom', text: 'It\'s late! Mom needs 10 fish for dinner!' },
        { speaker: 'Mom', text: 'Please hurry, Dax! The family is hungry!' },
        { speaker: 'Tom', text: 'I\'ll come with you! Let\'s go to the river!' },
        { speaker: 'Dax', text: 'Ok ok... Let\'s go!' },
      ], () => {
        this.canExit = true;
        if (this.sleepText) this.sleepText.setVisible(false);
        this.showHint('Walk to the door to go outside! →');
        this.hideSkipButton();
      });
    });
  }

  startPostFishingSequence() {
    this.time.delayedCall(600, () => {
      this.showDialogSequence([
        { speaker: 'Dax', text: 'We\'re back! We caught all 10 fish!' },
        { speaker: 'Mom', text: 'Wonderful! Now let\'s cook them up!' },
        { speaker: 'Tom', text: 'Can I help chop?!' },
        { speaker: 'Mom', text: 'Dax caught them, Dax gets to chop!' },
      ], () => {
        this.hideSkipButton();
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('CookingScene');
        });
      });
    });
  }

  startPostCookingSequence() {
    this.time.delayedCall(600, () => {
      this.showDialogSequence([
        { speaker: 'Mom', text: 'Dinner is ready! Come eat, everyone!' },
        { speaker: 'Tom', text: 'Mmm, fish! Thanks Dax!' },
        { speaker: 'Dax', text: 'This was a big adventure... but totally worth it!' },
        { speaker: 'Mom', text: 'You\'re a great cat, Dax. We\'re proud of you!' },
        { speaker: 'Dax', text: '*yaaawn* ... I\'m so sleepy...' },
        { speaker: 'Tom', text: 'Haha, Dax is falling asleep at the table!' },
        { speaker: 'Mom', text: 'Go take a nap, sweetie. You earned it.' },
      ], () => {
        this.hideSkipButton();
        // Show Dax walking to bed and falling asleep
        this.dax.body.setVelocityX(-80);
        this.dax.play('dax-walk');
        this.time.delayedCall(1200, () => {
          this.dax.body.setVelocityX(0);
          this.dax.play('dax-idle');
          // Zzz appears
          const zzz = this.add.text(this.dax.x, this.dax.y - 40, 'Zzz...', {
            fontSize: '18px', color: '#6666AA', fontFamily: 'Arial',
            stroke: '#FFFFFF', strokeThickness: 1
          }).setOrigin(0.5);
          this.tweens.add({
            targets: zzz, y: zzz.y - 15, alpha: 0.3,
            duration: 800, yoyo: true, repeat: 2,
            onComplete: () => {
              this.cameras.main.fadeOut(1200, 0, 0, 0);
              this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('DreamTransitionScene');
              });
            }
          });
        });
      });
    });
  }

  skipAllDialog() {
    // Clear everything and jump to callback
    if (this.typewriterTimer) this.typewriterTimer.remove();
    this.dialogQueue = [];
    this.dialogBg.setVisible(false);
    this.dialogText.setVisible(false);
    this.dialogHint.setVisible(false);
    this.dialogActive = false;
    // Remove any pending keyboard listeners
    this.input.keyboard.removeAllListeners('keydown-SPACE');
    if (this.dialogCallback) {
      const cb = this.dialogCallback;
      this.dialogCallback = null;
      cb();
    }
  }

  hideSkipButton() {
    this.skipBg.setVisible(false);
    this.skipText.setVisible(false);
  }

  showHint(text) {
    if (this.hintText) this.hintText.destroy();
    this.hintText = this.add.text(400, 16, text, {
      fontSize: '16px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);
  }

  showDialogSequence(dialogs, onComplete) {
    this.dialogQueue = [...dialogs];
    this.dialogCallback = onComplete;
    this.dialogActive = true;
    this.skipBg.setVisible(true);
    this.skipText.setVisible(true);
    this.showNextDialog();
  }

  showNextDialog() {
    if (this.dialogQueue.length === 0) {
      this.dialogBg.setVisible(false);
      this.dialogText.setVisible(false);
      this.dialogHint.setVisible(false);
      this.dialogActive = false;
      if (this.dialogCallback) {
        const cb = this.dialogCallback;
        this.dialogCallback = null;
        cb();
      }
      return;
    }

    const dialog = this.dialogQueue.shift();
    this.dialogBg.setVisible(true);
    this.dialogText.setVisible(true);
    this.dialogHint.setVisible(true);

    const fullText = `${dialog.speaker}: ${dialog.text}`;
    this.dialogText.setText('');
    let charIndex = 0;
    this.typewriterDone = false;

    if (this.typewriterTimer) this.typewriterTimer.remove();
    this.typewriterTimer = this.time.addEvent({
      delay: 30,
      callback: () => {
        charIndex++;
        this.dialogText.setText(fullText.substring(0, charIndex));
        if (charIndex >= fullText.length) {
          this.typewriterTimer.remove();
          this.typewriterDone = true;
        }
      },
      repeat: fullText.length - 1
    });

    // First SPACE: complete typewriter or advance
    this.input.keyboard.once('keydown-SPACE', () => {
      if (!this.typewriterDone) {
        // Complete the text instantly
        if (this.typewriterTimer) this.typewriterTimer.remove();
        this.dialogText.setText(fullText);
        this.typewriterDone = true;
        // Now wait for another SPACE to advance
        this.time.delayedCall(100, () => {
          this.input.keyboard.once('keydown-SPACE', () => {
            this.showNextDialog();
          });
        });
      } else {
        this.showNextDialog();
      }
    });
  }

  tryExitDoor() {
    if (!this.canExit || this.dialogActive) return;
    this.canExit = false;
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('PlatformScene', { fromHouse: true });
    });
  }

  update() {
    if (!this.dialogActive) {
      this.dax.update();
    }
    // ESC to skip dialog
    if (this.dialogActive && Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.skipAllDialog();
    }
  }
}
