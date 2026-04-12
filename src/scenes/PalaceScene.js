import Phaser from 'phaser';

const FLOOR_Y = 400;

export default class PalaceScene extends Phaser.Scene {
  constructor() {
    super('PalaceScene');
  }

  create() {
    this.dialogActive = false;
    this.dialogQueue = [];
    this.dialogCallback = null;

    this.drawPalaceInterior();
    this.placeCharacters();
    this.setupDialog();

    this.cameras.main.fadeIn(1200, 0, 0, 0);

    // Start the scene after a beat
    this.time.delayedCall(1500, () => this.startCouncil());
  }

  drawPalaceInterior() {
    // Palace walls — crystal blue gradient
    const wallColors = [0x1A1A3E, 0x1E2550, 0x253068, 0x2C3A7A, 0x344590];
    wallColors.forEach((c, i) => {
      this.add.rectangle(400, 20 + i * 50, 800, 60, c);
    });

    // Crystal wall shimmer
    for (let i = 0; i < 25; i++) {
      const shimmer = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 200),
        Phaser.Math.Between(1, 3),
        [0x87CEEB, 0xB0D4F1, 0xE0F0FF, 0xC8E0FF][Phaser.Math.Between(0, 3)],
        Phaser.Math.FloatBetween(0.1, 0.3)
      );
      this.tweens.add({
        targets: shimmer,
        alpha: { from: shimmer.alpha, to: 0.05 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true, repeat: -1
      });
    }

    // Grand arched windows (background)
    for (const wx of [120, 400, 680]) {
      // Window arch
      this.add.rectangle(wx, 70, 60, 80, 0x1A1040, 0.6);
      // Window glow (moonlight)
      this.add.rectangle(wx, 70, 56, 76, 0x2E0854, 0.4);
      // Arch top
      this.add.ellipse(wx, 32, 60, 30, 0x1A1040, 0.6);
      this.add.ellipse(wx, 32, 56, 26, 0x2E0854, 0.4);
      // Stars visible through window
      for (let s = 0; s < 4; s++) {
        this.add.circle(
          wx + Phaser.Math.Between(-20, 20),
          Phaser.Math.Between(30, 90),
          1, 0xFFFFFF, Phaser.Math.FloatBetween(0.3, 0.7)
        );
      }
    }

