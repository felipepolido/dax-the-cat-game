import Phaser from 'phaser';
import Dax from '../sprites/Dax.js';

const FLOOR_Y = 390;

export default class FantasyScene extends Phaser.Scene {
  constructor() {
    super('FantasyScene');
  }

  create() {
    this.dialogActive = false;
    this.dialogQueue = [];
    this.dialogCallback = null;

    // --- Fantasy sky (purple/pink gradient via rectangles) ---
    this.add.rectangle(400, 50, 800, 100, 0x2E0854);
    this.add.rectangle(400, 130, 800, 80, 0x4B0082);
    this.add.rectangle(400, 200, 800, 80, 0x6A0DAD);
    this.add.rectangle(400, 260, 800, 60, 0x8B5CF6);
    this.add.rectangle(400, 310, 800, 60, 0xC084FC);

    // Floating magical islands in background
    this.add.ellipse(120, 180, 80, 20, 0x3A7D2C, 0.5);
    this.add.ellipse(650, 140, 100, 24, 0x3A7D2C, 0.4);
    this.add.ellipse(380, 120, 60, 16, 0x4E8C3F, 0.3);

    // Sparkly stars (bigger and more colorful than normal)
    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 250),
        Phaser.Math.Between(1, 3),
        [0xFFFFFF, 0xFFD700, 0xE0C0FF, 0x87CEEB][Phaser.Math.Between(0, 3)],
        Phaser.Math.FloatBetween(0.3, 0.9)
      );
      this.tweens.add({
        targets: star, alpha: 0.1,
        duration: Phaser.Math.Between(600, 1800),
        yoyo: true, repeat: -1
      });
    }

    // Two moons
    this.add.circle(650, 70, 25, 0xFFF8DC, 0.8);
    this.add.circle(648, 68, 22, 0xFFFAE0);
    this.add.circle(150, 100, 15, 0xC0A0FF, 0.6);

    // Fantasy ground — magical purple/green grass
    this.add.rectangle(400, FLOOR_Y + 5, 800, 30, 0x2D5A1E);
    this.add.rectangle(400, FLOOR_Y + 25, 800, 50, 0x1A3A10);
    // Magical grass blades
    for (let x = 10; x < 800; x += 8 + Math.random() * 6) {
      const gh = 4 + Math.random() * 8;
      const gc = [0x4CAF50, 0x66BB6A, 0x5EC4A0, 0x7DCEA0][Math.floor(Math.random() * 4)];
      this.add.rectangle(x, FLOOR_Y - gh / 2, 2, gh, gc, 0.8);
    }

    // Glowing mushrooms
    this.drawMushroom(80, FLOOR_Y, 0xFF69B4, 8);
    this.drawMushroom(200, FLOOR_Y, 0x87CEEB, 6);
    this.drawMushroom(520, FLOOR_Y, 0xDA70D6, 7);
    this.drawMushroom(700, FLOOR_Y, 0x5DADE2, 9);

    // Magical flowers
    for (let x = 30; x < 780; x += 60 + Math.random() * 80) {
      this.drawMagicFlower(x, FLOOR_Y);
    }

    // Fantasy trees (crystal/glowing)
    this.drawFantasyTree(50, FLOOR_Y);
    this.drawFantasyTree(750, FLOOR_Y);

    // Floor collision
    const floor = this.add.rectangle(400, FLOOR_Y + 4, 800, 8, 0x000000, 0);
    this.physics.add.existing(floor, true);

    // --- Dragon (initially off-screen right, will fly in) ---
    this.dragon = this.add.image(900, 280, 'dragon').setScale(1.5).setFlipX(true);
    this.dragonLabel = this.add.text(900, 140, '???', {
      fontSize: '14px', color: '#C0C0C0', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    // --- Dax ---
    this.dax = new Dax(this, 100, FLOOR_Y - 40);
    this.physics.add.collider(this.dax, floor);
    this.dax.body.setCollideWorldBounds(true);

    // --- Dialog system ---
    this.dialogBg = this.add.rectangle(400, 430, 760, 50, 0x000000, 0.8).setVisible(false);
    this.dialogText = this.add.text(400, 430, '', {
      fontSize: '16px', color: '#FFFFFF', fontFamily: 'Arial',
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

    // Floating particles (magical sparkles)
    this.sparkles = [];
    for (let i = 0; i < 15; i++) {
      const sp = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(200, FLOOR_Y),
        2, 0xFFD700, 0
      );
      this.sparkles.push(sp);
      this.tweens.add({
        targets: sp,
        y: sp.y - Phaser.Math.Between(30, 80),
        alpha: { from: 0, to: 0.7 },
        duration: Phaser.Math.Between(1500, 3000),
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    this.cameras.main.fadeIn(800, 255, 255, 255);

    // Start the encounter sequence
    this.time.delayedCall(1000, () => this.startEncounter());
  }

  drawMushroom(x, groundY, color, size) {
    // Stem
    this.add.rectangle(x, groundY - size / 2, 3, size, 0xE8E8E8);
    // Cap
    this.add.ellipse(x, groundY - size, size * 2, size, color, 0.8);
    // Glow
    this.add.circle(x, groundY - size, size + 2, color, 0.15);
    // Spots
    this.add.circle(x - 2, groundY - size - 1, 1.5, 0xFFFFFF, 0.6);
    this.add.circle(x + 3, groundY - size + 1, 1, 0xFFFFFF, 0.5);
  }

  drawMagicFlower(x, groundY) {
    const colors = [0xFF69B4, 0xFFD700, 0x87CEEB, 0xDA70D6, 0xFF6B8A];
    const color = colors[Math.floor(Math.random() * colors.length)];
    // Stem
    this.add.rectangle(x, groundY - 6, 1, 10, 0x4CAF50);
    // Petals
    for (let a = 0; a < 5; a++) {
      const angle = (a / 5) * Math.PI * 2;
      this.add.circle(
        x + Math.cos(angle) * 3,
        groundY - 12 + Math.sin(angle) * 3,
        2, color, 0.8
      );
    }
    // Center
    this.add.circle(x, groundY - 12, 1.5, 0xFFD700);
  }

  drawFantasyTree(x, groundY) {
    // Trunk — crystalline
    this.add.rectangle(x, groundY - 35, 10, 50, 0x6B4226).setStrokeStyle(1, 0x5C3A1E);
    // Foliage — glowing purple/teal
    this.add.circle(x, groundY - 65, 22, 0x6A0DAD, 0.6);
    this.add.circle(x - 10, groundY - 55, 16, 0x8B5CF6, 0.5);
    this.add.circle(x + 12, groundY - 58, 18, 0x5EC4A0, 0.4);
    this.add.circle(x, groundY - 75, 14, 0xC084FC, 0.3);
    // Sparkle on tree
    const treeSpark = this.add.circle(x + 5, groundY - 70, 2, 0xFFFFFF, 0);
    this.tweens.add({
      targets: treeSpark, alpha: 0.8,
      duration: 800, yoyo: true, repeat: -1
    });
  }

  startEncounter() {
    // Dax wakes up confused
    this.showDialogSequence([
      { speaker: 'Dax', text: 'Huh?! This... this isn\'t my house!' },
      { speaker: 'Dax', text: 'Where am I? Everything looks so... magical!' },
    ], () => {
      // Dragon flies in!
      this.time.delayedCall(300, () => {
        // Screen shake for dramatic entrance
        this.cameras.main.shake(300, 0.005);

        // Dragon swoops in
        this.tweens.add({
          targets: this.dragon,
          x: 550, y: 300,
          duration: 1200,
          ease: 'Back.easeOut'
        });
        this.tweens.add({
          targets: this.dragonLabel,
          x: 550, y: 170,
          duration: 1200,
          ease: 'Back.easeOut',
          onComplete: () => {
            // Dragon landing shake
            this.cameras.main.shake(200, 0.008);

            // Dragon breathing idle
            this.tweens.add({
              targets: this.dragon,
              y: this.dragon.y - 5, scaleX: 1.22, scaleY: 1.18,
              duration: 1200, yoyo: true, repeat: -1,
              ease: 'Sine.easeInOut'
            });

            this.time.delayedCall(500, () => this.dragonDialog());
          }
        });
      });
    });
  }

  dragonDialog() {
    this.showDialogSequence([
      { speaker: 'Dax', text: 'AHHHHH!! A DRAGON!!!' },
      { speaker: '???', text: 'HALT! Who goes there?!' },
      { speaker: 'Dax', text: '*trembling* P-p-please don\'t eat me!' },
      { speaker: '???', text: 'Wait... Are you... a KNIGHT?!' },
      { speaker: 'Dax', text: 'A knight?! I\'m just a cat! A very scared cat!' },
      { speaker: '???', text: 'You look brave to me! And I REALLY need a brave knight right now...' },
      { speaker: 'Dax', text: 'Brave?! I was just sleeping after dinner!' },
    ], () => {
      this.dragonLabel.setText('Silver');
      this.time.delayedCall(300, () => this.dragonDialog2());
    });
  }

  dragonDialog2() {
    this.showDialogSequence([
      { speaker: 'Silver', text: 'My name is Silver. I\'m on an important quest!' },
      { speaker: 'Dax', text: 'A quest? What kind of quest?' },
      { speaker: 'Silver', text: 'The Queen of the Fairies sent for me. Something terrible has happened!' },
      { speaker: 'Dax', text: 'The Queen of the... Fairies?!' },
      { speaker: 'Silver', text: 'Yes! There\'s a BIG meeting at the Crystal Palace. All the kingdoms are gathering!' },
      { speaker: 'Dax', text: 'But I don\'t even know what the quest is!' },
      { speaker: 'Silver', text: 'Neither do I! That\'s why we need to see the Queen. She\'ll explain everything.' },
      { speaker: 'Silver', text: 'Please, Sir Knight! Will you come with me?' },
      { speaker: 'Dax', text: '...I\'m NOT a knight. But... okay. Let\'s go see this Queen.' },
      { speaker: 'Silver', text: 'WONDERFUL! Hop on my back, we\'ll fly there!' },
      { speaker: 'Dax', text: 'FLY?! Oh no no no no—' },
    ], () => {
      this.hideSkipButton();
      // Dax walks toward dragon
      this.dax.body.setVelocityX(100);
      this.dax.play('dax-walk');

      this.time.delayedCall(1500, () => {
        this.dax.body.setVelocityX(0);
        this.dax.play('dax-idle');

        // Dax hops onto Silver's back (small jump up to dragon's position)
        this.dax.body.setAllowGravity(false);
        this.tweens.add({
          targets: this.dax,
          x: this.dragon.x - 20,
          y: this.dragon.y - 60,
          scaleX: 0.7,
          scaleY: 0.7,
          duration: 600,
          ease: 'Quad.easeOut',
          onComplete: () => {
            // "Hold on tight!" text
            const flyText = this.add.text(400, 200, 'Hold on tight!', {
              fontSize: '28px', color: '#FFD700', fontFamily: 'Arial',
              stroke: '#2E0854', strokeThickness: 4
            }).setOrigin(0.5).setAlpha(0);

            this.tweens.add({ targets: flyText, alpha: 1, duration: 400 });

            // Silver spreads wings — small scale pulse
            this.tweens.add({
              targets: this.dragon,
              scaleX: 1.6, scaleY: 1.55,
              duration: 400,
              yoyo: true,
              ease: 'Sine.easeInOut'
            });

            // After a beat, smooth swooping takeoff
            this.time.delayedCall(800, () => {
              this.tweens.add({
                targets: flyText, scaleX: 1.1, scaleY: 1.1,
                duration: 600, yoyo: true, repeat: -1
              });

              // Swoop: dip down slightly, then arc upward and off-screen
              this.tweens.add({
                targets: [this.dragon, this.dax, this.dragonLabel],
                y: '+=20',
                duration: 300,
                ease: 'Sine.easeIn',
                onComplete: () => {
                  this.tweens.add({
                    targets: [this.dragon, this.dax, this.dragonLabel],
                    y: -200,
                    x: '+=150',
                    duration: 1800,
                    ease: 'Quad.easeIn'
                  });
                }
              });

              this.time.delayedCall(2500, () => {
                this.cameras.main.fadeOut(800, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                  this.scene.start('FlyingScene');
                });
              });
            });
          }
        });
      });
    });
  }

  // --- Dialog system (same as HouseScene) ---
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

  update() {
    if (!this.dialogActive) {
      this.dax.update();
    }
    if (this.dialogActive && Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.skipAllDialog();
    }
  }
}
