import Phaser from 'phaser';

export default class TravelScene extends Phaser.Scene {
  constructor() {
    super('TravelScene');
  }

  create() {
    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.skipped = false;

    // Skip button for cutscene
    this.skipBg = this.add.rectangle(750, 20, 70, 24, 0x000000, 0.5).setStrokeStyle(1, 0xAAAAAA).setDepth(30);
    this.skipBg.setInteractive({ useHandCursor: true });
    this.skipTextObj = this.add.text(750, 20, 'Skip \u25B6', {
      fontSize: '12px', color: '#CCCCCC', fontFamily: 'Arial'
    }).setOrigin(0.5).setDepth(30);
    this.skipBg.on('pointerover', () => this.skipTextObj.setColor('#FFFFFF'));
    this.skipBg.on('pointerout', () => this.skipTextObj.setColor('#CCCCCC'));
    this.skipBg.on('pointerdown', () => this.skipScene());

    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.time.addEvent({
      delay: 100, loop: true,
      callback: () => {
        if (Phaser.Input.Keyboard.JustDown(escKey)) this.skipScene();
      }
    });

    // Phase 1: Map with moving dot
    this.showMapJourney();
  }

  skipScene() {
    if (this.skipped) return;
    this.skipped = true;
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MountainPuzzleScene');
    });
  }

  showMapJourney() {
    // Dark background
    this.add.rectangle(400, 225, 800, 450, 0x1A0A2E);

    // Show the quest map (centered, large)
    this.map = this.add.image(400, 200, 'quest-map').setScale(2.4).setDepth(1);

    // Title
    this.add.text(400, 20, 'The Journey Begins...', {
      fontSize: '18px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#1A0A2E', strokeThickness: 3
    }).setOrigin(0.5).setDepth(5);

    // Glowing dot representing Dax & Silver's position
    // Path: Crystal Palace (left area) -> through forest -> to mountain base
    // Approximate map coordinates (on the 240x170 canvas scaled to screen)
    // Crystal Palace is roughly at map x=40, y=100 -> screen ~240, 280
    // Mountain gate is roughly at map x=180, y=50 -> screen ~580, 160

    // Map canvas is 240x170, displayed at scale 2.4 centered at (400,200)
    // Screen coords: screenX = mapX * 2.4 + 112, screenY = mapY * 2.4 - 4
    // Path on map: (52,128) → curve → (85,100) → curve → (125,65) → curve → (160,35)
    const dot = this.add.circle(237, 303, 6, 0xFFD700, 1).setDepth(10);
    const dotGlow = this.add.circle(237, 303, 10, 0xFFD700, 0.3).setDepth(9);

    // Pulse the dot
    this.tweens.add({
      targets: dotGlow,
      scaleX: 1.5, scaleY: 1.5, alpha: 0.1,
      duration: 600, yoyo: true, repeat: -1
    });

    // Label
    const label = this.add.text(237, 323, 'Dax & Silver', {
      fontSize: '9px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(10);

    // Waypoints follow the dashed path drawn on the quest map
    const waypoints = [
      { x: 280, y: 265, label: 'Leaving the Palace...' },
      { x: 316, y: 236, label: 'Through the Whispering Woods...' },
      { x: 364, y: 188, label: 'Past Moonlake...' },
      { x: 426, y: 148, label: 'Climbing higher...' },
      { x: 460, y: 116, label: 'The Ancient Gate!' },
    ];

    // Status text at bottom
    const statusText = this.add.text(400, 410, 'Leaving the Crystal Palace...', {
      fontSize: '14px', color: '#E0C0FF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(5);

    // Animate dot along waypoints
    let wpIndex = 0;
    const moveToNext = () => {
      if (wpIndex >= waypoints.length) {
        // Journey complete — transition to walking scene
        this.time.delayedCall(800, () => this.startWalkingPhase());
        return;
      }

      const wp = waypoints[wpIndex];
      statusText.setText(wp.label);

      this.tweens.add({
        targets: [dot, dotGlow],
        x: wp.x, y: wp.y,
        duration: 1200,
        ease: 'Sine.easeInOut',
        onUpdate: () => { label.x = dot.x; label.y = dot.y + 18; }
      });

      // Leave a trail dot
      this.time.delayedCall(600, () => {
        this.add.circle(dot.x, dot.y, 2, 0xFFD700, 0.3).setDepth(8);
      });

      wpIndex++;
      this.time.delayedCall(1400, moveToNext);
    };

    this.time.delayedCall(1000, moveToNext);
  }

  startWalkingPhase() {
    // Fade out map
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Clear everything
      this.children.removeAll(true);

      // Phase 2: Brief walking scene
      this.drawWalkingBackground();
      this.cameras.main.fadeIn(600, 0, 0, 0);
    });
  }

  drawWalkingBackground() {
    // Dark mountain forest scene
    // Sky gradient
    this.add.rectangle(400, 50, 800, 100, 0x1A0A2E);
    this.add.rectangle(400, 130, 800, 80, 0x2E1850);
    this.add.rectangle(400, 190, 800, 60, 0x3A2060);

    // Stars
    for (let i = 0; i < 15; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 150),
        Phaser.Math.Between(1, 2),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.3, 0.7)
      );
      this.tweens.add({
        targets: star, alpha: 0.1,
        duration: Phaser.Math.Between(800, 2000),
        yoyo: true, repeat: -1
      });
    }

    // Mountains in background
    this.add.triangle(200, 160, 0, 80, 130, -80, 260, 80, 0x3A2845);
    this.add.triangle(500, 140, 0, 100, 160, -100, 320, 100, 0x4A3858);
    this.add.triangle(700, 170, 0, 70, 110, -70, 220, 70, 0x3A2845);
    // Snow caps
    this.add.triangle(500, 55, 0, 20, 50, -20, 100, 20, 0xE0E8F0, 0.7);

    // Forest/trees
    for (let i = 0; i < 12; i++) {
      const tx = i * 70 + Phaser.Math.Between(-10, 10);
      const ty = Phaser.Math.Between(200, 230);
      const treeH = Phaser.Math.Between(40, 70);
      // Trunk
      this.add.rectangle(tx, ty + treeH / 2, 5, treeH * 0.4, 0x2A1A0A);
      // Canopy
      this.add.triangle(tx, ty, 0, treeH * 0.6, treeH * 0.3, -treeH * 0.4, treeH * 0.6, treeH * 0.6,
        [0x1A3A1A, 0x2A4A2A, 0x1A2A1A][Phaser.Math.Between(0, 2)]);
    }

    // Rocky path/ground
    this.add.rectangle(400, 360, 800, 140, 0x4A3A2A);
    this.add.rectangle(400, 395, 800, 80, 0x3A2A1A);
    this.add.rectangle(400, 430, 800, 40, 0x2A1A0A);

    // Path stones
    for (let i = 0; i < 20; i++) {
      this.add.ellipse(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(300, 420),
        Phaser.Math.Between(10, 25),
        Phaser.Math.Between(5, 10),
        0x5A4A3A, 0.4
      );
    }

    // Dax and Silver walking
    this.silver = this.add.image(-60, 320, 'dragon').setScale(0.8).setFlipX(true).setDepth(3);
    this.dax = this.add.sprite(0, 350, 'dax', 0).setScale(1.2).setDepth(4);

    // Walk across the screen
    this.tweens.add({
      targets: this.silver,
      x: 860,
      duration: 6000,
      ease: 'Linear'
    });
    this.tweens.add({
      targets: this.dax,
      x: 900,
      duration: 6000,
      ease: 'Linear'
    });

    // Dax bobbing as he walks
    this.tweens.add({
      targets: this.dax,
      y: this.dax.y - 3,
      duration: 300,
      yoyo: true, repeat: 10,
      ease: 'Sine.easeInOut'
    });
    this.tweens.add({
      targets: this.silver,
      y: this.silver.y - 2,
      duration: 400,
      yoyo: true, repeat: 7,
      ease: 'Sine.easeInOut'
    });

    // "Hours later..." text
    this.time.delayedCall(1500, () => {
      const hoursText = this.add.text(400, 160, 'Hours later...', {
        fontSize: '22px', color: '#E0C0FF', fontFamily: 'Arial',
        stroke: '#1A0A2E', strokeThickness: 3
      }).setOrigin(0.5).setAlpha(0).setDepth(10);
      this.tweens.add({
        targets: hoursText, alpha: 1, duration: 600,
        hold: 2000,
        onComplete: () => {
          this.tweens.add({ targets: hoursText, alpha: 0, duration: 600 });
        }
      });
    });

    // After walk completes, transition to MountainPuzzleScene
    this.time.delayedCall(5500, () => {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MountainPuzzleScene');
      });
    });
  }
}