    // Crystal columns
    for (const colX of [50, 200, 600, 750]) {
      const colGrad = this.add.rectangle(colX, 180, 16, 280, 0x4A6FA5, 0.6);
      this.add.rectangle(colX, 180, 12, 280, 0x6A90C0, 0.3);
      // Column cap
      this.add.rectangle(colX, 40, 24, 8, 0x7AA0D0, 0.7);
      // Column base
      this.add.rectangle(colX, 322, 24, 8, 0x7AA0D0, 0.7);
      // Crystal shimmer on column
      const colShimmer = this.add.circle(colX, Phaser.Math.Between(80, 260), 3, 0xFFFFFF, 0);
      this.tweens.add({
        targets: colShimmer,
        alpha: 0.4,
        y: colShimmer.y - 40,
        duration: 2000,
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 1500)
      });
    }

    // Floor — polished crystal tiles
    this.add.rectangle(400, FLOOR_Y - 40, 800, 120, 0x2A3A6E);
    this.add.rectangle(400, FLOOR_Y - 40, 800, 120, 0x3A4A80, 0.5);
    // Tile grid lines
    for (let x = 0; x < 800; x += 60) {
      this.add.rectangle(x, FLOOR_Y - 40, 1, 120, 0x4A5A90, 0.3);
    }
    for (let y = FLOOR_Y - 95; y < FLOOR_Y + 20; y += 30) {
      this.add.rectangle(400, y, 800, 1, 0x4A5A90, 0.3);
    }

    // Crystal chandelier (top center)
    this.drawChandelier(400, 20);

    // Crystal furniture — decorative side tables
    this.drawCrystalTable(70, FLOOR_Y - 95, 0.6);
    this.drawCrystalTable(730, FLOOR_Y - 95, 0.6);

    // --- THE GREAT TABLE ---
    this.drawGreatTable();
  }

  drawChandelier(x, y) {
    // Main structure
    this.add.rectangle(x, y + 10, 4, 20, 0xC0D0E8);
    // Arms
    for (const offset of [-40, -20, 0, 20, 40]) {
      this.add.rectangle(x + offset, y + 24, 2, 12, 0xA0B8D4);
      // Crystal drops
      const crystal = this.add.circle(x + offset, y + 38, 3, 0x87CEEB, 0.8);
      this.tweens.add({
        targets: crystal,
        alpha: { from: 0.4, to: 0.9 },
        duration: Phaser.Math.Between(800, 1500),
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 800)
      });
    }
    // Crossbar
    this.add.rectangle(x, y + 22, 90, 3, 0xB0C8E0);
    // Top gem
    this.add.circle(x, y + 4, 4, 0x5B9EE8, 0.9);
  }

  drawCrystalTable(x, y, scale) {
    // Small side table
    this.add.rectangle(x, y, 40 * scale, 6 * scale, 0x6A90C0, 0.8);
    this.add.rectangle(x - 10 * scale, y + 8 * scale, 4 * scale, 16 * scale, 0x5A80B0, 0.7);
    this.add.rectangle(x + 10 * scale, y + 8 * scale, 4 * scale, 16 * scale, 0x5A80B0, 0.7);
    // Crystal vase on table
    this.add.rectangle(x, y - 6 * scale, 8 * scale, 10 * scale, 0x87CEEB, 0.5);
    this.add.ellipse(x, y - 12 * scale, 12 * scale, 4 * scale, 0x87CEEB, 0.5);
  }

  drawGreatTable() {
    // Large rectangular table in center of room
    const tx = 400, ty = 280;
    // Table surface (crystal blue, slightly transparent)
    this.add.rectangle(tx, ty, 440, 40, 0x3A6EA0, 0.8);
    this.add.rectangle(tx, ty, 436, 36, 0x4A80B8, 0.6);
    // Table edge highlight
    this.add.rectangle(tx, ty - 18, 440, 2, 0x7AB0E0, 0.5);
    // Table legs
    for (const lx of [tx - 210, tx - 70, tx + 70, tx + 210]) {
      this.add.rectangle(lx, ty + 28, 6, 30, 0x3A6090, 0.7);
    }
    // Crystal centerpiece on table
    this.add.circle(tx, ty - 4, 8, 0x87CEEB, 0.4);
    const centerGem = this.add.circle(tx, ty - 4, 4, 0xFFFFFF, 0.6);
    this.tweens.add({
      targets: centerGem,
      alpha: { from: 0.3, to: 0.8 },
      scaleX: { from: 1, to: 1.3 },
      scaleY: { from: 1, to: 1.3 },
      duration: 1500,
      yoyo: true, repeat: -1
    });

    // Chairs along the table (crystal style, simple)
    // Near side (front)
    for (const cx of [250, 340, 460, 550]) {
      this.drawChair(cx, ty + 40, false);
    }
    // Far side (back, partially hidden)
    for (const cx of [250, 340, 460, 550]) {
      this.drawChair(cx, ty - 35, true);
    }
    // Head of table (Queen's throne — right side)
    this.drawThrone(640, ty);
  }

  drawChair(x, y, isFar) {
    const alpha = isFar ? 0.4 : 0.7;
    // Seat
    this.add.rectangle(x, y, 24, 6, 0x5A80B0, alpha);
    // Back
    this.add.rectangle(x, y - 12, 20, 18, 0x4A70A0, alpha * 0.8);
    // Back crystal detail
    this.add.circle(x, y - 14, 2, 0x87CEEB, alpha * 0.5);
  }

  drawThrone(x, y) {
    // Larger, more ornate chair
    this.add.rectangle(x, y + 8, 32, 8, 0x4A70A0, 0.8);
    // High back
    this.add.rectangle(x, y - 20, 28, 40, 0x3A5A8A, 0.8);
    // Crown detail on throne back
    this.add.rectangle(x, y - 38, 24, 3, 0xFFD700, 0.7);
    // Pointed top
    for (const offset of [-8, 0, 8]) {
      this.add.triangle(x + offset, y - 46, -4, 6, 4, 6, 0, -4, 0xFFD700, 0.6);
    }
    // Gem
    this.add.circle(x, y - 28, 3, 0x4A90D9, 0.7);
  }

  placeCharacters() {
    const tableY = 280;

    // --- DAX and SILVER (arriving, compact on far left) ---
    this.silver = this.add.image(48, FLOOR_Y - 100, 'dragon').setScale(0.85).setFlipX(true).setDepth(1);
    this.silverLabel = this.add.text(48, FLOOR_Y - 145, 'Silver', {
      fontSize: '10px', color: '#A8C4DC', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(1);
    this.dax = this.add.sprite(105, FLOOR_Y - 80, 'dax', 0).setScale(1.1).setDepth(2);
    this.daxLabel = this.add.text(105, FLOOR_Y - 105, 'Dax', {
      fontSize: '10px', color: '#F0B860', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(2);

    // --- CREATURE LEADERS around the table (evenly spaced, no overlap) ---
    // Gnome leader (near side left — in front of table)
    this.gnome = this.add.image(230, tableY + 50, 'gnome').setScale(1.4).setDepth(4);
    this.gnomeLabel = this.add.text(230, tableY + 22, 'Bramblethorne', {
      fontSize: '8px', color: '#CC2222', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0).setDepth(4);

    // Pixie (floating above table)
    this.pixie = this.add.image(340, tableY - 30, 'pixie').setScale(1.2).setDepth(4);
    this.pixieLabel = this.add.text(340, tableY - 58, 'Glimmer', {
      fontSize: '8px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0).setDepth(4);
    // Pixie hovers
    this.tweens.add({
      targets: this.pixie,
      y: this.pixie.y - 6,
      duration: 1200, yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Giant (far side, towering behind table)
    this.giant = this.add.image(450, tableY - 110, 'giant').setScale(1.6).setDepth(3);
    this.giantLabel = this.add.text(450, tableY - 175, 'Thunderfoot', {
      fontSize: '8px', color: '#DAA520', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0).setDepth(3);

    // Magic Wolf (near side right — in front of table)
    this.wolf = this.add.image(560, tableY + 45, 'magic-wolf').setScale(1.3).setDepth(4);
    this.wolfLabel = this.add.text(560, tableY + 18, 'Starfang', {
      fontSize: '8px', color: '#9B8FFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0).setDepth(4);

    // --- QUEEN at the head of the table ---
    this.queen = this.add.image(690, tableY - 50, 'fairy-queen').setScale(1.1).setDepth(4);
    this.queenLabel = this.add.text(690, tableY - 100, 'Queen Aurora', {
      fontSize: '10px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#1A1A3E', strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0).setDepth(4);
    // Gentle float
    this.tweens.add({
      targets: this.queen,
      y: this.queen.y - 3,
      duration: 2000, yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  setupDialog() {
    // Dialog box at bottom
    this.dialogBg = this.add.rectangle(400, 430, 760, 50, 0x000000, 0.85).setVisible(false);
    this.dialogText = this.add.text(400, 430, '', {
      fontSize: '15px', color: '#FFFFFF', fontFamily: 'Arial',
      wordWrap: { width: 700 }
    }).setOrigin(0.5).setVisible(false);
    this.dialogHint = this.add.text(750, 445, 'SPACE', {
      fontSize: '10px', color: '#AAAAAA', fontFamily: 'Arial'
    }).setOrigin(1, 1).setVisible(false);

    // Skip button
    this.skipBg = this.add.rectangle(750, 20, 70, 24, 0x000000, 0.5).setStrokeStyle(1, 0xAAAAAA);
    this.skipBg.setInteractive({ useHandCursor: true });
    this.skipTextObj = this.add.text(750, 20, 'Skip \u25B6', {
      fontSize: '12px', color: '#CCCCCC', fontFamily: 'Arial'
    }).setOrigin(0.5);
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

  startCouncil() {
    // Dax and Silver walk in (short walk so they don't overlap council members)
    this.tweens.add({
      targets: [this.dax, this.daxLabel],
      x: '+=50',
      duration: 2000,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: [this.silver, this.silverLabel],
      x: '+=50',
      duration: 2000,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.arrivalDialog();
      }
    });
  }

  arrivalDialog() {
    // Reveal labels
    [this.queenLabel, this.gnomeLabel, this.pixieLabel, this.giantLabel, this.wolfLabel].forEach((label, i) => {
      this.tweens.add({ targets: label, alpha: 1, duration: 400, delay: i * 150 });
    });

    this.showDialogSequence([
      { speaker: 'Dax', text: 'Woooow... Are those GIANTS?! And little flying people?!' },
      { speaker: 'Starfang', text: '*sniffs* ...He smells of fish and courage. A curious combination.' },
      { speaker: 'Dax', text: 'I had fish for dinner! And I\'m not THAT small!' },
      { speaker: 'Bramblethorne', text: 'Hmph! He\'s just a wee cat!' },
      { speaker: 'Glimmer', text: '*giggles* But he has brave eyes! I can see it in his sparkle!' },
    ], () => {
      this.time.delayedCall(500, () => this.queenSpeaks());
    });
  }

  queenSpeaks() {
    this.tweens.add({
      targets: this.queen,
      y: this.queen.y - 8,
      duration: 600,
      ease: 'Sine.easeOut'
    });

    this.showDialogSequence([
      { speaker: 'Queen Aurora', text: 'Welcome, brave Dax. I wish we were meeting under happier circumstances.' },
      { speaker: 'Queen Aurora', text: 'The wizard Malachar has kidnapped Liliana, the Keeper of Tales, and stolen the Book of All Tales.' },
      { speaker: 'Dax', text: 'The Book of All Tales?!' },
      { speaker: 'Queen Aurora', text: 'It holds every story ever told. With it, one can travel through time itself.' },
      { speaker: 'Queen Aurora', text: 'If we don\'t rescue Liliana by sunset tomorrow, the balance between good and evil will shatter forever.' },
      { speaker: 'Bramblethorne', text: '*slams tiny fist* WHO would dare?!' },
      { speaker: 'Starfang', text: '*growls* We need someone to lead this quest. Someone from the world where stories are born.' },
    ], () => {
      this.time.delayedCall(300, () => this.daxChosen());
    });
  }

  daxChosen() {
    const overlay = this.add.rectangle(400, 225, 800, 450, 0x000000, 0).setDepth(0);
    this.tweens.add({ targets: overlay, alpha: 0.15, duration: 1000 });

    this.showDialogSequence([
      { speaker: 'Dax', text: '...Why is everyone looking at me?' },
      { speaker: 'Silver', text: 'Dax... you came from the real world. Where stories are born.' },
      { speaker: 'Dax', text: 'But I\'m just a cat! I knock things off tables!' },
      { speaker: 'Queen Aurora', text: 'Will you help us save Liliana? The fate of every story... rests in your paws.' },
      { speaker: 'Dax', text: 'I\'m scared. But if Liliana needs help... this cat has a quest to finish!' },
      { speaker: 'Silver', text: 'That\'s the spirit, Sir Knight!' },
      { speaker: 'Queen Aurora', text: 'Then it is decided. But you will not go blindly. Take this.' },
    ], () => {
      this.time.delayedCall(300, () => this.queenGivesMap());
    });
  }

  queenGivesMap() {
    this.mapImage = this.add.image(400, 200, 'quest-map').setScale(0).setDepth(10);
    this.tweens.add({
      targets: this.mapImage,
      scaleX: 2.2, scaleY: 2.2,
      duration: 800,
      ease: 'Back.easeOut'
    });

    this.time.delayedCall(1000, () => {
      this.showDialogSequence([
        { speaker: 'Queen Aurora', text: 'Follow the path to Malachar\'s Nightmare Village, atop the highest mountain.' },
        { speaker: 'Dax', text: 'The HIGHEST mountain?! With an X on it and everything?!' },
        { speaker: 'Queen Aurora', text: 'At the mountain\'s foot you\'ll find an ancient gate sealed by old magic. Solve its puzzle to pass.' },
        { speaker: 'Glimmer', text: 'Be brave, Dax! We believe in you!' },
        { speaker: 'Queen Aurora', text: 'Go now, heroes. May the light of every story guide your way.' },
      ], () => {
        this.hideSkipButton();
        this.endScene();
      });
    });
  }

  endScene() {
    // Fade out the map
    if (this.mapImage) {
      this.tweens.add({ targets: this.mapImage, alpha: 0, duration: 800 });
    }

    // Triumphant sparkles
    for (let i = 0; i < 20; i++) {
      const spark = this.add.circle(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(150, 350),
        Phaser.Math.Between(1, 3),
        [0xFFD700, 0x87CEEB, 0xE0C0FF, 0xFFFFFF][Phaser.Math.Between(0, 3)],
        0
      );
      this.tweens.add({
        targets: spark,
        alpha: 0.8,
        y: spark.y - Phaser.Math.Between(20, 60),
        duration: Phaser.Math.Between(800, 1500),
        delay: Phaser.Math.Between(0, 500),
        yoyo: true,
        onComplete: () => spark.destroy()
      });
    }

    const endText = this.add.text(400, 200, 'The quest begins...', {
      fontSize: '32px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#1A1A3E', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0).setDepth(11);

    this.tweens.add({
      targets: endText,
      alpha: 1,
      duration: 1000,
      delay: 500
    });

    this.time.delayedCall(3500, () => {
      this.cameras.main.fadeOut(1500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TravelScene');
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

    // Color-code speaker names
    const speakerColors = {
      'Dax': '#F0B860',
      'Silver': '#A8C4DC',
      'Queen Aurora': '#FFD700',
      'Bramblethorne': '#CC4444',
      'Glimmer': '#FFDD44',
      'Thunderfoot': '#DAA520',
      'Starfang': '#9B8FFF'
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
          this.input.keyboard.once('keydown-SPACE', () => {
            this.showNextDialog();
          });
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
