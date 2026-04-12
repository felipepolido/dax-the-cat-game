import Phaser from 'phaser';

export default class DreamTransitionScene extends Phaser.Scene {
  constructor() {
    super('DreamTransitionScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#0A0A1E');

    // Dreamy swirling stars
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 450),
        Phaser.Math.Between(1, 3),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.2, 0.8)
      );
      this.stars.push(star);
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0.05 },
        x: star.x + Phaser.Math.Between(-40, 40),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    }

    // Dreamy purple/blue swirl effect
    for (let i = 0; i < 8; i++) {
      const swirl = this.add.circle(
        400 + Math.cos(i * 0.8) * 150,
        225 + Math.sin(i * 0.8) * 100,
        Phaser.Math.Between(30, 60),
        [0x4B0082, 0x6A0DAD, 0x1A1A6E, 0x2E0854][i % 4],
        0.15
      );
      this.tweens.add({
        targets: swirl,
        x: swirl.x + Phaser.Math.Between(-60, 60),
        y: swirl.y + Phaser.Math.Between(-40, 40),
        scaleX: 1.3, scaleY: 1.3,
        alpha: 0.05,
        duration: 3000 + i * 300,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    }

    // Sleeping Dax floating in dream space
    const dax = this.add.sprite(400, 260, 'dax', 0).setScale(1.5).setAlpha(0);
    this.tweens.add({
      targets: dax, alpha: 1, duration: 1000,
    });
    this.tweens.add({
      targets: dax, y: 250, duration: 1500,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    // Zzz floating
    const zzz = this.add.text(440, 230, 'Zzz...', {
      fontSize: '20px', color: '#9999DD', fontFamily: 'Arial',
      stroke: '#000033', strokeThickness: 1
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({
      targets: zzz, alpha: 0.8, y: 210,
      duration: 1000, delay: 500, yoyo: true, repeat: -1
    });

    // Phase 1: "Dax is dreaming..." text
    const dreamText = this.add.text(400, 100, '', {
      fontSize: '28px', color: '#C0A0FF', fontFamily: 'Arial',
      stroke: '#1A0A3E', strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);

    this.time.delayedCall(800, () => {
      this.tweens.add({ targets: dreamText, alpha: 1, duration: 800 });
      this.typeText(dreamText, 'Dax is dreaming...', 60);
    });

    // Phase 2: After a pause, transition text
    this.time.delayedCall(3500, () => {
      this.tweens.add({ targets: dreamText, alpha: 0, duration: 500 });
      this.tweens.add({ targets: dax, alpha: 0, duration: 500 });
      this.tweens.add({ targets: zzz, alpha: 0, duration: 500 });
    });

    this.time.delayedCall(4500, () => {
      const wakeText = this.add.text(400, 180, '', {
        fontSize: '22px', color: '#FFD700', fontFamily: 'Arial',
        stroke: '#1A0A3E', strokeThickness: 3
      }).setOrigin(0.5);
      this.typeText(wakeText, 'Huh? Where am I...?', 50);

      const subtitle = this.add.text(400, 280, '', {
        fontSize: '32px', color: '#E0C0FF', fontFamily: 'Arial',
        stroke: '#2E0854', strokeThickness: 4
      }).setOrigin(0.5).setAlpha(0);

      this.time.delayedCall(1800, () => {
        this.tweens.add({ targets: wakeText, alpha: 0, duration: 400 });
        subtitle.setAlpha(1);
        this.typeText(subtitle, 'Kingdom of Fantasy', 80);

        this.tweens.add({
          targets: subtitle, scaleX: 1.05, scaleY: 1.05,
          duration: 800, yoyo: true, repeat: -1
        });
      });

      // Transition to FantasyScene
      this.time.delayedCall(5000, () => {
        this.cameras.main.fadeOut(1000, 255, 255, 255);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('FantasyScene');
        });
      });
    });

    // Allow skip with ESC
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.skipBg = this.add.rectangle(750, 20, 70, 24, 0x000000, 0.5).setStrokeStyle(1, 0xAAAAAA);
    this.skipBg.setInteractive({ useHandCursor: true });
    this.skipTextObj = this.add.text(750, 20, 'Skip \u25B6', {
      fontSize: '12px', color: '#CCCCCC', fontFamily: 'Arial'
    }).setOrigin(0.5);
    this.skipBg.on('pointerdown', () => this.skipToFantasy());

    this.cameras.main.fadeIn(1000);
  }

  typeText(textObj, fullString, charDelay) {
    let i = 0;
    this.time.addEvent({
      delay: charDelay,
      callback: () => {
        i++;
        textObj.setText(fullString.substring(0, i));
      },
      repeat: fullString.length - 1
    });
  }

  skipToFantasy() {
    this.cameras.main.fadeOut(500, 255, 255, 255);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('FantasyScene');
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.skipToFantasy();
    }
  }
}
