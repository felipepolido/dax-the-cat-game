import Phaser from 'phaser';

export default class WizardBattleScene extends Phaser.Scene {
  constructor() {
    super('WizardBattleScene');
  }

  create() {
    this.dialogActive = false;
    this.dialogQueue = [];
    this.dialogCallback = null;
    this.battleActive = false;
    this.lives = 5;
    this.hits = 0;
    this.hitsNeeded = 10;
    this.projectiles = [];
    this.gameOver = false;
    this.projectileSpeed = 2200; // ms to cross from wizard to shield
    this.projectileInterval = 1800;

    this.drawBattleArena();
    this.placeCharacters();
    this.createUI();
    this.setupDialog();
    this.setupControls();

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.time.delayedCall(1500, () => this.introBattle());
  }

  drawBattleArena() {
    // Full background cover
    this.add.rectangle(400, 225, 800, 450, 0x0A0010);

    // Dark magical arena — Nightmare Village backdrop
    this.add.rectangle(400, 100, 800, 60, 0x120020);
    this.add.rectangle(400, 150, 800, 50, 0x1A0030);
    this.add.rectangle(400, 190, 800, 40, 0x200040);

    // Sickly clouds
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.ellipse(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(30, 100),
        Phaser.Math.Between(80, 140),
        Phaser.Math.Between(15, 30),
        [0x200020, 0x2A0010][Phaser.Math.Between(0, 1)],
        Phaser.Math.FloatBetween(0.2, 0.4)
      );
      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(-15, 15),
        alpha: cloud.alpha * 0.5,
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true, repeat: -1
      });
    }

    // Eerie red moon
    this.add.circle(680, 50, 18, 0x880020, 0.6);
    this.add.circle(680, 50, 30, 0xFF0000, 0.04);

    // Stone arena floor
    this.add.rectangle(400, 360, 800, 140, 0x1A1020);
    this.add.rectangle(400, 395, 800, 80, 0x120A18);
    this.add.rectangle(400, 440, 800, 40, 0x0A0510);

    // Cracked floor
    for (let i = 0; i < 8; i++) {
      const cx = Phaser.Math.Between(50, 750);
      const cy = Phaser.Math.Between(320, 420);
      const crack = this.add.rectangle(cx, cy, Phaser.Math.Between(15, 40), 1, 0x2A1A30, 0.3);
      crack.setAngle(Phaser.Math.Between(-20, 20));
    }

    // Malachar's tower in background
    this.add.rectangle(600, 180, 50, 140, 0x0A0010);
    this.add.rectangle(600, 180, 46, 136, 0x150020, 0.8);
    this.add.triangle(600, 105, 0, 25, 35, -35, 70, 25, 0x0A0010);
    const towerGlow = this.add.rectangle(600, 125, 8, 10, 0x40E040, 0.3);
    this.tweens.add({
      targets: towerGlow,
      alpha: { from: 0.15, to: 0.5 },
      duration: 1200,
      yoyo: true, repeat: -1
    });

    // Magic circle on the ground
    const arenaCircle = this.add.ellipse(400, 360, 500, 80, 0x4A0080, 0.15);
    this.tweens.add({
      targets: arenaCircle,
      alpha: { from: 0.08, to: 0.2 },
      duration: 2000,
      yoyo: true, repeat: -1
    });

    // Floating green particles
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(200, 600),
        Phaser.Math.Between(100, 300),
        Phaser.Math.Between(1, 2),
        0x40E040, 0
      );
      this.tweens.add({
        targets: particle,
        alpha: { from: 0, to: 0.4 },
        y: particle.y - Phaser.Math.Between(20, 50),
        duration: Phaser.Math.Between(2000, 3500),
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 1500)
      });
    }
  }

  placeCharacters() {
    // Silver watching from behind
    this.silver = this.add.image(60, 330, 'dragon').setScale(0.7).setFlipX(true).setDepth(1).setAlpha(0.8);

    // Dax on the left side with shield
    this.dax = this.add.sprite(160, 310, 'dax', 0).setScale(1.4).setDepth(5);

    // Magic shield — a glowing circle in front of Dax
    this.shield = this.add.circle(200, 310, 22, 0x60B0FF, 0.6).setDepth(6);
    this.shieldRing = this.add.circle(200, 310, 22, 0x80D0FF, 0).setDepth(6);
    this.shieldRing.setStrokeStyle(3, 0xA0E0FF, 0.8);
    this.shieldGlow = this.add.circle(200, 310, 30, 0x4090FF, 0.15).setDepth(5);

    // Wizard on the right
    this.wizard = this.add.image(620, 290, 'wizard').setScale(1.3).setDepth(5);
    this.wizardLabel = this.add.text(620, 220, 'Malachar', {
      fontSize: '11px', color: '#40E040', fontFamily: 'Arial',
      stroke: '#0A0010', strokeThickness: 3
    }).setOrigin(0.5).setDepth(5);

    // Wizard dark aura
    this.wizardAura = this.add.circle(620, 290, 50, 0x40E040, 0.12).setDepth(4);
    this.tweens.add({
      targets: this.wizardAura,
      scaleX: 1.2, scaleY: 1.2,
      alpha: 0.05,
      duration: 1500,
      yoyo: true, repeat: -1
    });

    // Wizard menacing hover
    this.tweens.add({
      targets: this.wizard,
      y: this.wizard.y - 4,
      duration: 1200,
      yoyo: true, repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createUI() {
    // Lives display (hearts)
    this.heartsDisplay = [];
    for (let i = 0; i < 5; i++) {
      const heart = this.add.text(30 + i * 24, 15, '❤️', {
        fontSize: '18px'
      }).setDepth(20);
      this.heartsDisplay.push(heart);
    }
    this.add.text(78, 40, 'Lives', {
      fontSize: '10px', color: '#FF8080', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5, 0).setDepth(20);

    // Progress bar
    this.add.rectangle(400, 18, 200, 14, 0x000000, 0.6).setDepth(20);
    this.add.rectangle(400, 18, 198, 12, 0x1A0A2E, 0.8).setDepth(20);
    this.progressBar = this.add.rectangle(301, 18, 0, 10, 0x60B0FF, 0.9).setDepth(21);
    this.progressBar.setOrigin(0, 0.5);
    this.progressLabel = this.add.text(400, 32, '0 / ' + this.hitsNeeded, {
      fontSize: '10px', color: '#A0D0FF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);

    // Instructions
    this.instructionText = this.add.text(400, 460, '', {
      fontSize: '13px', color: '#A0A0C0', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(20).setAlpha(0);
  }

  setupControls() {
    // Use keyboard events instead of update loop polling
    this.shieldMoving = { up: false, down: false };
    this.cursors = this.input.keyboard.createCursorKeys();

    // Shield movement via repeating timer (independent of update loop)
    this.time.addEvent({
      delay: 16, // ~60fps
      loop: true,
      callback: () => {
        if (!this.battleActive) return;
        const speed = 4;
        if (this.cursors.up.isDown) {
          this.moveShield(-speed);
        }
        if (this.cursors.down.isDown) {
          this.moveShield(speed);
        }
      }
    });
  }

  moveShield(dy) {
    const newY = Phaser.Math.Clamp(this.shield.y + dy, 220, 400);
    this.shield.y = newY;
    this.shieldRing.y = newY;
    this.shieldGlow.y = newY;
    this.dax.y = newY;
  }

  setupDialog() {
    this.dialogBg = this.add.rectangle(400, 430, 760, 50, 0x000000, 0.85).setVisible(false).setDepth(30);
    this.dialogText = this.add.text(400, 430, '', {
      fontSize: '15px', color: '#FFFFFF', fontFamily: 'Arial',
      wordWrap: { width: 700 }
    }).setOrigin(0.5).setVisible(false).setDepth(30);
    this.dialogHint = this.add.text(750, 445, 'SPACE', {
      fontSize: '10px', color: '#AAAAAA', fontFamily: 'Arial'
    }).setOrigin(1, 1).setVisible(false).setDepth(30);

    this.skipBg = this.add.rectangle(750, 55, 70, 24, 0x000000, 0.5).setStrokeStyle(1, 0xAAAAAA).setDepth(30);
    this.skipBg.setInteractive({ useHandCursor: true });
    this.skipTextObj = this.add.text(750, 55, 'Skip \u25B6', {
      fontSize: '12px', color: '#CCCCCC', fontFamily: 'Arial'
    }).setOrigin(0.5).setDepth(30);
    this.skipBg.on('pointerover', () => this.skipTextObj.setColor('#FFFFFF'));
    this.skipBg.on('pointerout', () => this.skipTextObj.setColor('#CCCCCC'));
    this.skipBg.on('pointerdown', () => this.skipAllDialog());
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // ESC check via timer instead of update
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (this.dialogActive && Phaser.Input.Keyboard.JustDown(this.escKey)) {
          this.skipAllDialog();
        }
      }
    });
  }

  introBattle() {
    this.showDialogSequence([
      { speaker: 'Malachar', text: 'Let us see how you handle THIS!' },
      { speaker: 'Silver', text: 'Dax! I\'ll give you my magic shield! Use it to block his spells!' },
      { speaker: 'Dax', text: 'A magic shield? Awesome! Let\'s do this!' },
      { speaker: 'Silver', text: 'Move the shield UP and DOWN to block his attacks!' },
    ], () => {
      this.hideSkipButton();
      this.startBattle();
    });
  }

  startBattle() {
    this.battleActive = true;

    // Show instruction text briefly
    this.instructionText.setText('⬆️ ⬇️ Move Shield     Block the spells!');
    this.tweens.add({ targets: this.instructionText, alpha: 1, duration: 400 });
    this.time.delayedCall(4000, () => {
      this.tweens.add({ targets: this.instructionText, alpha: 0, duration: 800 });
    });

    // Shield glow pulse
    this.tweens.add({
      targets: this.shieldGlow,
      alpha: { from: 0.1, to: 0.3 },
      scaleX: 1.3, scaleY: 1.3,
      duration: 800,
      yoyo: true, repeat: -1
    });

    // Start spawning projectiles using a repeating timer
    this.spawnTimer = this.time.addEvent({
      delay: this.projectileInterval,
      loop: true,
      callback: () => {
        if (this.battleActive && !this.gameOver) {
          this.fireProjectile();
        }
      }
    });

    // Fire first one immediately
    this.time.delayedCall(500, () => {
      if (this.battleActive) this.fireProjectile();
    });
  }

  fireProjectile() {
    const types = [
      { color: 0xFF4400, glowColor: 0xFF8800, name: 'fireball', size: 8 },
      { color: 0x40E040, glowColor: 0x80FF80, name: 'darkbolt', size: 7 },
      { color: 0x8040FF, glowColor: 0xC080FF, name: 'shadow', size: 9 },
    ];
    const type = types[Phaser.Math.Between(0, types.length - 1)];

    // Wizard casting animation
    this.tweens.add({
      targets: this.wizard,
      scaleX: 1.4, scaleY: 1.4,
      duration: 150,
      yoyo: true
    });

    const startX = 580;
    const startY = 280;
    const shieldX = 200;
    const ceilingY = 220;
    const floorY = 400;

    const projectile = this.add.circle(startX, startY, type.size, type.color, 0.9).setDepth(10);
    const glow = this.add.circle(startX, startY, type.size + 5, type.glowColor, 0.2).setDepth(9);

    // Pong-style: horizontal speed + bouncing vertical speed
    const framesNeeded = this.projectileSpeed / 16;
    const vx = -(startX - shieldX) / framesNeeded; // pixels per 16ms frame
    const vy = Phaser.Math.FloatBetween(-3, 3) || 1.5; // random bounce angle

    const proj = {
      body: projectile,
      glow: glow,
      type: type,
      deflected: false,
      active: true,
      vx: vx,
      vy: vy,
      moveTimer: null
    };
    this.projectiles.push(proj);

    // Collision check via timer
    const collisionCheck = this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        if (!proj.active || proj.deflected) { collisionCheck.remove(); return; }
        const dx = projectile.x - this.shield.x;
        const dy = projectile.y - this.shield.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 35) {
          proj.deflected = true;
          collisionCheck.remove();
          this.deflectProjectile(proj);
        }
      }
    });

    // Pong-style movement: bounces off ceiling and floor
    proj.moveTimer = this.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        if (!proj.active || proj.deflected) { proj.moveTimer.remove(); return; }

        projectile.x += proj.vx;
        projectile.y += proj.vy;
        glow.x = projectile.x;
        glow.y = projectile.y;

        // Bounce off ceiling and floor
        if (projectile.y <= ceilingY) {
          proj.vy = Math.abs(proj.vy);
          projectile.y = ceilingY;
        } else if (projectile.y >= floorY) {
          proj.vy = -Math.abs(proj.vy);
          projectile.y = floorY;
        }

        // Reached shield area — hit Dax
        if (projectile.x <= shieldX) {
          proj.moveTimer.remove();
          collisionCheck.remove();
          if (!proj.deflected) {
            proj.active = false;
            projectile.destroy();
            glow.destroy();
            this.removeProjectile(proj);
            this.daxHit();
          }
        }
      }
    });

    // Trail effect
    this.time.addEvent({
      delay: 120,
      repeat: Math.floor(this.projectileSpeed / 120),
      callback: () => {
        if (!proj.active || proj.deflected) return;
        const trail = this.add.circle(projectile.x + 3, projectile.y, 2, type.color, 0.3).setDepth(8);
        this.tweens.add({
          targets: trail,
          alpha: 0, scaleX: 0.2, scaleY: 0.2,
          duration: 300,
          onComplete: () => trail.destroy()
        });
      }
    });
  }

  deflectProjectile(proj) {
    // Stop the forward movement timer
    if (proj.moveTimer) proj.moveTimer.remove();
    this.tweens.killTweensOf(proj.body);
    this.tweens.killTweensOf(proj.glow);

    // Shield flash
    this.shield.setFillStyle(0xFFFFFF, 0.9);
    this.time.delayedCall(150, () => this.shield.setFillStyle(0x60B0FF, 0.6));

    // Sparks on deflection
    for (let i = 0; i < 6; i++) {
      const spark = this.add.circle(
        proj.body.x, proj.body.y,
        Phaser.Math.Between(1, 3), 0xFFFFFF, 0.8
      ).setDepth(12);
      this.tweens.add({
        targets: spark,
        x: spark.x + Phaser.Math.Between(-30, 30),
        y: spark.y + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: 300,
        onComplete: () => spark.destroy()
      });
    }

    // Change color to blue (reflected)
    proj.body.setFillStyle(0x60B0FF, 0.9);
    proj.glow.setFillStyle(0xA0D0FF, 0.3);

    // Tween back toward wizard
    this.tweens.add({
      targets: [proj.body, proj.glow],
      x: 620,
      y: 290,
      duration: this.projectileSpeed / 2,
      ease: 'Linear',
      onComplete: () => {
        if (!proj.active) return;
        proj.active = false;
        proj.body.destroy();
        proj.glow.destroy();
        this.removeProjectile(proj);
        this.wizardHit();
      }
    });
  }

  removeProjectile(proj) {
    const idx = this.projectiles.indexOf(proj);
    if (idx >= 0) this.projectiles.splice(idx, 1);
  }

  wizardHit() {
    this.hits++;

    // Update progress bar
    const progress = (this.hits / this.hitsNeeded) * 196;
    this.tweens.add({ targets: this.progressBar, displayWidth: progress, duration: 300 });
    this.progressLabel.setText(this.hits + ' / ' + this.hitsNeeded);

    // Wizard takes hit
    this.wizard.setTint(0xFFFFFF);
    this.time.delayedCall(200, () => this.wizard.clearTint());
    this.cameras.main.shake(200, 0.005);

    // Weaken wizard aura
    const auraAlpha = 0.12 * (1 - this.hits / this.hitsNeeded);
    this.wizardAura.setAlpha(Math.max(0, auraAlpha));

    // Hit sparks
    for (let i = 0; i < 8; i++) {
      const spark = this.add.circle(
        620 + Phaser.Math.Between(-20, 20),
        290 + Phaser.Math.Between(-20, 20),
        Phaser.Math.Between(2, 4),
        [0x60B0FF, 0xFFD700, 0xFFFFFF][Phaser.Math.Between(0, 2)],
        0.8
      ).setDepth(12);
      this.tweens.add({
        targets: spark,
        x: spark.x + Phaser.Math.Between(-40, 40),
        y: spark.y + Phaser.Math.Between(-40, 40),
        alpha: 0, duration: 500,
        onComplete: () => spark.destroy()
      });
    }

    // Increase difficulty every 3 hits
    if (this.hits % 3 === 0 && this.hits < this.hitsNeeded) {
      this.projectileSpeed = Math.max(1200, this.projectileSpeed - 200);
      this.projectileInterval = Math.max(1000, this.projectileInterval - 150);
      if (this.spawnTimer) {
        this.spawnTimer.delay = this.projectileInterval;
      }
    }

    // Wizard taunts
    if (this.hits === 3) {
      this.showQuickText('Malachar: Lucky shot!', '#40E040');
    } else if (this.hits === 6) {
      this.showQuickText('Malachar: Stop that!', '#40E040');
    } else if (this.hits === 9) {
      this.showQuickText('Malachar: No... impossible!', '#40E040');
    }

    // Check win
    if (this.hits >= this.hitsNeeded) {
      this.battleActive = false;
      if (this.spawnTimer) this.spawnTimer.remove();
      this.clearAllProjectiles();
      this.time.delayedCall(600, () => this.battleWon());
    }
  }

  showQuickText(text, color) {
    const qt = this.add.text(400, 200, text, {
      fontSize: '16px', color: color, fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(25).setAlpha(0);
    this.tweens.add({
      targets: qt, alpha: 1, y: 180, duration: 400,
      hold: 1200,
      onComplete: () => {
        this.tweens.add({ targets: qt, alpha: 0, duration: 400, onComplete: () => qt.destroy() });
      }
    });
  }

  daxHit() {
    this.lives--;

    // Update hearts
    if (this.heartsDisplay[this.lives]) {
      this.tweens.add({
        targets: this.heartsDisplay[this.lives],
        alpha: 0.2, scaleX: 1.5, scaleY: 1.5,
        duration: 300, yoyo: true,
        onComplete: () => {
          if (this.heartsDisplay[this.lives]) {
            this.heartsDisplay[this.lives].setText('🖤');
            this.heartsDisplay[this.lives].setAlpha(0.5);
          }
        }
      });
    }

    // Dax flash red
    this.dax.setTint(0xFF4444);
    this.time.delayedCall(300, () => this.dax.clearTint());
    this.cameras.main.shake(200, 0.008);

    // Silver encouragement
    if (this.lives === 3) {
      this.showQuickText('Silver: You can do it, Dax!', '#A8C4DC');
    } else if (this.lives === 1) {
      this.showQuickText('Silver: Careful! One more hit!', '#A8C4DC');
    }

    if (this.lives <= 0) {
      this.battleActive = false;
      if (this.spawnTimer) this.spawnTimer.remove();
      this.clearAllProjectiles();
      this.time.delayedCall(500, () => this.battleLost());
    }
  }

  battleLost() {
    // Very forgiving — restart with full lives, keep progress
    this.showDialogSequence([
      { speaker: 'Silver', text: 'Don\'t give up, Dax! I\'ll heal you with my dragon magic!' },
      { speaker: 'Dax', text: 'Thanks Silver! Let\'s try again!' },
    ], () => {
      this.lives = 5;
      this.heartsDisplay.forEach(h => { h.setText('❤️'); h.setAlpha(1); });
      this.hideSkipButton();
      this.startBattle();
    });
  }

  clearAllProjectiles() {
    this.projectiles.forEach(p => {
      if (p.moveTimer) p.moveTimer.remove();
      this.tweens.killTweensOf(p.body);
      this.tweens.killTweensOf(p.glow);
      if (p.body) p.body.destroy();
      if (p.glow) p.glow.destroy();
    });
    this.projectiles = [];
  }

  battleWon() {
    // Wizard staggers
    this.tweens.add({
      targets: this.wizard,
      scaleX: 1.1, scaleY: 1.1,
      angle: -5, duration: 500,
      yoyo: true, repeat: 2
    });

    // Dialog, then disappear
    this.skipBg.setVisible(true);
    this.skipTextObj.setVisible(true);
    this.showDialogSequence([
      { speaker: 'Malachar', text: 'No... NO! This can\'t be happening!' },
      { speaker: 'Malachar', text: 'You may have won this battle, little cat... but I am FAR from finished!' },
      { speaker: 'Malachar', text: 'You\'ll never find me... or Liliana... *evil laugh*' },
    ], () => {
      this.hideSkipButton();
      this.time.delayedCall(300, () => this.malacharDisappears());
    });
  }

  malacharDisappears() {
    // MASSIVE flash of white/green light
    const flash = this.add.rectangle(400, 225, 800, 450, 0xFFFFFF, 0).setDepth(50);
    this.tweens.add({
      targets: flash, alpha: 0.95, duration: 400,
      yoyo: true, hold: 200,
      onComplete: () => {
        flash.setAlpha(0.3);
        this.tweens.add({ targets: flash, alpha: 0, duration: 1500, onComplete: () => flash.destroy() });
      }
    });

    const greenFlash = this.add.rectangle(400, 225, 800, 450, 0x40E040, 0).setDepth(49);
    this.tweens.add({
      targets: greenFlash, alpha: 0.4, duration: 300, delay: 100,
      yoyo: true, onComplete: () => greenFlash.destroy()
    });

    this.cameras.main.shake(600, 0.015);

    // Wizard vanishes with sparkles
    this.time.delayedCall(400, () => {
      for (let i = 0; i < 30; i++) {
        const spark = this.add.circle(
          620 + Phaser.Math.Between(-30, 30),
          290 + Phaser.Math.Between(-30, 30),
          Phaser.Math.Between(2, 5),
          [0x40E040, 0xFFFFFF, 0x80FF80, 0xFFD700][Phaser.Math.Between(0, 3)],
          0.9
        ).setDepth(48);
        this.tweens.add({
          targets: spark,
          x: spark.x + Phaser.Math.Between(-80, 80),
          y: spark.y + Phaser.Math.Between(-80, 80),
          alpha: 0, scaleX: 0.1, scaleY: 0.1,
          duration: Phaser.Math.Between(600, 1500),
          onComplete: () => spark.destroy()
        });
      }

      this.tweens.add({
        targets: [this.wizard, this.wizardLabel, this.wizardAura],
        alpha: 0, scaleX: 0.1, scaleY: 0.1,
        duration: 800, ease: 'Quad.easeIn'
      });
    });

    // Show the scroll clue
    this.time.delayedCall(2500, () => this.showClue());
  }

  showClue() {
    const scrollX = 620;
    const scrollY = 340;

    // Draw a proper scroll using Canvas (like the reference: rolled ends, parchment body)
    const g = this.add.graphics().setDepth(15).setAlpha(0);

    // Scroll body (parchment)
    const bodyW = 90, bodyH = 70;
    const bx = scrollX - bodyW / 2, by = scrollY - bodyH / 2;

    // Parchment fill with slight gradient effect
    g.fillStyle(0xE8D4A0, 1);
    g.fillRect(bx + 4, by + 8, bodyW - 8, bodyH - 16);
    // Lighter center
    g.fillStyle(0xF0DEB8, 0.7);
    g.fillRect(bx + 10, by + 14, bodyW - 20, bodyH - 28);
    // Aged edges
    g.fillStyle(0xD4B878, 0.4);
    g.fillRect(bx + 4, by + 8, 6, bodyH - 16);
    g.fillRect(bx + bodyW - 10, by + 8, 6, bodyH - 16);

    // Top roller
    g.fillStyle(0xA0462A, 1);
    g.fillRoundedRect(bx - 6, by, bodyW + 12, 12, 6);
    g.fillStyle(0xC85A38, 0.6);
    g.fillRoundedRect(bx - 4, by + 2, bodyW + 8, 5, 3);
    // Roller end caps (red circles)
    g.fillStyle(0x8B2010, 1);
    g.fillCircle(bx - 4, by + 6, 7);
    g.fillCircle(bx + bodyW + 4, by + 6, 7);
    g.fillStyle(0xC04030, 0.5);
    g.fillCircle(bx - 4, by + 5, 4);
    g.fillCircle(bx + bodyW + 4, by + 5, 4);

    // Bottom roller
    g.fillStyle(0xA0462A, 1);
    g.fillRoundedRect(bx - 6, by + bodyH - 12, bodyW + 12, 12, 6);
    g.fillStyle(0xC85A38, 0.6);
    g.fillRoundedRect(bx - 4, by + bodyH - 9, bodyW + 8, 5, 3);
    // Roller end caps
    g.fillStyle(0x8B2010, 1);
    g.fillCircle(bx - 4, by + bodyH - 6, 7);
    g.fillCircle(bx + bodyW + 4, by + bodyH - 6, 7);
    g.fillStyle(0xC04030, 0.5);
    g.fillCircle(bx - 4, by + bodyH - 7, 4);
    g.fillCircle(bx + bodyW + 4, by + bodyH - 7, 4);

    // Scroll text
    const scrollText = this.add.text(scrollX, scrollY - 4, 'Fang\nVillage', {
      fontSize: '13px', color: '#3A2010', fontFamily: 'Arial',
      align: 'center', lineSpacing: 2,
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(16).setAlpha(0);

    // Wolf paw mark (below text)
    const pawG = this.add.graphics().setDepth(16).setAlpha(0);
    const px = scrollX + 28, py = scrollY + 14;
    pawG.fillStyle(0x5A3060, 0.7);
    pawG.fillCircle(px, py, 4);
    pawG.fillCircle(px - 4, py - 5, 2);
    pawG.fillCircle(px, py - 6, 2);
    pawG.fillCircle(px + 4, py - 5, 2);

    // Drop animation
    const scrollParts = [g, scrollText, pawG];
    scrollParts.forEach(p => { p.y -= 50; });
    this.tweens.add({
      targets: scrollParts, alpha: 1, y: '+=50',
      duration: 800, delay: 200, ease: 'Bounce.easeOut'
    });

    // Sparkle around scroll
    this.time.addEvent({
      delay: 400, repeat: 5,
      callback: () => {
        const s = this.add.circle(
          scrollX + Phaser.Math.Between(-40, 40),
          scrollY + Phaser.Math.Between(-35, 35),
          2, 0xFFD700, 0.7
        ).setDepth(14);
        this.tweens.add({ targets: s, alpha: 0, y: s.y - 20, duration: 600, onComplete: () => s.destroy() });
      }
    });

    // Dialog about the clue
    this.time.delayedCall(1500, () => {
      this.skipBg.setVisible(true);
      this.skipTextObj.setVisible(true);
      this.showDialogSequence([
        { speaker: 'Dax', text: 'He vanished! But look... he dropped something!' },
        { speaker: 'Silver', text: 'It\'s a scroll! Let me see...' },
        { speaker: 'Silver', text: '"Fang Village"... and there\'s a wolf paw mark on it.' },
        { speaker: 'Dax', text: 'Fang Village? Isn\'t that the village created and run by wolves?' },
        { speaker: 'Silver', text: 'Yes! It must be where Malachar fled to. He still has Liliana and the Book of All Tales!' },
        { speaker: 'Dax', text: 'Then that\'s where we\'re going next!' },
        { speaker: 'Silver', text: 'You were so brave, Dax. Rest now... our next adventure awaits.' },
      ], () => {
        this.hideSkipButton();
        this.endScene();
      });
    });
  }

  endScene() {
    // Victory sparkles
    for (let i = 0; i < 20; i++) {
      const spark = this.add.circle(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 350),
        Phaser.Math.Between(1, 3),
        [0xFFD700, 0x60B0FF, 0xFFFFFF][Phaser.Math.Between(0, 2)], 0
      ).setDepth(15);
      this.tweens.add({
        targets: spark, alpha: 0.8,
        y: spark.y - Phaser.Math.Between(20, 60),
        duration: Phaser.Math.Between(800, 1500),
        delay: Phaser.Math.Between(0, 800),
        yoyo: true, onComplete: () => spark.destroy()
      });
    }

    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(1500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('WinScene', { adventure: 3 });
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
