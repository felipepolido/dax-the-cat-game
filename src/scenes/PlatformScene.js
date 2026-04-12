import Phaser from 'phaser';
import Dax from '../sprites/Dax.js';

const WORLD_WIDTH = 3800;
const WORLD_HEIGHT = 450;
const GROUND_Y = 418;
const VILLAGE_END = 700;
const HOUSE_X = 350;

export default class PlatformScene extends Phaser.Scene {
  constructor() {
    super('PlatformScene');
  }

  create(data) {
    this.knockedCount = 0;
    this.returnMode = data?.returnFromFishing || false;

    // --- Parallax backgrounds ---
    this.bgSky = this.add.tileSprite(0, 0, 800, 450, 'bg-sky')
      .setOrigin(0, 0).setScrollFactor(0);
    this.bgHills = this.add.tileSprite(0, 0, 800, 450, 'bg-hills')
      .setOrigin(0, 0).setScrollFactor(0);
    this.bgTrees = this.add.tileSprite(0, 0, 800, 450, 'bg-trees')
      .setOrigin(0, 0).setScrollFactor(0);

    // --- Ground tiles ---
    this.groundGroup = this.physics.add.staticGroup();
    for (let x = 0; x < WORLD_WIDTH; x += 64) {
      const tile = this.add.image(x + 32, GROUND_Y + 16, 'ground-tile');
      this.physics.add.existing(tile, true);
      this.groundGroup.add(tile);
    }

    // --- Village area ---
    this.drawVillage();

    // --- Path area (after village) ---
    // Floating platforms
    const platforms = [
      { x: 1000, y: 340 },
      { x: 1300, y: 300 },
      { x: 1600, y: 350 },
      { x: 2000, y: 310 },
      { x: 2400, y: 340 },
      { x: 2800, y: 300 },
    ];
    platforms.forEach(p => {
      for (let i = -1; i <= 1; i++) {
        const tile = this.add.image(p.x + i * 64, p.y, 'ground-tile');
        this.physics.add.existing(tile, true);
        this.groundGroup.add(tile);
      }
    });

    // --- Knockable objects (only on first trip) ---
    this.knockableGroup = this.physics.add.group();
    if (!this.returnMode) {
      const knockablePlacements = [
        // Ground level
        { x: 850, y: GROUND_Y - 14, type: 'knockable-milk' },
        { x: 1150, y: GROUND_Y - 12, type: 'knockable-yarn' },
        { x: 1450, y: GROUND_Y - 14, type: 'knockable-vase' },
        { x: 1800, y: GROUND_Y - 14, type: 'knockable-mug' },
        { x: 2200, y: GROUND_Y - 18, type: 'knockable-books' },
        { x: 2600, y: GROUND_Y - 12, type: 'knockable-yarn' },
        { x: 2950, y: GROUND_Y - 14, type: 'knockable-vase' },
        // On platforms
        { x: 1000, y: 340 - 18, type: 'knockable-vase' },
        { x: 1310, y: 300 - 14, type: 'knockable-mug' },
        { x: 1600, y: 350 - 18, type: 'knockable-books' },
        { x: 2010, y: 310 - 16, type: 'knockable-milk' },
        { x: 2400, y: 340 - 14, type: 'knockable-mug' },
        { x: 2800, y: 300 - 18, type: 'knockable-books' },
      ];
      knockablePlacements.forEach(item => {
        const obj = this.physics.add.image(item.x, item.y, item.type);
        obj.body.setAllowGravity(false);
        obj.body.setImmovable(true);
        obj.knocked = false;
        this.knockableGroup.add(obj);
      });
    }


    // Swipe to knock
    this.events.on('dax-swipe', (dax) => {
      this.checkSwipeKnock(dax);
    });

    // --- Decorative elements (path area only) ---
    const flowerColors = [0xFF6B8A, 0xFFD700, 0xFF8C42, 0xDA70D6, 0x87CEEB];
    for (let x = VILLAGE_END + 50; x < WORLD_WIDTH - 400; x += 80 + Math.random() * 120) {
      const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      this.add.circle(x, GROUND_Y - 4, 4, color);
      this.add.circle(x, GROUND_Y - 2, 2, 0x4A8C2A);
    }

    // --- Trees along the path ---
    const treePosX = [780, 950, 1200, 1500, 1750, 2050, 2350, 2650, 2900, 3100];
    treePosX.forEach(tx => {
      this.drawTree(tx, GROUND_Y);
    });

    // River sign
    this.add.image(2100, GROUND_Y - 32, 'river-sign');

    // --- River ---
    this.drawRiver(WORLD_WIDTH - 500, GROUND_Y);

    // River trigger zone (only on first trip)
    if (!this.returnMode) {
      this.riverZone = this.add.rectangle(WORLD_WIDTH - 350, GROUND_Y - 40, 100, 80, 0x0000ff, 0);
      this.physics.add.existing(this.riverZone, true);
      this.add.text(WORLD_WIDTH - 380, GROUND_Y - 80, '🐟 Fish here!', {
        fontSize: '16px', color: '#FFD700', fontFamily: 'Arial',
        stroke: '#000000', strokeThickness: 2
      });
    }

    // House door trigger zone
    this.houseDoorZone = this.add.rectangle(HOUSE_X, GROUND_Y - 25, 30, 40, 0x000000, 0);
    this.physics.add.existing(this.houseDoorZone, true);

    // --- Dax ---
    const daxStartX = this.returnMode ? WORLD_WIDTH - 400 : HOUSE_X + 30;
    this.dax = new Dax(this, daxStartX, 350);
    if (this.returnMode) this.dax.setFlipX(true);
    this.physics.add.collider(this.dax, this.groundGroup);
    this.physics.add.collider(this.knockableGroup, this.groundGroup);

    // --- Tom follows Dax ---
    const tomStartX = this.returnMode ? WORLD_WIDTH - 350 : HOUSE_X + 80;
    this.tom = this.physics.add.image(tomStartX, GROUND_Y - 28, 'cat-brother').setScale(0.9);
    this.tom.body.setAllowGravity(false);
    this.tom.body.setImmovable(true);
    this.tom.body.setSize(36, 16);
    this.tom.body.setOffset(14, 2); // small hitbox at top of head only
    if (this.returnMode) this.tom.setFlipX(true);
    this.tomLabel = this.add.text(tomStartX, GROUND_Y - 55, 'Tom', {
      fontSize: '9px', color: '#FFFFFF', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);
    this.tomPositions = [];
    this.tomFollowDelay = 40;
    this.tomBounceCooldown = false;

    // Dax bounces off Tom's head — overlap so Tom doesn't block walking
    this.physics.add.overlap(this.dax, this.tom, (dax, tom) => {
      // Only bounce if Dax is falling and above Tom's head
      if (this.tomBounceCooldown) return;
      if (dax.body.velocity.y > 0 && dax.y + dax.body.height / 2 < tom.y - 5) {
        dax.body.setVelocityY(-480); // super jump!
        this.tomBounceCooldown = true;
        this.time.delayedCall(600, () => { this.tomBounceCooldown = false; });
        // Tom squish reaction
        this.tweens.add({
          targets: tom, scaleY: 0.6, scaleX: 1.1,
          duration: 100, yoyo: true,
          onComplete: () => { tom.setScale(0.9); }
        });
        // Fun text
        const words = ['Boing!', 'Wheee!', 'Up we go!', 'Tom: Hey!', 'Woohoo!'];
        const boingText = this.add.text(tom.x, tom.y - 40, words[Phaser.Math.Between(0, words.length - 1)], {
          fontSize: '14px', color: '#FFD700', fontFamily: 'Arial',
          stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);
        this.tweens.add({
          targets: boingText, y: boingText.y - 30, alpha: 0,
          duration: 800, onComplete: () => boingText.destroy()
        });
      }
    });

    // River trigger
    if (!this.returnMode && this.riverZone) {
      this.physics.add.overlap(this.dax, this.riverZone, () => {
        this.goFishing();
      }, null, this);
    }
    this.hasTriggeredFishing = false;

    // House door trigger
    this.physics.add.overlap(this.dax, this.houseDoorZone, () => {
      this.enterHouse();
    }, null, this);
    this.hasEnteredHouse = false;

    // --- Camera ---
    this.cameras.main.startFollow(this.dax, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // --- HUD ---
    const hudMsg = this.returnMode
      ? '← Walk home with the fish!'
      : 'Walk to the river! →  (SPACE to swipe things!)';
    this.hudText = this.add.text(400, 16, hudMsg, {
      fontSize: '16px', color: '#ffffff', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0);

    this.knockedText = this.add.text(400, 436, '', {
      fontSize: '13px', color: '#FFD700', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5).setScrollFactor(0);


    this.cameras.main.fadeIn(400);
  }

  // ======= VILLAGE =======
  drawVillage() {
    // Village path (lighter ground strip)
    this.add.rectangle(VILLAGE_END / 2, GROUND_Y - 2, VILLAGE_END, 6, 0xC4A46C, 0.5);

    // --- Neighbor house 1 (blue, left) ---
    this.drawNeighborHouse(100, GROUND_Y, 0x5B8DBE, 0x3A6B96, 0x6B4226, 'blue');

    // --- Dax's house (center, with label) ---
    this.drawDaxHouse(HOUSE_X, GROUND_Y);

    // --- Neighbor house 2 (green, right) ---
    this.drawNeighborHouse(580, GROUND_Y, 0x6AAF5C, 0x4E8C3F, 0x8B5E3C, 'green');

    // --- Village decorations ---

    // Lamp posts
    this.drawLampPost(50, GROUND_Y);
    this.drawLampPost(240, GROUND_Y);
    this.drawLampPost(470, GROUND_Y);
    this.drawLampPost(660, GROUND_Y);

    // Picket fence between houses
    this.drawFence(195, GROUND_Y, 70);
    this.drawFence(485, GROUND_Y, 60);

    // Mailboxes
    this.drawMailbox(155, GROUND_Y);
    this.drawMailbox(420, GROUND_Y);
    this.drawMailbox(630, GROUND_Y);

    // Flower beds in front of houses
    this.drawFlowerBed(80, GROUND_Y);
    this.drawFlowerBed(330, GROUND_Y);
    this.drawFlowerBed(560, GROUND_Y);

    // Village sign at the entrance/exit
    this.add.rectangle(VILLAGE_END - 10, GROUND_Y - 40, 4, 50, 0x6B4226);
    const signBg = this.add.rectangle(VILLAGE_END - 10, GROUND_Y - 60, 90, 28, 0xC49A3C);
    signBg.setStrokeStyle(2, 0x6B4226);
    this.add.text(VILLAGE_END - 10, GROUND_Y - 60, 'Catville', {
      fontSize: '12px', color: '#3C2415', fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // --- Neighbor cats (with speech bubbles) ---
    this.neighborCats = [];

    // Black cat sitting on porch of blue house
    const cat1 = this.add.image(120, GROUND_Y - 28, 'cat-neighbor1').setScale(0.8);
    this.tweens.add({
      targets: cat1, y: cat1.y - 2,
      duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
    this.neighborCats.push({
      sprite: cat1,
      lines: [
        'Good morning, Dax!',
        'Nice day for fishing!',
        'Watch out for the big ones!',
        'Say hi to the fish for me!',
      ],
      returnLines: [
        'Welcome back!',
        'Wow, you caught them all!',
        'Dinner smells great!',
      ],
      spoken: false,
      bubble: null,
    });

    // White cat standing in the street near green house
    const cat2 = this.add.image(530, GROUND_Y - 26, 'cat-neighbor2').setScale(0.75);
    cat2.setFlipX(true);
    this.time.addEvent({
      delay: 3000,
      callback: () => { if (!cat2.speechActive) cat2.setFlipX(!cat2.flipX); },
      loop: true
    });
    this.neighborCats.push({
      sprite: cat2,
      lines: [
        'Hey Dax! Off on an adventure?',
        'Don\'t knock over my stuff!',
        'I heard the fish are biting today!',
        'Be careful out there!',
      ],
      returnLines: [
        'You\'re back already?!',
        'That was fast!',
        'Did Tom help at all? Ha!',
      ],
      spoken: false,
      bubble: null,
    });
  }

  drawNeighborHouse(x, groundY, wallColor, roofColor, doorColor, style) {
    // House body
    const w = style === 'green' ? 90 : 80;
    const h = style === 'green' ? 65 : 55;
    const house = this.add.rectangle(x, groundY - h / 2 - 8, w, h, wallColor);
    house.setStrokeStyle(2, 0x3C2415);

    // Roof
    const roofW = w + 20;
    this.add.triangle(x, groundY - h - 15, 0, 18, roofW / 2, -12, roofW, 18, roofColor);
    this.add.triangle(x, groundY - h - 15, 0, 18, roofW / 2, -12, roofW, 18)
      .setStrokeStyle(2, 0x3C2415);

    // Door
    this.add.rectangle(x - 8, groundY - 16, 16, 26, doorColor);
    this.add.circle(x - 2, groundY - 16, 2, 0xFFD700);

    // Windows
    const winOffsetX = style === 'green' ? 20 : 18;
    this.add.rectangle(x + winOffsetX, groundY - 35, 14, 14, 0x87CEEB)
      .setStrokeStyle(2, 0x3C2415);
    this.add.rectangle(x + winOffsetX, groundY - 35, 1, 14, 0x3C2415);
    this.add.rectangle(x + winOffsetX, groundY - 35, 14, 1, 0x3C2415);

    if (style === 'green') {
      // Second window
      this.add.rectangle(x - 25, groundY - 35, 14, 14, 0x87CEEB)
        .setStrokeStyle(2, 0x3C2415);
      this.add.rectangle(x - 25, groundY - 35, 1, 14, 0x3C2415);

      // Chimney
      this.add.rectangle(x + 25, groundY - h - 22, 10, 18, 0x8B5E3C)
        .setStrokeStyle(1, 0x3C2415);
    }

    // Porch/step
    this.add.rectangle(x - 8, groundY - 3, 24, 4, 0xA0784C).setStrokeStyle(1, 0x6B4226);
  }

  drawDaxHouse(x, groundY) {
    // House body
    const house = this.add.rectangle(x, groundY - 40, 80, 60, 0xD4883C);
    house.setStrokeStyle(2, 0x6B4226);

    // Window trim detail on house body
    this.add.rectangle(x - 22, groundY - 40, 16, 16, 0x87CEEB);
    this.add.rectangle(x - 22, groundY - 40, 16, 16).setStrokeStyle(2, 0x6B4226);
    this.add.rectangle(x - 22, groundY - 40, 1, 16, 0x6B4226);

    // Roof
    const roof = this.add.triangle(x, groundY - 80, 0, 20, 50, -15, 100, 20, 0xCC3333);
    roof.setStrokeStyle(2, 0x8B0000);
    // Chimney
    this.add.rectangle(x + 25, groundY - 82, 10, 18, 0x8B5E3C).setStrokeStyle(1, 0x5C3A1E);

    // Door
    this.add.rectangle(x, groundY - 18, 18, 30, 0x6B4226);
    this.add.circle(x + 6, groundY - 18, 2, 0xFFD700);
    // Door frame
    this.add.rectangle(x, groundY - 34, 20, 2, 0x5C3A1E);

    // Right window
    this.add.rectangle(x + 22, groundY - 40, 16, 16, 0x87CEEB);
    this.add.rectangle(x + 22, groundY - 40, 16, 16).setStrokeStyle(2, 0x6B4226);
    this.add.rectangle(x + 22, groundY - 40, 1, 16, 0x6B4226);
    this.add.rectangle(x + 22, groundY - 40, 16, 1, 0x6B4226);

    // Porch step
    this.add.rectangle(x, groundY - 3, 28, 5, 0xA0784C).setStrokeStyle(1, 0x6B4226);

    // Welcome mat
    this.add.rectangle(x, groundY - 1, 20, 3, 0x8B5E3C, 0.6);

    // Label
    this.add.text(x, groundY - 92, "Dax's House", {
      fontSize: '11px', color: '#ffffff', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);

    if (this.returnMode) {
      const enterText = this.add.text(x, groundY - 108, 'Go inside!', {
        fontSize: '14px', color: '#FFD700', fontFamily: 'Arial',
        stroke: '#000000', strokeThickness: 2
      }).setOrigin(0.5);
      this.tweens.add({
        targets: enterText, y: enterText.y - 5,
        duration: 600, yoyo: true, repeat: -1
      });
    }
  }

  drawLampPost(x, groundY) {
    // Post
    this.add.rectangle(x, groundY - 30, 3, 40, 0x555555);
    // Lamp head
    this.add.rectangle(x, groundY - 52, 10, 6, 0x555555);
    // Light glow
    this.add.circle(x, groundY - 52, 5, 0xFFE88C, 0.4);
  }

  drawFence(x, groundY, width) {
    // Rail
    this.add.rectangle(x, groundY - 12, width, 3, 0xD4C4A0).setStrokeStyle(1, 0xB8A888);
    // Pickets
    for (let px = x - width / 2 + 5; px < x + width / 2; px += 10) {
      this.add.rectangle(px, groundY - 10, 3, 18, 0xD4C4A0).setStrokeStyle(0.5, 0xB8A888);
    }
  }

  drawMailbox(x, groundY) {
    this.add.rectangle(x, groundY - 18, 3, 22, 0x6B4226);
    this.add.rectangle(x, groundY - 30, 12, 10, 0x4A90D9).setStrokeStyle(1, 0x3A70B0);
    // Flag
    this.add.rectangle(x + 7, groundY - 32, 3, 6, 0xCC3333);
  }

  drawFlowerBed(x, groundY) {
    const colors = [0xFF6B8A, 0xFFD700, 0xDA70D6, 0xFF8C42];
    for (let i = 0; i < 5; i++) {
      const fx = x - 15 + i * 8;
      const color = colors[i % colors.length];
      this.add.circle(fx, groundY - 6, 3, color);
      this.add.rectangle(fx, groundY - 3, 1, 5, 0x4A8C2A);
    }
  }

  drawTree(x, groundY) {
    // Trunk
    this.add.rectangle(x, groundY - 30, 10, 40, 0x6B4226).setStrokeStyle(1, 0x5C3A1E);
    // Foliage layers (overlapping circles for fullness)
    this.add.circle(x, groundY - 58, 22, 0x3A8C2A);
    this.add.circle(x - 12, groundY - 50, 16, 0x4A9C3A);
    this.add.circle(x + 14, groundY - 52, 18, 0x2D7A1E);
    this.add.circle(x, groundY - 68, 14, 0x5AAF4A, 0.8);
    // Highlight
    this.add.circle(x - 5, groundY - 62, 4, 0x8FD47A, 0.5);
  }

  // ======= RIVER =======
  drawRiver(startX, groundY) {
    const riverWidth = 500;
    this.add.rectangle(startX + riverWidth / 2, groundY + 5, riverWidth, 40, 0x2E86C1, 0.8);
    for (let i = 0; i < 8; i++) {
      const lx = startX + 30 + i * 58;
      this.add.rectangle(lx, groundY - 2, 30, 3, 0x5DADE2, 0.6);
    }
    this.add.rectangle(startX - 10, groundY, 20, 32, 0x5C4410);
    this.add.rectangle(startX + riverWidth + 10, groundY, 20, 32, 0x5C4410);
    this.add.circle(startX - 25, groundY - 4, 6, 0x808080);
    this.add.circle(startX - 15, groundY - 2, 4, 0x909090);
    this.add.circle(startX + 20, groundY - 3, 5, 0x787878);
  }

  // ======= INTERACTIONS =======
  checkSwipeKnock(dax) {
    const dirX = dax.flipX ? -1 : 1;
    const swipeX = dax.x + dirX * 28;
    const swipeY = dax.y - 8;
    const swipeBounds = new Phaser.Geom.Rectangle(swipeX - 24, swipeY - 22, 48, 44);
    this.knockableGroup.getChildren().forEach(obj => {
      if (obj.knocked) return;
      if (Phaser.Geom.Rectangle.Overlaps(swipeBounds, obj.getBounds())) {
        this.knockObject(obj, dirX);
      }
    });
  }

  knockObject(obj, dirX) {
    if (obj.knocked) return;
    obj.knocked = true;
    obj.body.setImmovable(false);
    obj.body.setAllowGravity(true);
    obj.body.setVelocity(dirX * Phaser.Math.Between(100, 200), Phaser.Math.Between(-180, -80));
    obj.body.setAngularVelocity(Phaser.Math.Between(-400, 400));
    obj.body.setBounce(0.3);
    this.knockedCount++;
    const faces = ['😸', '😹', '😼', '🐾'];
    this.knockedText.setText(`Knocked over: ${this.knockedCount} ${faces[Phaser.Math.Between(0, 3)]}`);
    const words = ['Whack!', 'Crash!', 'Bonk!', 'Smash!', 'Oops!', 'Hehe!'];
    const floatText = this.add.text(obj.x, obj.y - 20, words[Phaser.Math.Between(0, 5)], {
      fontSize: '16px', color: '#FF6B8A', fontFamily: 'Arial',
      stroke: '#000000', strokeThickness: 2
    }).setOrigin(0.5);
    this.tweens.add({ targets: floatText, y: floatText.y - 30, alpha: 0, duration: 700, onComplete: () => floatText.destroy() });
    this.cameras.main.shake(60, 0.003);
    this.time.delayedCall(2500, () => {
      if (obj?.active) this.tweens.add({ targets: obj, alpha: 0, duration: 500, onComplete: () => obj.destroy() });
    });
  }

  goFishing() {
    if (this.hasTriggeredFishing) return;
    this.hasTriggeredFishing = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('FishingScene'));
  }

  enterHouse() {
    if (this.hasEnteredHouse || !this.returnMode) return;
    this.hasEnteredHouse = true;
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('HouseScene', { postFishing: true }));
  }

  showCatSpeech(catData) {
    if (catData.spoken) return;
    catData.spoken = true;
    catData.sprite.speechActive = true;

    const lines = this.returnMode ? catData.returnLines : catData.lines;
    const line = lines[Phaser.Math.Between(0, lines.length - 1)];
    const cat = catData.sprite;

    // Face Dax
    cat.setFlipX(this.dax.x < cat.x);

    // Measure text first
    const measureText = this.add.text(0, 0, line, {
      fontSize: '11px', fontFamily: 'Arial',
    }).setVisible(false);
    const textW = measureText.width + 14;
    const textH = 22;
    measureText.destroy();

    // Speech bubble bg (appears instantly at correct size)
    const bubbleY = cat.y - 48;
    const bubbleBg = this.add.rectangle(cat.x, bubbleY, textW, textH, 0xFFFFFF, 0.92)
      .setStrokeStyle(1.5, 0x555555).setAlpha(0);

    // Speech text
    const bubbleText = this.add.text(cat.x, bubbleY, line, {
      fontSize: '11px', color: '#333333', fontFamily: 'Arial',
    }).setOrigin(0.5).setAlpha(0);

    // Little triangle pointer
    const pointer = this.add.triangle(cat.x, bubbleY + textH / 2 + 5, 0, 0, 8, 0, 4, 6, 0xFFFFFF)
      .setStrokeStyle(1, 0x555555).setAlpha(0);

    // Pop in
    this.tweens.add({
      targets: [bubbleBg, bubbleText, pointer], alpha: 1,
      duration: 200, ease: 'Sine.easeOut'
    });

    // Remove after a while
    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: [bubbleBg, bubbleText, pointer], alpha: 0,
        duration: 400, onComplete: () => {
          bubbleBg.destroy(); bubbleText.destroy(); pointer.destroy();
          catData.sprite.speechActive = false;
        }
      });
    });
  }

  update() {
    this.dax.update();

    // Tom follows Dax
    this.tomPositions.push({ x: this.dax.x, flipX: this.dax.flipX });
    if (this.tomPositions.length > this.tomFollowDelay) {
      const delayed = this.tomPositions.shift();
      this.tom.x += (delayed.x - this.tom.x) * 0.08;
      this.tom.y = GROUND_Y - 28;
      this.tom.setFlipX(delayed.flipX);
      this.tomLabel.x = this.tom.x;
      this.tomLabel.y = this.tom.y - 27;
    }

    // Check neighbor cat proximity for speech bubbles
    if (this.neighborCats) {
      this.neighborCats.forEach(catData => {
        const dist = Math.abs(this.dax.x - catData.sprite.x);
        if (dist < 80 && !catData.spoken) {
          this.showCatSpeech(catData);
        }
      });
    }

    const camX = this.cameras.main.scrollX;
    this.bgHills.tilePositionX = camX * 0.15;
    this.bgTrees.tilePositionX = camX * 0.4;
  }
}
