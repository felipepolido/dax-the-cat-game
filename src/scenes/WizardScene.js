import Phaser from 'phaser';

export default class WizardScene extends Phaser.Scene {
  constructor() {
    super('WizardScene');
  }

  create() {
    this.dialogActive = false;
    this.dialogQueue = [];
    this.dialogCallback = null;

    this.drawNightmareVillage();
    this.placeCharacters();
    this.setupDialog();

    this.cameras.main.fadeIn(1500, 0, 0, 0);

    this.time.delayedCall(2000, () => this.arrivalDialog());
  }

  drawNightmareVillage() {
    // Very dark, ominous sky
    this.add.rectangle(400, 40, 800, 80, 0x0A0010);
    this.add.rectangle(400, 100, 800, 60, 0x120020);
    this.add.rectangle(400, 150, 800, 50, 0x1A0030);
    this.add.rectangle(400, 190, 800, 40, 0x200040);

    // Sickly green/red clouds
    for (let i = 0; i < 6; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(30, 120),
        Phaser.Math.Between(80, 150),
        Phaser.Math.Between(20, 40),
        [0x200020, 0x2A0010, 0x102000][Phaser.Math.Between(0, 2)],
        Phaser.Math.FloatBetween(0.2, 0.5)
      );
      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(-20, 20),
        alpha: cloud.alpha * 0.5,
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true, repeat: -1
      });
    }

    // Eerie red moon
    this.add.circle(650, 60, 20, 0x880020, 0.7);
    this.add.circle(648, 58, 18, 0xAA0030, 0.6);
    // Moon glow
    this.add.circle(650, 60, 35, 0xFF0000, 0.05);

    // Village ground — dark, cracked stone
    this.add.rectangle(400, 370, 800, 130, 0x1A1020);
    this.add.rectangle(400, 400, 800, 80, 0x120A18);

    // Cracks in the ground
    for (let i = 0; i < 10; i++) {
      const cx = Phaser.Math.Between(50, 750);
      const cy = Phaser.Math.Between(330, 430);
      const crack = this.add.rectangle(cx, cy, Phaser.Math.Between(20, 50), 1, 0x2A1A30, 0.4);
      crack.setAngle(Phaser.Math.Between(-20, 20));
    }

    // Dark buildings in background
    const buildings = [
      { x: 80, w: 50, h: 60 },
      { x: 180, w: 40, h: 80 },
      { x: 280, w: 60, h: 50 },
      { x: 520, w: 55, h: 70 },
      { x: 620, w: 45, h: 55 },
      { x: 720, w: 50, h: 65 },
    ];
    buildings.forEach(b => {
      this.add.rectangle(b.x, 310 - b.h / 2, b.w, b.h, 0x0A0010);
      this.add.rectangle(b.x, 310 - b.h / 2, b.w - 4, b.h - 4, 0x120018, 0.8);
      // Dark windows (some with eerie glow)
      const winY = 310 - b.h / 2 - 5;
      this.add.rectangle(b.x - 8, winY, 6, 6, 0x000000);
      this.add.rectangle(b.x + 8, winY, 6, 6, 0x000000);
      if (Phaser.Math.Between(0, 2) === 0) {
        this.add.rectangle(b.x - 8, winY, 4, 4, 0x401000, 0.5);
      }
      // Pointed roofs
      this.add.triangle(b.x, 310 - b.h - 10, 0, 20, b.w / 2 + 5, -15, b.w + 10, 20, 0x0A0010);
    });

    // Malachar's tower (center, tallest)
    this.add.rectangle(400, 200, 60, 160, 0x0A0010);
    this.add.rectangle(400, 200, 56, 156, 0x150020, 0.9);
    // Tower top
    this.add.triangle(400, 115, 0, 30, 40, -40, 80, 30, 0x0A0010);
    // Eerie green window at top
    this.add.rectangle(400, 145, 12, 16, 0x000000);
    const towerGlow = this.add.rectangle(400, 145, 10, 14, 0x40E040, 0.4);
    this.tweens.add({
      targets: towerGlow,
      alpha: { from: 0.2, to: 0.6 },
      duration: 1500,
      yoyo: true, repeat: -1
    });
    // More windows
    for (let wy = 170; wy < 270; wy += 25) {
      this.add.rectangle(400, wy, 8, 10, 0x000000);
      this.add.rectangle(400, wy, 6, 8, 0x200030, 0.3);
    }

    // Floating green particles (eerie magic)
    for (let i = 0; i < 12; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(300, 500),
        Phaser.Math.Between(100, 300),
        Phaser.Math.Between(1, 2),
        0x40E040,
        0
      );
      this.tweens.add({
        targets: particle,
        alpha: { from: 0, to: 0.5 },
        y: particle.y - Phaser.Math.Between(20, 60),
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // Dead trees
    for (const tx of [30, 150, 650, 770]) {
      this.add.rectangle(tx, 305, 4, 30, 0x1A0A10);
      this.add.rectangle(tx - 8, 292, 2, 14, 0x1A0A10).setAngle(-30);
      this.add.rectangle(tx + 6, 295, 2, 12, 0x1A0A10).setAngle(25);
    }
  }

  placeCharacters() {
    // Dax and Silver arrive from the left
    this.silver = this.add.image(80, 340, 'dragon').setScale(0.9).setFlipX(true).setDepth(2);
    this.dax = this.add.sprite(140, 370, 'dax', 0).setScale(1.3).setDepth(3);

    // Wizard will appear from the tower
    this.wizard = this.add.image(400, 300, 'wizard').setScale(1.4).setDepth(3).setAlpha(0);
    this.wizardLabel = this.add.text(400, 220, 'Malachar', {
      fontSize: '12px', color: '#40E040', fontFamily: 'Arial',
      stroke: '#0A0010', strokeThickness: 3
    }).setOrigin(0.5).setDepth(3).setAlpha(0);
  }

  setupDialog() {
    this.dialogBg = this.add.rectangle(400, 430, 760, 50, 0x000000, 0.85).setVisible(false).setDepth(20);
    this.dialogText = this.add.text(400, 430, '', {
      fontSize: '15px', color: '#FFFFFF', fontFamily: 'Arial',
      wordWrap: { width: 700 }
    }).setOrigin(0.5).setVisible(false).setDepth(20);
    this.dialogHint = this.add.text(750, 445, 'SPACE', {
      fontSize: '10px', color: '#AAAAAA', fontFamily: 'Arial'
    }).setOrigin(1, 1).setVisible(false).setDepth(20);

    this.skipBg = this.add.rectangle(750, 20, 70, 24, 0x000000, 0.5).setStrokeStyle(1, 0xAAAAAA).setDepth(20);
    this.skipBg.setInteractive({ useHandCursor: true });
    this.skipTextObj = this.add.text(750, 20, 'Skip \u25B6', {
      fontSize: '12px', color: '#CCCCCC', fontFamily: 'Arial'
    }).setOrigin(0.5).setDepth(20);
    this.skipBg.on('pointerover', () => this.skipTextObj.setColor('#FFFFFF'));
    this.skipBg.on('pointerout', () => this.skipTextObj.setColor('#CCCCCC'));
    this.skipBg.on('pointerdown', () => this.skipAllDialog());
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
  }

  arrivalDialog() {
    // Dax and Silver walk in
    this.tweens.add({
      targets: this.dax,
      x: 250,
      duration: 1500,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: this.silver,
      x: 190,
      duration: 1500,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.showDialogSequence([
          { speaker: 'Dax', text: '*shivering* This place gives me the creeps...' },
          { speaker: 'Silver', text: 'The Nightmare Village... Everything here feels wrong.' },
          { speaker: 'Dax', text: 'Look at that tower! That must be where Malachar lives.' },
          { speaker: 'Silver', text: 'And where he\'s keeping Liliana. Stay close, Dax.' },
        ], () => {
          this.time.delayedCall(500, () => this.wizardAppears());
        });
      }
    });
  }

  wizardAppears() {
    // Dramatic entrance — screen shake, green flash
    this.cameras.main.shake(400, 0.01);

    // Green lightning flash
    const flash = this.add.rectangle(400, 225, 800, 450, 0x40E040, 0.2).setDepth(15);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy()
    });

    // Wizard materializes with green smoke
    this.tweens.add({
      targets: this.wizard,
      alpha: 1,
      duration: 1200,
      ease: 'Sine.easeIn'
    });

    // Green smoke particles
    for (let i = 0; i < 15; i++) {
      const smoke = this.add.circle(
        400 + Phaser.Math.Between(-30, 30),
        320 + Phaser.Math.Between(-20, 20),
        Phaser.Math.Between(3, 8),
        0x40E040,
        0.3
      ).setDepth(2);
      this.tweens.add({
        targets: smoke,
        y: smoke.y - Phaser.Math.Between(30, 80),
        alpha: 0,
        scaleX: 2, scaleY: 2,
        duration: Phaser.Math.Between(800, 1500),
        delay: Phaser.Math.Between(0, 400),
        onComplete: () => smoke.destroy()
      });
    }

    // Wizard idle animation — menacing hover
    this.time.delayedCall(800, () => {
      this.tweens.add({
        targets: this.wizard,
        y: this.wizard.y - 5,
        duration: 1500,
        yoyo: true, repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Show label
      this.tweens.add({
        targets: this.wizardLabel,
        alpha: 1,
        duration: 600
      });

      this.time.delayedCall(600, () => this.wizardDialog());
    });
  }

  wizardDialog() {
    this.showDialogSequence([
      { speaker: 'Malachar', text: 'Well, well, well... What do we have here?' },
      { speaker: 'Dax', text: 'AHHH!! He just appeared out of nowhere!!' },
      { speaker: 'Malachar', text: 'A cat... and a dragon. How delightful.' },
      { speaker: 'Malachar', text: 'The Queen sent you, didn\'t she? To rescue poor little Liliana?' },
      { speaker: 'Silver', text: 'Release her, Malachar! And return the Book of All Tales!' },
      { speaker: 'Malachar', text: '*laughs* Oh, I don\'t think so. You see, I\'ve been reading the most WONDERFUL stories...' },
      { speaker: 'Malachar', text: 'Did you know that with this book, I can rewrite any tale? Change any ending?' },
      { speaker: 'Dax', text: 'You can\'t just change everyone\'s stories! Those belong to the people who dream them!' },
      { speaker: 'Malachar', text: 'How touching. A little cat, lecturing ME about stories.' },
      { speaker: 'Malachar', text: 'But since you\'ve come all this way... I\'ll give you a chance.' },
    ], () => {
      this.time.delayedCall(300, () => this.wizardChallenge());
    });
  }

  wizardChallenge() {
    // Wizard raises staff — glow intensifies
    this.tweens.add({
      targets: this.wizard,
      scaleX: 1.5, scaleY: 1.5,
      duration: 400,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });

    this.showDialogSequence([
      { speaker: 'Malachar', text: 'I challenge you, little cat. Prove you\'re worthy of this book.' },
      { speaker: 'Malachar', text: 'If you can... I might just let you have it back. Maybe.' },
      { speaker: 'Malachar', text: 'But if you fail... your story ends here. In MY village. Forever.' },
      { speaker: 'Dax', text: '...' },
      { speaker: 'Dax', text: 'I didn\'t come all this way to give up now.' },
      { speaker: 'Silver', text: 'That\'s right! Whatever your challenge is, we\'ll face it together!' },
      { speaker: 'Malachar', text: '*that spooky smile widens* ...Together? How sweet. We shall see about that.' },
      { speaker: 'Malachar', text: 'Very well then. Let the game... BEGIN.' },
    ], () => {
      this.hideSkipButton();
      this.endScene();
    });
  }

  endScene() {
    // Dramatic green flash before battle
    const flash = this.add.rectangle(400, 225, 800, 450, 0x40E040, 0).setDepth(15);
    this.tweens.add({
      targets: flash,
      alpha: 0.4,
      duration: 1000,
      yoyo: true,
      onComplete: () => flash.destroy()
    });

    this.time.delayedCall(2500, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('WizardBattleScene');
      });
    });
  }

  // --- Dialog system ---
  showDialogSequence(dialogs, onComplete) {
    this.dialogQueue = [...dialogs];
    this.dialogCallback = onComplete;
    this.dialogActive = true;
    this.skipBg.setVisible(true);
    this.skipTextObj.setVisible(true);
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

    const speakerColors = {
      'Dax': '#F0B860',
      'Silver': '#A8C4DC',
      'Malachar': '#40E040',
    };

    const color = speakerColors[dialog.speaker] || '#FFFFFF';
    const fullText = `${dialog.speaker}: ${dialog.text}`;
    this.dialogText.setText('');
    this.dialogText.setColor(color);
    let charIndex = 0;
    this.typewriterDone = false;

    if (this.typewriterTimer) this.typewriterTimer.remove();
    this.typewriterTimer = this.time.addEvent({
      delay: 25,
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

    this.input.keyboard.once('keydown-SPACE', () => {
      if (!this.typewriterDone) {
        if (this.typewriterTimer) this.typewriterTimer.remove();
        this.dialogText.setText(fullText);
        this.typewriterDone = true;
        this.time.delayedCall(100, () => {
          this.input.keyboard.once('keydown-SPACE', () => this.showNextDialog());
        });
      } else {
        this.showNextDialog();
      }
    });
  }

  skipAllDialog() {
    if (this.typewriterTimer) this.typewriterTimer.remove();
    this.dialogQueue = [];
    this.dialogBg.setVisible(false);
    this.dialogText.setVisible(false);
    this.dialogHint.setVisible(false);
    this.dialogActive = false;
    this.input.keyboard.removeAllListeners('keydown-SPACE');
    if (this.dialogCallback) {
      const cb = this.dialogCallback;
      this.dialogCallback = null;
      cb();
    }
  }

  hideSkipButton() {
    this.skipBg.setVisible(false);
    this.skipTextObj.setVisible(false);
  }

}
