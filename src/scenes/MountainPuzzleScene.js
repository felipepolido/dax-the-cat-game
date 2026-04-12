import Phaser from 'phaser';

export default class MountainPuzzleScene extends Phaser.Scene {
  constructor() {
    super('MountainPuzzleScene');
  }

  create() {
    this.dialogActive = false;
    this.dialogQueue = [];
    this.dialogCallback = null;
    this.puzzleSolved = false;
    this.selectedRunes = [];
    this.runeButtons = [];
    this.currentRound = 0;
    this.totalRounds = 4;
    this.patternLength = 3; // starts at 3, grows each round
    this.targetPattern = [];
    this.isShowingPattern = false;
    this.isPlayerTurn = false;

    this.drawMountainBackground();
    this.drawAncientGate();
    this.placeCharacters();
    this.setupDialog();

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.time.delayedCall(1000, () => this.arrivalDialog());
  }

  drawMountainBackground() {
    // Full background cover
    this.add.rectangle(400, 225, 800, 450, 0x1A0A2E);
    // Dark sky
    this.add.rectangle(400, 60, 800, 120, 0x1A0A2E);
    this.add.rectangle(400, 150, 800, 80, 0x2E1850);
    this.add.rectangle(400, 210, 800, 60, 0x3A2060);

    // Stars
    for (let i = 0; i < 20; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 150),
        Phaser.Math.Between(1, 2),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.3, 0.8)
      );
      this.tweens.add({
        targets: star, alpha: 0.1,
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true, repeat: -1
      });
    }

    // Distant mountains
    [[200, 170, 250, 0x3A2845], [500, 150, 300, 0x4A3858], [700, 180, 220, 0x3A2845]].forEach(([x, y, w, c]) => {
      this.add.triangle(x, y, 0, 80, w / 2, -80, w, 80, c);
    });
    // Snow
    [[200, 100, 40], [500, 80, 50], [700, 110, 35]].forEach(([x, y, w]) => {
      this.add.triangle(x, y, 0, 20, w / 2, -20, w, 20, 0xE0E8F0, 0.7);
    });

    // Main mountain
    this.add.triangle(400, 120, 0, 200, 150, -200, 300, 200, 0x5C4A3A);
    this.add.triangle(400, 120, 50, 100, 150, -120, 250, 100, 0x6B5A4A, 0.8);
    this.add.triangle(400, 20, 0, 40, 40, -40, 80, 40, 0xF0F4F8);

    // Nightmare Village silhouette
    this.add.rectangle(395, 30, 12, 10, 0x1A0A1A);
    this.add.rectangle(408, 32, 8, 7, 0x1A0A1A);
    this.add.circle(400, 28, 15, 0xFF0000, 0.08);

    // Ground
    this.add.rectangle(400, 360, 800, 120, 0x4A3A2A);
    this.add.rectangle(400, 390, 800, 80, 0x3A2A1A);
    this.add.rectangle(400, 420, 800, 60, 0x2A1A0A);

    // Rocks
    for (let i = 0; i < 12; i++) {
      this.add.ellipse(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(310, 420),
        Phaser.Math.Between(10, 30),
        Phaser.Math.Between(5, 12),
        0x5A4A3A, 0.5
      );
    }

    // Spooky trees
    for (const tx of [40, 140, 660, 750]) {
      this.add.rectangle(tx, 295, 5, 40, 0x2A1A0A);
      this.add.rectangle(tx - 10, 278, 2, 18, 0x2A1A0A).setAngle(-30);
      this.add.rectangle(tx + 8, 282, 2, 15, 0x2A1A0A).setAngle(25);
    }
  }

  drawAncientGate() {
    const gateX = 400;
    const gateY = 250;

    // === STONE PILLARS (thick, weathered) ===
    // Left pillar
    this.add.rectangle(305, gateY + 15, 35, 110, 0x5A5050).setDepth(1);
    this.add.rectangle(305, gateY + 15, 31, 106, 0x6A6060, 0.9).setDepth(1);
    // Pillar cap
    this.add.rectangle(305, gateY - 40, 42, 12, 0x6A6060).setDepth(1);
    // Pillar base
    this.add.rectangle(305, gateY + 68, 42, 10, 0x5A5050).setDepth(1);

    // Right pillar
    this.add.rectangle(495, gateY + 15, 35, 110, 0x5A5050).setDepth(1);
    this.add.rectangle(495, gateY + 15, 31, 106, 0x6A6060, 0.9).setDepth(1);
    this.add.rectangle(495, gateY - 40, 42, 12, 0x6A6060).setDepth(1);
    this.add.rectangle(495, gateY + 68, 42, 10, 0x5A5050).setDepth(1);

    // === STONE ARCH (curved top) ===
    // Outer arch
    this.add.ellipse(gateX, gateY - 30, 230, 60, 0x5A5050).setDepth(1);
    // Inner arch (hollow out)
    this.add.ellipse(gateX, gateY - 25, 190, 45, 0x1A0A2E).setDepth(1);
    // Arch keystone
    this.add.rectangle(gateX, gateY - 55, 20, 20, 0x7A7070).setDepth(2);

    // === RUNE STONES on pillars (glowing) ===
    const runePositions = [
      [305, gateY - 20], [305, gateY + 5], [305, gateY + 30],
      [495, gateY - 20], [495, gateY + 5], [495, gateY + 30],
    ];
    runePositions.forEach(([rx, ry]) => {
      const rune = this.add.circle(rx, ry, 5, 0x4A90D9, 0.4).setDepth(2);
      this.tweens.add({
        targets: rune, alpha: { from: 0.2, to: 0.6 },
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true, repeat: -1
      });
    });

    // === IRON GATE BARS (stored for opening animation) ===
    this.gateBars = [];
    for (let i = 0; i < 7; i++) {
      const bx = 330 + i * 25;
      this.gateBars.push(this.add.rectangle(bx, gateY + 20, 4, 80, 0x3A3535).setDepth(2));
      // Rivets
      this.gateBars.push(this.add.circle(bx, gateY - 10, 2, 0x4A4545).setDepth(2));
      this.gateBars.push(this.add.circle(bx, gateY + 50, 2, 0x4A4545).setDepth(2));
    }
    // Horizontal bars
    this.gateBars.push(this.add.rectangle(gateX, gateY + 5, 160, 4, 0x3A3535).setDepth(2));
    this.gateBars.push(this.add.rectangle(gateX, gateY + 40, 160, 4, 0x3A3535).setDepth(2));

    // === GATE BARRIER (magical glow — removed when puzzle solved) ===
    this.gateBarrier = this.add.rectangle(gateX, gateY + 15, 160, 90, 0x4A0060, 0.35).setDepth(3);
    this.gateGlow = this.add.rectangle(gateX, gateY + 15, 160, 90, 0x8040C0, 0.15).setDepth(3);
    this.tweens.add({
      targets: this.gateGlow,
      alpha: { from: 0.08, to: 0.25 },
      duration: 1200, yoyo: true, repeat: -1
    });

    // SEALED text
    this.gateText = this.add.text(gateX, gateY + 15, 'SEALED', {
      fontSize: '14px', color: '#C080FF', fontFamily: 'Arial',
      stroke: '#2A0040', strokeThickness: 2
    }).setOrigin(0.5).setDepth(4);

    // Vine/moss on pillars
    [[290, gateY - 10], [300, gateY + 40], [500, gateY - 15], [490, gateY + 35]].forEach(([vx, vy]) => {
      this.add.ellipse(vx, vy, 8, 12, 0x2A4A2A, 0.4).setDepth(2);
    });
  }

  placeCharacters() {
    this.dax = this.add.sprite(120, 370, 'dax', 0).setScale(1.3).setDepth(5);
    this.silver = this.add.image(70, 340, 'dragon').setScale(0.9).setFlipX(true).setDepth(4);
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

    // ESC via timer
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
    this.showDialogSequence([
      { speaker: 'Dax', text: 'There it is! The ancient gate!' },
      { speaker: 'Silver', text: 'It\'s sealed with magic. See those glowing runes?' },
      { speaker: 'Silver', text: 'Watch the pattern, then repeat it. Like a memory game! It gets longer each round.' },
    ], () => {
      this.time.delayedCall(500, () => this.startPuzzle());
    });
  }

  startPuzzle() {
    this.hideSkipButton();

    // The rune symbols
    this.runeShapes = ['star', 'moon', 'heart', 'diamond'];
    this.runeColors = {
      star: 0xFFD700,
      moon: 0xC0A0FF,
      heart: 0xFF69B4,
      diamond: 0x87CEEB,
    };

    // Create the 4 clickable rune buttons (Simon Says pads)
    const padY = 375;
    const padStartX = 280;
    const padSpacing = 80;

    this.runePads = {};
    this.runeShapes.forEach((shape, i) => {
      const x = padStartX + i * padSpacing;
      const color = this.runeColors[shape];

      // Pad background (dim when idle)
      const pad = this.add.circle(x, padY, 26, color, 0.25).setDepth(10);
      pad.setStrokeStyle(2, color, 0.6);
      pad.setInteractive({ useHandCursor: true });

      // Rune symbol on pad
      this.drawRuneSymbol(x, padY, shape, color, 0.5, 11);

      // Label
      this.add.text(x, padY + 32, shape, {
        fontSize: '8px', color: '#888888', fontFamily: 'Arial'
      }).setOrigin(0.5).setDepth(10);

      pad.on('pointerdown', () => {
        if (!this.isPlayerTurn || this.puzzleSolved) return;
        this.onPadPress(shape);
      });

      this.runePads[shape] = { pad, x, y: padY, color };
    });

    // Round indicator
    this.roundText = this.add.text(400, 310, '', {
      fontSize: '13px', color: '#E0C0FF', fontFamily: 'Arial',
      stroke: '#1A0A2E', strokeThickness: 2
    }).setOrigin(0.5).setDepth(10);

    // Timer bar
    this.timerBarBg = this.add.rectangle(400, 340, 200, 8, 0x1A0A2E, 0.6).setDepth(10);
    this.timerBar = this.add.rectangle(300, 340, 200, 6, 0x4A90D9, 0.8).setDepth(11);
    this.timerBar.setOrigin(0, 0.5);
    this.timerBarBg.setVisible(false);
    this.timerBar.setVisible(false);

    // Status text
    this.statusText = this.add.text(400, 420, '', {
      fontSize: '11px', color: '#A0A0C0', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(10);

    // Start round 1
    this.startRound();
  }

  startRound() {
    this.currentRound++;
    this.patternLength = 2 + this.currentRound; // 3, 4, 5, 6
    this.selectedRunes = [];

    this.roundText.setText(`Round ${this.currentRound} of ${this.totalRounds}`);
    this.statusText.setText('Watch the pattern...');

    // Generate random pattern
    this.targetPattern = [];
    for (let i = 0; i < this.patternLength; i++) {
      this.targetPattern.push(this.runeShapes[Phaser.Math.Between(0, this.runeShapes.length - 1)]);
    }

    // Show the pattern (Simon Says style)
    this.time.delayedCall(800, () => this.showPattern());
  }

  showPattern() {
    this.isShowingPattern = true;
    let delay = 0;
    const flashDuration = 500;
    const gap = 200;

    this.targetPattern.forEach((shape, i) => {
      this.time.delayedCall(delay, () => {
        this.flashPad(shape, flashDuration);
      });
      delay += flashDuration + gap;
    });

    // After pattern shown, enable player input
    this.time.delayedCall(delay + 300, () => {
      this.isShowingPattern = false;
      this.isPlayerTurn = true;
      this.statusText.setText('Your turn! Repeat the pattern.');

      // Start timer
      this.startTimer();
    });
  }

  flashPad(shape, duration) {
    const pad = this.runePads[shape];
    if (!pad) return;

    // Bright flash
    pad.pad.setFillStyle(pad.color, 0.9);
    pad.pad.setScale(1.15);

    this.time.delayedCall(duration, () => {
      pad.pad.setFillStyle(pad.color, 0.25);
      pad.pad.setScale(1);
    });
  }

  startTimer() {
    // Timer gives ~8 seconds per round (forgiving)
    const timerDuration = 8000 + this.patternLength * 1000;
    this.timerBarBg.setVisible(true);
    this.timerBar.setVisible(true);
    this.timerBar.displayWidth = 200;

    this.timerTween = this.tweens.add({
      targets: this.timerBar,
      displayWidth: 0,
      duration: timerDuration,
      ease: 'Linear',
      onComplete: () => {
        if (this.isPlayerTurn && !this.puzzleSolved) {
          this.isPlayerTurn = false;
          this.puzzleFail('Time\'s up!');
        }
      }
    });

    // Color change as timer runs out
    this.time.delayedCall(timerDuration * 0.6, () => {
      this.timerBar.setFillStyle(0xE0A000, 0.8);
    });
    this.time.delayedCall(timerDuration * 0.85, () => {
      this.timerBar.setFillStyle(0xE04040, 0.8);
    });
  }

  onPadPress(shape) {
    // Flash the pad
    this.flashPad(shape, 200);
    this.selectedRunes.push(shape);

    const idx = this.selectedRunes.length - 1;

    // Check if this press is correct
    if (this.selectedRunes[idx] !== this.targetPattern[idx]) {
      this.isPlayerTurn = false;
      if (this.timerTween) this.timerTween.stop();
      this.puzzleFail('Wrong pattern!');
      return;
    }

    // Check if pattern complete
    if (this.selectedRunes.length === this.targetPattern.length) {
      this.isPlayerTurn = false;
      if (this.timerTween) this.timerTween.stop();
      this.roundSuccess();
    }
  }

  roundSuccess() {
    this.statusText.setText('Correct!');
    this.timerBarBg.setVisible(false);
    this.timerBar.setVisible(false);

    // Flash all pads green
    Object.values(this.runePads).forEach(p => {
      p.pad.setFillStyle(0x40E040, 0.7);
      this.time.delayedCall(500, () => p.pad.setFillStyle(p.color, 0.25));
    });

    // Rune glow on gate pillar (one per round)
    const glowPositions = [[305, 240], [495, 240], [305, 270], [495, 270]];
    if (this.currentRound <= glowPositions.length) {
      const [gx, gy] = glowPositions[this.currentRound - 1];
      const glow = this.add.circle(gx, gy, 8, 0x40D0FF, 0).setDepth(5);
      this.tweens.add({ targets: glow, alpha: 0.8, duration: 400 });
    }

    if (this.currentRound >= this.totalRounds) {
      // All rounds complete!
      this.time.delayedCall(800, () => this.puzzleSuccess());
    } else {
      // Next round
      this.time.delayedCall(1200, () => this.startRound());
    }
  }

  puzzleFail(reason) {
    this.statusText.setText(reason + ' Try again!');
    this.timerBarBg.setVisible(false);
    this.timerBar.setVisible(false);
    this.timerBar.setFillStyle(0x4A90D9, 0.8);

    // Camera shake + red flash
    this.cameras.main.shake(300, 0.005);
    const flash = this.add.rectangle(400, 300, 800, 450, 0xFF0000, 0.1).setDepth(15);
    this.tweens.add({
      targets: flash, alpha: 0, duration: 500,
      onComplete: () => flash.destroy()
    });

    // Flash pads red
    Object.values(this.runePads).forEach(p => {
      p.pad.setFillStyle(0xFF4040, 0.5);
      this.time.delayedCall(400, () => p.pad.setFillStyle(p.color, 0.25));
    });

    // Retry same round (forgiving — don't advance)
    this.time.delayedCall(1500, () => {
      this.selectedRunes = [];
      this.currentRound--; // undo so startRound re-increments to same round
      this.startRound();
    });
  }

  puzzleSuccess() {
    this.puzzleSolved = true;
    this.cameras.main.shake(300, 0.008);

    // Gate barrier dissolves
    this.tweens.add({
      targets: [this.gateBarrier, this.gateGlow, this.gateText],
      alpha: 0, duration: 1500, ease: 'Sine.easeIn'
    });

    // Iron bars slide up and fade (gate opens!)
    this.tweens.add({
      targets: this.gateBars,
      y: '-=80',
      alpha: 0,
      duration: 1500,
      delay: 300,
      ease: 'Sine.easeIn'
    });

    // Golden sparkles
    for (let i = 0; i < 25; i++) {
      const spark = this.add.circle(
        400 + Phaser.Math.Between(-60, 60),
        265 + Phaser.Math.Between(-40, 40),
        Phaser.Math.Between(1, 3),
        [0xFFD700, 0x87CEEB, 0xFFFFFF][Phaser.Math.Between(0, 2)], 0
      ).setDepth(15);
      this.tweens.add({
        targets: spark, alpha: 0.9,
        y: spark.y - Phaser.Math.Between(20, 60),
        x: spark.x + Phaser.Math.Between(-20, 20),
        duration: Phaser.Math.Between(600, 1200),
        delay: Phaser.Math.Between(0, 400),
        yoyo: true, onComplete: () => spark.destroy()
      });
    }

    this.statusText.setText('');
    this.roundText.setText('');

    this.time.delayedCall(1500, () => {
      this.skipBg.setVisible(true);
      this.skipTextObj.setVisible(true);
      this.showDialogSequence([
        { speaker: 'Dax', text: 'We did it! The gate is opening!' },
        { speaker: 'Silver', text: 'Brilliant! Hop on, I\'ll fly us up!' },
      ], () => {
        this.hideSkipButton();
        this.climbMountain();
      });
    });
  }

  climbMountain() {
    this.tweens.add({
      targets: this.dax,
      x: 400, y: 280, scaleX: 0.8, scaleY: 0.8,
      duration: 800, ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: this.silver,
      x: 380, y: 260, duration: 800,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.tweens.add({
          targets: [this.dax, this.silver],
          y: -100, duration: 1500, ease: 'Quad.easeIn'
        });

        const climbText = this.add.text(400, 200, 'Climbing the mountain...', {
          fontSize: '24px', color: '#E0C0FF', fontFamily: 'Arial',
          stroke: '#1A0A2E', strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0).setDepth(15);
        this.tweens.add({ targets: climbText, alpha: 1, duration: 600, delay: 500 });

        this.time.delayedCall(3000, () => {
          this.cameras.main.fadeOut(1200, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('WizardScene');
          });
        });
      }
    });
  }

  drawRuneSymbol(x, y, shape, color, alpha, depth) {
    const g = this.add.graphics().setDepth(depth).setAlpha(alpha);

    switch (shape) {
      case 'star':
        g.fillStyle(color);
        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
          const ox = x + Math.cos(angle) * 12;
          const oy = y + Math.sin(angle) * 12;
          const ix = x + Math.cos(innerAngle) * 5;
          const iy = y + Math.sin(innerAngle) * 5;
          if (i === 0) { g.beginPath(); g.moveTo(ox, oy); }
          else g.lineTo(ox, oy);
          g.lineTo(ix, iy);
        }
        g.closePath();
        g.fillPath();
        break;
      case 'moon':
        g.fillStyle(color);
        g.fillCircle(x, y, 10);
        g.fillStyle(0x1A0A2E);
        g.fillCircle(x + 5, y - 2, 8);
        break;
      case 'heart':
        g.fillStyle(color);
        g.beginPath();
        g.moveTo(x, y + 8);
        g.lineTo(x - 11, y - 3);
        g.arc(x - 6, y - 6, 6, Math.PI, 0, false);
        g.arc(x + 6, y - 6, 6, Math.PI, 0, false);
        g.lineTo(x + 11, y - 3);
        g.closePath();
        g.fillPath();
        break;
      case 'diamond':
        g.fillStyle(color);
        g.beginPath();
        g.moveTo(x, y - 12);
        g.lineTo(x + 9, y);
        g.lineTo(x, y + 12);
        g.lineTo(x - 9, y);
        g.closePath();
        g.fillPath();
        break;
    }
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

    const speakerColors = { 'Dax': '#F0B860', 'Silver': '#A8C4DC' };
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
