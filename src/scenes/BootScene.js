import Phaser from 'phaser';
import { createAnimations } from '../helpers/AnimationFactory.js';

const FRAME_W = 64;
const FRAME_H = 64;
const COLORS = {
  body: '#F0B860',
  bodyDark: '#D4883C',
  stripe: '#C47A30',
  outline: '#3C2415',
  cheek: '#F08080',
  earInner: '#E8967A',
  nose: '#3C2415',
  mouth: '#3C2415',
  eye: '#3C2415',
  white: '#FFFFFF',
  paw: '#F5D08A'
};

function drawCatFrame(ctx, frameIndex, offsetX) {
  const cx = offsetX + FRAME_W / 2;
  const baseY = FRAME_H - 6;

  let bodyBob = 0, legOffset = 0, tailAngle = 0, armRaise = 0, earWiggle = 0, squish = 0;

  switch (frameIndex) {
    case 0: bodyBob = 0; tailAngle = 0.15; break;
    case 1: bodyBob = -1; tailAngle = -0.15; earWiggle = 1; break;
    case 2: legOffset = 3; bodyBob = -1; tailAngle = 0.3; break;
    case 3: legOffset = -3; bodyBob = -2; tailAngle = -0.3; break;
    case 4: bodyBob = -4; squish = -2; tailAngle = -0.5; break;
    case 5: armRaise = 1; tailAngle = 0.4; bodyBob = -1; break;
  }

  const by = baseY + bodyBob;
  ctx.save();

  // Tail
  ctx.save();
  ctx.translate(cx + 14, by - 18);
  ctx.rotate(tailAngle);
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.outline;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(12, -16, 8, -26);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.strokeStyle = COLORS.bodyDark;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(11, -15, 7, -25);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.stripe;
  ctx.beginPath();
  ctx.moveTo(4, -8); ctx.lineTo(8, -10);
  ctx.moveTo(6, -16); ctx.lineTo(10, -18);
  ctx.stroke();
  ctx.restore();

  // Body
  ctx.fillStyle = COLORS.body;
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, by - 18 + squish, 16, 18 - squish, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Body stripes
  ctx.strokeStyle = COLORS.stripe;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 5, by - 28); ctx.lineTo(cx - 3, by - 22);
  ctx.moveTo(cx + 1, by - 30); ctx.lineTo(cx + 1, by - 23);
  ctx.moveTo(cx + 6, by - 28); ctx.lineTo(cx + 4, by - 22);
  ctx.stroke();

  // Legs
  ctx.fillStyle = COLORS.body;
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx - 9, by - 3 + legOffset * 0.3, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + 9, by - 3 - legOffset * 0.3, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Paws
  ctx.fillStyle = COLORS.paw;
  if (armRaise) {
    ctx.beginPath();
    ctx.ellipse(cx - 8, by - 2, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = COLORS.body;
    ctx.beginPath();
    ctx.moveTo(cx + 6, by - 18); ctx.lineTo(cx + 20, by - 32);
    ctx.lineTo(cx + 18, by - 28); ctx.lineTo(cx + 6, by - 14);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = COLORS.outline;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + 19, by - 32); ctx.lineTo(cx + 23, by - 38);
    ctx.moveTo(cx + 20, by - 31); ctx.lineTo(cx + 25, by - 35);
    ctx.moveTo(cx + 21, by - 30); ctx.lineTo(cx + 26, by - 33);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.ellipse(cx - 8 + legOffset, by - 2, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + 8 - legOffset, by - 2, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }

  // Head
  const headY = by - 38 + squish;
  ctx.fillStyle = COLORS.body;
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, headY, 14, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Ears
  ctx.fillStyle = COLORS.body;
  ctx.beginPath();
  ctx.moveTo(cx - 12, headY - 8); ctx.lineTo(cx - 16 - earWiggle, headY - 22); ctx.lineTo(cx - 4, headY - 12);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = COLORS.earInner;
  ctx.beginPath();
  ctx.moveTo(cx - 11, headY - 10); ctx.lineTo(cx - 14 - earWiggle, headY - 19); ctx.lineTo(cx - 6, headY - 12);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = COLORS.body;
  ctx.beginPath();
  ctx.moveTo(cx + 12, headY - 8); ctx.lineTo(cx + 16 + earWiggle, headY - 22); ctx.lineTo(cx + 4, headY - 12);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = COLORS.earInner;
  ctx.beginPath();
  ctx.moveTo(cx + 11, headY - 10); ctx.lineTo(cx + 14 + earWiggle, headY - 19); ctx.lineTo(cx + 6, headY - 12);
  ctx.closePath(); ctx.fill();

  // Head stripes
  ctx.strokeStyle = COLORS.stripe;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 3, headY - 13); ctx.lineTo(cx - 5, headY - 8);
  ctx.moveTo(cx, headY - 14); ctx.lineTo(cx, headY - 8);
  ctx.moveTo(cx + 3, headY - 13); ctx.lineTo(cx + 5, headY - 8);
  ctx.stroke();

  // Eyes
  ctx.strokeStyle = COLORS.eye;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx - 5, headY - 1, 3, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + 5, headY - 1, 3, Math.PI, 0); ctx.stroke();

  // Cheeks
  ctx.fillStyle = COLORS.cheek;
  ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.ellipse(cx - 10, headY + 3, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 10, headY + 3, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Nose
  ctx.fillStyle = COLORS.nose;
  ctx.beginPath();
  ctx.moveTo(cx, headY + 2); ctx.lineTo(cx - 2, headY + 4); ctx.lineTo(cx + 2, headY + 4);
  ctx.closePath(); ctx.fill();

  // Mouth
  ctx.strokeStyle = COLORS.mouth;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, headY + 4); ctx.lineTo(cx - 3, headY + 7);
  ctx.moveTo(cx, headY + 4); ctx.lineTo(cx + 3, headY + 7);
  ctx.stroke();

  // Whiskers
  ctx.strokeStyle = COLORS.outline;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - 8, headY + 2); ctx.lineTo(cx - 20, headY - 1);
  ctx.moveTo(cx - 8, headY + 4); ctx.lineTo(cx - 20, headY + 4);
  ctx.moveTo(cx - 8, headY + 6); ctx.lineTo(cx - 19, headY + 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 8, headY + 2); ctx.lineTo(cx + 20, headY - 1);
  ctx.moveTo(cx + 8, headY + 4); ctx.lineTo(cx + 20, headY + 4);
  ctx.moveTo(cx + 8, headY + 6); ctx.lineTo(cx + 19, headY + 8);
  ctx.stroke();

  ctx.restore();
}

// --- Background texture generators ---

function generateSkyTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 450);
  gradient.addColorStop(0, '#4A90D9');
  gradient.addColorStop(0.5, '#87CEEB');
  gradient.addColorStop(1, '#B8E4F0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 450);

  // Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  drawCloud(ctx, 120, 60, 50);
  drawCloud(ctx, 350, 90, 40);
  drawCloud(ctx, 600, 45, 55);
  drawCloud(ctx, 750, 100, 35);
  return canvas;
}

function drawCloud(ctx, x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
  ctx.arc(x + size * 0.4, y - size * 0.15, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.8, y, size * 0.45, 0, Math.PI * 2);
  ctx.arc(x + size * 0.35, y + size * 0.1, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

function generateHillsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 800, 450);

  // Far hills — soft green
  ctx.fillStyle = '#6AAF5C';
  ctx.beginPath();
  ctx.moveTo(0, 450);
  ctx.lineTo(0, 320);
  ctx.quadraticCurveTo(100, 260, 200, 300);
  ctx.quadraticCurveTo(300, 250, 400, 280);
  ctx.quadraticCurveTo(500, 230, 600, 270);
  ctx.quadraticCurveTo(700, 240, 800, 290);
  ctx.lineTo(800, 450);
  ctx.closePath();
  ctx.fill();

  // Near hills — darker green
  ctx.fillStyle = '#4E8C3F';
  ctx.beginPath();
  ctx.moveTo(0, 450);
  ctx.lineTo(0, 350);
  ctx.quadraticCurveTo(150, 310, 250, 340);
  ctx.quadraticCurveTo(400, 290, 500, 330);
  ctx.quadraticCurveTo(650, 300, 800, 340);
  ctx.lineTo(800, 450);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

function generateTreesTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 450;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 800, 450);

  const treePositions = [80, 200, 340, 500, 650, 760];
  treePositions.forEach((x, i) => {
    const h = 60 + (i % 3) * 20;
    const trunkW = 8;
    const baseY = 380;

    // Trunk
    ctx.fillStyle = '#6B4226';
    ctx.fillRect(x - trunkW / 2, baseY - h, trunkW, h * 0.5);

    // Foliage layers
    ctx.fillStyle = '#3A7D2C';
    ctx.beginPath();
    ctx.moveTo(x, baseY - h - 10);
    ctx.lineTo(x - 25, baseY - h * 0.5);
    ctx.lineTo(x + 25, baseY - h * 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#45912F';
    ctx.beginPath();
    ctx.moveTo(x, baseY - h + 5);
    ctx.lineTo(x - 20, baseY - h * 0.4);
    ctx.lineTo(x + 20, baseY - h * 0.4);
    ctx.closePath();
    ctx.fill();
  });

  return canvas;
}

function generateGroundTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  // Dirt
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(0, 0, 64, 32);

  // Grass top
  ctx.fillStyle = '#4A8C2A';
  ctx.fillRect(0, 0, 64, 10);

  // Grass blades
  ctx.fillStyle = '#5CA63C';
  for (let x = 2; x < 64; x += 6 + Math.floor(Math.random() * 4)) {
    const bladeH = 4 + Math.floor(Math.random() * 6);
    ctx.fillRect(x, 10 - bladeH, 2, bladeH);
  }

  // Dirt texture dots
  ctx.fillStyle = '#7A5C10';
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(
      Math.floor(Math.random() * 60) + 2,
      12 + Math.floor(Math.random() * 18),
      2, 2
    );
  }

  return canvas;
}

function generateFishTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;  // 2 frames: 32x16 each
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  for (let frame = 0; frame < 2; frame++) {
    const ox = frame * 32;
    const cy = 8;

    // Body
    ctx.fillStyle = '#FF6B35';
    ctx.strokeStyle = '#CC4400';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(ox + 14, cy, 11, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.fillStyle = '#FF8C55';
    const tailFlip = frame === 0 ? -3 : 3;
    ctx.beginPath();
    ctx.moveTo(ox + 25, cy);
    ctx.lineTo(ox + 31, cy - 5 + tailFlip);
    ctx.lineTo(ox + 31, cy + 5 + tailFlip);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(ox + 7, cy - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(ox + 6.5, cy - 1, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Belly stripe
    ctx.fillStyle = '#FFB88C';
    ctx.beginPath();
    ctx.ellipse(ox + 12, cy + 2, 8, 2.5, 0, 0, Math.PI);
    ctx.fill();

    // Fin
    ctx.fillStyle = '#FF8C55';
    ctx.beginPath();
    ctx.moveTo(ox + 14, cy - 5);
    ctx.lineTo(ox + 17, cy - 9 + (frame * 2));
    ctx.lineTo(ox + 20, cy - 4);
    ctx.closePath();
    ctx.fill();
  }

  return canvas;
}

function generateKnockableTextures() {
  const textures = {};

  // Vase
  const vaseCanvas = document.createElement('canvas');
  vaseCanvas.width = 20;
  vaseCanvas.height = 28;
  let ctx = vaseCanvas.getContext('2d');
  // Vase body
  ctx.fillStyle = '#C44D56';
  ctx.beginPath();
  ctx.moveTo(6, 4);
  ctx.quadraticCurveTo(0, 14, 3, 24);
  ctx.lineTo(17, 24);
  ctx.quadraticCurveTo(20, 14, 14, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8B2030';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Vase rim
  ctx.fillStyle = '#D46070';
  ctx.fillRect(5, 2, 10, 4);
  ctx.strokeRect(5, 2, 10, 4);
  // Flower
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(10, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FF69B4';
  for (let a = 0; a < 5; a++) {
    const angle = (a / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(10 + Math.cos(angle) * 4, 0 + Math.sin(angle) * 4, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  textures.vase = vaseCanvas;

  // Milk bottle
  const milkCanvas = document.createElement('canvas');
  milkCanvas.width = 14;
  milkCanvas.height = 26;
  ctx = milkCanvas.getContext('2d');
  ctx.fillStyle = '#E8E8E8';
  ctx.strokeStyle = '#AAAAAA';
  ctx.lineWidth = 1;
  // Body
  ctx.fillRect(2, 8, 10, 16);
  ctx.strokeRect(2, 8, 10, 16);
  // Neck
  ctx.fillRect(4, 2, 6, 8);
  ctx.strokeRect(4, 2, 6, 8);
  // Cap
  ctx.fillStyle = '#4A90D9';
  ctx.fillRect(3, 0, 8, 4);
  // Milk level
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(3, 12, 8, 11);
  textures.milk = milkCanvas;

  // Yarn ball
  const yarnCanvas = document.createElement('canvas');
  yarnCanvas.width = 20;
  yarnCanvas.height = 20;
  ctx = yarnCanvas.getContext('2d');
  ctx.fillStyle = '#DA70D6';
  ctx.beginPath();
  ctx.arc(10, 10, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#9932CC';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Yarn lines
  ctx.strokeStyle = '#C050C0';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(10, 10, 5, 0.5, 2.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(10, 10, 3, 3, 5.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(8, 8, 6, 1, 2);
  ctx.stroke();
  // Trailing string
  ctx.strokeStyle = '#DA70D6';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, 14);
  ctx.quadraticCurveTo(20, 18, 18, 20);
  ctx.stroke();
  textures.yarn = yarnCanvas;

  // Stack of books
  const bookCanvas = document.createElement('canvas');
  bookCanvas.width = 24;
  bookCanvas.height = 20;
  ctx = bookCanvas.getContext('2d');
  const bookColors = ['#D44040', '#4A90D9', '#4CAF50'];
  bookColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(1, 2 + i * 6, 22, 5);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(1, 2 + i * 6, 22, 5);
    // Spine line
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.moveTo(3, 3 + i * 6);
    ctx.lineTo(3, 6 + i * 6);
    ctx.stroke();
  });
  textures.books = bookCanvas;

  // Mug
  const mugCanvas = document.createElement('canvas');
  mugCanvas.width = 20;
  mugCanvas.height = 18;
  ctx = mugCanvas.getContext('2d');
  ctx.fillStyle = '#E8C44A';
  ctx.strokeStyle = '#B8942A';
  ctx.lineWidth = 1;
  ctx.fillRect(2, 4, 12, 13);
  ctx.strokeRect(2, 4, 12, 13);
  // Handle
  ctx.beginPath();
  ctx.arc(15, 10, 4, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Steam
  ctx.strokeStyle = 'rgba(200,200,200,0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(5, 3); ctx.quadraticCurveTo(4, 0, 6, -1);
  ctx.moveTo(9, 3); ctx.quadraticCurveTo(8, -1, 10, -2);
  ctx.stroke();
  textures.mug = mugCanvas;

  return textures;
}

function generateNpcCat(bodyColor, stripeColor, earColor, accessory) {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');
  const cx = 24;
  const by = 50;

  // Tail
  ctx.strokeStyle = stripeColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx + 12, by - 16);
  ctx.quadraticCurveTo(cx + 22, by - 28, cx + 18, by - 36);
  ctx.stroke();

  // Body
  ctx.fillStyle = bodyColor;
  ctx.strokeStyle = '#3C2415';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, by - 16, 14, 16, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.ellipse(cx - 8, by - 2, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + 8, by - 2, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Head
  const headY = by - 34;
  ctx.beginPath();
  ctx.arc(cx, headY, 12, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.moveTo(cx - 10, headY - 7);
  ctx.lineTo(cx - 14, headY - 19);
  ctx.lineTo(cx - 3, headY - 10);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = earColor;
  ctx.beginPath();
  ctx.moveTo(cx - 9, headY - 9);
  ctx.lineTo(cx - 12, headY - 17);
  ctx.lineTo(cx - 5, headY - 10);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(cx + 10, headY - 7);
  ctx.lineTo(cx + 14, headY - 19);
  ctx.lineTo(cx + 3, headY - 10);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = earColor;
  ctx.beginPath();
  ctx.moveTo(cx + 9, headY - 9);
  ctx.lineTo(cx + 12, headY - 17);
  ctx.lineTo(cx + 5, headY - 10);
  ctx.closePath(); ctx.fill();

  // Eyes (happy arcs)
  ctx.strokeStyle = '#3C2415';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx - 4, headY - 1, 2.5, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + 4, headY - 1, 2.5, Math.PI, 0); ctx.stroke();

  // Cheeks
  ctx.fillStyle = '#F08080';
  ctx.globalAlpha = 0.4;
  ctx.beginPath(); ctx.ellipse(cx - 9, headY + 2, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 9, headY + 2, 3, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Nose & mouth
  ctx.fillStyle = '#3C2415';
  ctx.beginPath();
  ctx.moveTo(cx, headY + 1); ctx.lineTo(cx - 1.5, headY + 3); ctx.lineTo(cx + 1.5, headY + 3);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3C2415';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx, headY + 3); ctx.lineTo(cx - 2.5, headY + 5.5);
  ctx.moveTo(cx, headY + 3); ctx.lineTo(cx + 2.5, headY + 5.5);
  ctx.stroke();

  // Whiskers
  ctx.beginPath();
  ctx.moveTo(cx - 7, headY + 1); ctx.lineTo(cx - 17, headY - 1);
  ctx.moveTo(cx - 7, headY + 3); ctx.lineTo(cx - 17, headY + 3);
  ctx.moveTo(cx + 7, headY + 1); ctx.lineTo(cx + 17, headY - 1);
  ctx.moveTo(cx + 7, headY + 3); ctx.lineTo(cx + 17, headY + 3);
  ctx.stroke();

  // Accessory
  if (accessory === 'apron') {
    // Mom's apron
    ctx.fillStyle = '#E8E8F0';
    ctx.strokeStyle = '#AAAACC';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, by - 22);
    ctx.lineTo(cx - 10, by - 6);
    ctx.lineTo(cx + 10, by - 6);
    ctx.lineTo(cx + 8, by - 22);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Apron pocket
    ctx.fillRect(cx - 4, by - 14, 8, 5);
    ctx.strokeRect(cx - 4, by - 14, 8, 5);
  } else if (accessory === 'bowtie') {
    // Brother's bowtie
    ctx.fillStyle = '#4A90D9';
    ctx.beginPath();
    ctx.moveTo(cx, by - 28);
    ctx.lineTo(cx - 5, by - 32);
    ctx.lineTo(cx - 5, by - 24);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, by - 28);
    ctx.lineTo(cx + 5, by - 32);
    ctx.lineTo(cx + 5, by - 24);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3A70B0';
    ctx.beginPath();
    ctx.arc(cx, by - 28, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function generateDragonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  // Silver the Dragon — Spyro-style quadrupedal cute dragon, 3/4 view facing left
  // Compact body on all fours, big head, big eyes, golden accents, small wings

  // === COLOR PALETTE ===
  const bodyMain = '#6B5B95';     // rich purple-blue (like Spyro)
  const bodyLight = '#8B7BB5';    // lighter purple
  const bodyDark = '#4A3D6E';     // shadow purple
  const belly = '#F5C842';        // golden yellow belly (like Spyro)
  const bellyDark = '#D4A832';    // darker gold for lines
  const wingMembrane = '#F5C842'; // golden wing membrane
  const wingBone = '#D4A832';     // darker gold bone
  const outline = '#2A1F3D';      // dark purple outline
  const hornColor = '#F5C842';    // golden horns
  const hornShade = '#D4A832';    // horn shadow
  const spikeColor = '#F5C842';   // golden spikes
  const eyeGreen = '#4CAF50';     // green iris (like Spyro)
  const clawColor = '#F5C842';    // golden claws

  const cx = 80;      // body center x
  const groundY = 140; // ground line

  // === TAIL (behind body, curving up) ===
  ctx.fillStyle = bodyMain;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx + 28, groundY - 32);
  ctx.quadraticCurveTo(cx + 55, groundY - 25, cx + 72, groundY - 35);
  ctx.quadraticCurveTo(cx + 82, groundY - 42, cx + 85, groundY - 55);
  ctx.lineTo(cx + 82, groundY - 50);
  ctx.quadraticCurveTo(cx + 75, groundY - 38, cx + 55, groundY - 32);
  ctx.quadraticCurveTo(cx + 38, groundY - 28, cx + 25, groundY - 38);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Tail arrowhead (golden)
  ctx.fillStyle = spikeColor;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 85, groundY - 55);
  ctx.lineTo(cx + 92, groundY - 68);
  ctx.lineTo(cx + 86, groundY - 58);
  ctx.lineTo(cx + 80, groundY - 66);
  ctx.lineTo(cx + 83, groundY - 52);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // === WINGS (small, Spyro-style — behind body) ===
  // Left wing (far side, smaller)
  ctx.fillStyle = wingMembrane;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(cx + 2, groundY - 55);
  ctx.quadraticCurveTo(cx - 15, groundY - 85, cx - 28, groundY - 95);
  ctx.quadraticCurveTo(cx - 32, groundY - 78, cx - 30, groundY - 65);
  ctx.quadraticCurveTo(cx - 22, groundY - 58, cx - 10, groundY - 48);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.globalAlpha = 1;

  // Right wing (near side, bigger)
  ctx.fillStyle = wingMembrane;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 10, groundY - 55);
  ctx.quadraticCurveTo(cx + 30, groundY - 90, cx + 45, groundY - 100);
  ctx.quadraticCurveTo(cx + 52, groundY - 82, cx + 50, groundY - 65);
  ctx.quadraticCurveTo(cx + 40, groundY - 55, cx + 25, groundY - 48);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Wing bones
  ctx.strokeStyle = wingBone;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + 12, groundY - 55);
  ctx.quadraticCurveTo(cx + 28, groundY - 80, cx + 45, groundY - 100);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 14, groundY - 52);
  ctx.quadraticCurveTo(cx + 35, groundY - 70, cx + 50, groundY - 68);
  ctx.stroke();

  // === HIND LEGS (chunky, Spyro-style) ===
  ctx.fillStyle = bodyMain;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  // Left hind leg (far)
  ctx.beginPath();
  ctx.moveTo(cx + 10, groundY - 28);
  ctx.quadraticCurveTo(cx + 5, groundY - 15, cx + 2, groundY - 8);
  ctx.lineTo(cx - 6, groundY - 4);
  ctx.lineTo(cx + 16, groundY - 4);
  ctx.lineTo(cx + 14, groundY - 12);
  ctx.quadraticCurveTo(cx + 18, groundY - 20, cx + 18, groundY - 28);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Right hind leg (near)
  ctx.beginPath();
  ctx.moveTo(cx + 20, groundY - 28);
  ctx.quadraticCurveTo(cx + 18, groundY - 15, cx + 15, groundY - 8);
  ctx.lineTo(cx + 8, groundY - 4);
  ctx.lineTo(cx + 28, groundY - 4);
  ctx.lineTo(cx + 26, groundY - 12);
  ctx.quadraticCurveTo(cx + 28, groundY - 20, cx + 28, groundY - 28);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Hind claws (golden)
  ctx.fillStyle = clawColor;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(cx - 2 + i * 6, groundY - 2, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + 12 + i * 6, groundY - 2, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }

  // === BODY (compact, round, Spyro-style) ===
  ctx.fillStyle = bodyMain;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(cx + 8, groundY - 42, 32, 22, 0.1, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Belly (golden, oval inset)
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.ellipse(cx + 4, groundY - 36, 18, 14, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Belly scale lines
  ctx.strokeStyle = bellyDark;
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i++) {
    const sy = groundY - 44 + i * 6;
    ctx.beginPath();
    ctx.moveTo(cx - 8, sy);
    ctx.quadraticCurveTo(cx + 4, sy + 2, cx + 16, sy);
    ctx.stroke();
  }

  // === FRONT LEGS (sturdy, on ground) ===
  ctx.fillStyle = bodyMain;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  // Left front leg (far)
  ctx.beginPath();
  ctx.moveTo(cx - 16, groundY - 38);
  ctx.quadraticCurveTo(cx - 22, groundY - 22, cx - 24, groundY - 10);
  ctx.lineTo(cx - 30, groundY - 4);
  ctx.lineTo(cx - 12, groundY - 4);
  ctx.lineTo(cx - 14, groundY - 12);
  ctx.quadraticCurveTo(cx - 12, groundY - 28, cx - 10, groundY - 36);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Right front leg (near)
  ctx.beginPath();
  ctx.moveTo(cx - 8, groundY - 38);
  ctx.quadraticCurveTo(cx - 12, groundY - 22, cx - 14, groundY - 10);
  ctx.lineTo(cx - 20, groundY - 4);
  ctx.lineTo(cx - 2, groundY - 4);
  ctx.lineTo(cx - 4, groundY - 12);
  ctx.quadraticCurveTo(cx - 2, groundY - 28, cx, groundY - 36);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Front claws (golden)
  ctx.fillStyle = clawColor;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(cx - 26 + i * 6, groundY - 2, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx - 16 + i * 6, groundY - 2, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }

  // === NECK (thick, angled up from body to head) ===
  ctx.fillStyle = bodyMain;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 14, groundY - 50);
  ctx.quadraticCurveTo(cx - 25, groundY - 68, cx - 28, groundY - 80);
  ctx.quadraticCurveTo(cx - 18, groundY - 88, cx - 8, groundY - 80);
  ctx.quadraticCurveTo(cx - 4, groundY - 68, cx + 2, groundY - 50);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Neck belly (golden front)
  ctx.fillStyle = belly;
  ctx.beginPath();
  ctx.moveTo(cx - 12, groundY - 52);
  ctx.quadraticCurveTo(cx - 20, groundY - 68, cx - 22, groundY - 78);
  ctx.quadraticCurveTo(cx - 14, groundY - 72, cx - 8, groundY - 78);
  ctx.quadraticCurveTo(cx - 4, groundY - 68, cx - 2, groundY - 52);
  ctx.closePath();
  ctx.fill();

  // === BACK SPIKES (golden, down neck and body) ===
  ctx.fillStyle = spikeColor;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.2;
  const spikes = [
    { x: cx - 16, y: groundY - 82, h: 10, w: 4 },
    { x: cx - 10, y: groundY - 74, h: 9, w: 3.5 },
    { x: cx - 6, y: groundY - 66, h: 8, w: 3 },
    { x: cx - 2, y: groundY - 58, h: 7, w: 3 },
    { x: cx + 4, y: groundY - 52, h: 6, w: 2.5 },
  ];
  spikes.forEach(sp => {
    ctx.beginPath();
    ctx.moveTo(sp.x - sp.w, sp.y);
    ctx.lineTo(sp.x, sp.y - sp.h);
    ctx.lineTo(sp.x + sp.w, sp.y);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  });

  // === HEAD (big, round, Spyro-style, 3/4 view facing left) ===
  const headX = cx - 28;
  const headY = groundY - 95;

  // Head base (big round)
  ctx.fillStyle = bodyLight;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.ellipse(headX, headY, 26, 22, -0.05, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Snout (rounded, extends forward)
  ctx.fillStyle = bodyLight;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(headX - 22, headY - 2);
  ctx.quadraticCurveTo(headX - 40, headY - 2, headX - 42, headY + 6);
  ctx.quadraticCurveTo(headX - 40, headY + 14, headX - 30, headY + 14);
  ctx.quadraticCurveTo(headX - 20, headY + 14, headX - 16, headY + 10);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Snout top ridge
  ctx.strokeStyle = bodyMain;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(headX - 22, headY - 1);
  ctx.quadraticCurveTo(headX - 32, headY - 2, headX - 40, headY);
  ctx.stroke();

  // Nostrils (top of snout like Spyro)
  ctx.fillStyle = outline;
  ctx.beginPath();
  ctx.ellipse(headX - 38, headY + 3, 2.5, 2, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headX - 36, headY + 8, 2.5, 2, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Smoke puffs
  ctx.fillStyle = 'rgba(200,180,100,0.4)';
  ctx.beginPath(); ctx.arc(headX - 46, headY + 1, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(headX - 50, headY - 1, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(headX - 53, headY - 3, 1.8, 0, Math.PI * 2); ctx.fill();

  // Mouth — confident smile
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(headX - 36, headY + 12);
  ctx.quadraticCurveTo(headX - 26, headY + 17, headX - 16, headY + 12);
  ctx.stroke();

  // Tiny tooth
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = outline;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(headX - 28, headY + 13);
  ctx.lineTo(headX - 26, headY + 17);
  ctx.lineTo(headX - 24, headY + 13);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // === EYES (very big, round, Spyro-style) ===
  // Left eye (facing us, big)
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(headX - 8, headY - 4, 10, 9, -0.05, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // Iris (green like Spyro)
  ctx.fillStyle = eyeGreen;
  ctx.beginPath();
  ctx.ellipse(headX - 9, headY - 3, 7, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pupil
  ctx.fillStyle = '#0A1628';
  ctx.beginPath();
  ctx.ellipse(headX - 9, headY - 3, 4, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Eye sparkles
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.arc(headX - 12, headY - 7, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(headX - 6, headY - 1, 1.2, 0, Math.PI * 2); ctx.fill();

  // Right eye (further, slightly smaller)
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(headX + 12, headY - 3, 8, 7.5, 0.05, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = eyeGreen;
  ctx.beginPath();
  ctx.ellipse(headX + 11, headY - 2, 5.5, 5.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0A1628';
  ctx.beginPath();
  ctx.ellipse(headX + 11, headY - 2, 3.2, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.arc(headX + 8, headY - 6, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(headX + 13, headY, 0.9, 0, Math.PI * 2); ctx.fill();

  // Eyebrow ridges (bold, expressive like Spyro)
  ctx.strokeStyle = bodyDark;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(headX - 18, headY - 12);
  ctx.quadraticCurveTo(headX - 8, headY - 16, headX + 2, headY - 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(headX + 4, headY - 11);
  ctx.quadraticCurveTo(headX + 12, headY - 14, headX + 20, headY - 9);
  ctx.stroke();

  // === HORNS (big, golden, swept back — like Spyro) ===
  ctx.fillStyle = hornColor;
  ctx.strokeStyle = hornShade;
  ctx.lineWidth = 2;
  // Left horn (big, curved back)
  ctx.beginPath();
  ctx.moveTo(headX - 4, headY - 18);
  ctx.quadraticCurveTo(headX - 2, headY - 38, headX + 6, headY - 48);
  ctx.quadraticCurveTo(headX + 10, headY - 44, headX + 6, headY - 34);
  ctx.quadraticCurveTo(headX + 4, headY - 24, headX + 2, headY - 18);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Right horn
  ctx.beginPath();
  ctx.moveTo(headX + 14, headY - 16);
  ctx.quadraticCurveTo(headX + 18, headY - 34, headX + 26, headY - 44);
  ctx.quadraticCurveTo(headX + 28, headY - 40, headX + 24, headY - 30);
  ctx.quadraticCurveTo(headX + 20, headY - 22, headX + 18, headY - 16);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Horn ridges
  ctx.strokeStyle = hornShade;
  ctx.lineWidth = 0.8;
  for (let i = 1; i <= 4; i++) {
    const t = i * 0.2;
    const ly = headY - 18 - 26 * t;
    ctx.beginPath();
    ctx.moveTo(headX - 2 + 4 * t, ly);
    ctx.lineTo(headX + 4 + 2 * t, ly);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(headX + 16 + 4 * t, ly + 2);
    ctx.lineTo(headX + 22 + 1 * t, ly + 2);
    ctx.stroke();
  }

  // === Small nose horn (golden, like Spyro) ===
  ctx.fillStyle = hornColor;
  ctx.strokeStyle = hornShade;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(headX - 34, headY - 1);
  ctx.lineTo(headX - 40, headY - 8);
  ctx.lineTo(headX - 32, headY);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  return canvas;
}

function generateFlyingDragonTexture() {
  // Top-down view of Silver (Spyro-style) with Dax riding on back
  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 90;
  const ctx = canvas.getContext('2d');
  const cx = 40;
  const cy = 45;

  // Colors matching the new Spyro-style Silver
  const bodyMain = '#6B5B95';
  const bodyLight = '#7E6DAA';
  const bodyDark = '#4A3D6E';
  const golden = '#F5C842';
  const goldenDark = '#D4A520';
  const outline = '#3A2D5C';

  // Wings (spread wide) — golden membrane like Spyro
  ctx.fillStyle = golden;
  ctx.strokeStyle = goldenDark;
  ctx.lineWidth = 1.5;
  // Left wing
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 5);
  ctx.quadraticCurveTo(cx - 35, cy - 20, cx - 38, cy + 5);
  ctx.quadraticCurveTo(cx - 30, cy - 5, cx - 10, cy + 8);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(cx + 8, cy - 5);
  ctx.quadraticCurveTo(cx + 35, cy - 20, cx + 38, cy + 5);
  ctx.quadraticCurveTo(cx + 30, cy - 5, cx + 10, cy + 8);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Wing membrane lines
  ctx.strokeStyle = goldenDark;
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 3; i++) {
    const t = 0.3 + i * 0.25;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 3 + i * 3);
    ctx.lineTo(cx - 12 - 20 * t, cy - 10 + i * 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 8, cy - 3 + i * 3);
    ctx.lineTo(cx + 12 + 20 * t, cy - 10 + i * 8);
    ctx.stroke();
  }
  // Wing bone (purple arm along leading edge)
  ctx.strokeStyle = bodyDark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 5);
  ctx.quadraticCurveTo(cx - 25, cy - 16, cx - 38, cy + 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 8, cy - 5);
  ctx.quadraticCurveTo(cx + 25, cy - 16, cx + 38, cy + 5);
  ctx.stroke();

  // Dragon body (elongated oval, top-down) — purple
  ctx.fillStyle = bodyMain;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 12, 22, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Golden belly ridge (center stripe)
  ctx.strokeStyle = golden;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 16);
  ctx.lineTo(cx, cy + 16);
  ctx.stroke();

  // Back spikes (golden, running down spine — visible from above)
  ctx.fillStyle = golden;
  ctx.strokeStyle = goldenDark;
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 4; i++) {
    const sy = cy - 14 + i * 8;
    ctx.beginPath();
    ctx.moveTo(cx - 3, sy);
    ctx.lineTo(cx, sy - 3);
    ctx.lineTo(cx + 3, sy);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }

  // Tail — purple with golden tip
  ctx.fillStyle = bodyLight;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 4, cy + 20);
  ctx.quadraticCurveTo(cx, cy + 38, cx + 2, cy + 42);
  ctx.lineTo(cx + 4, cy + 38);
  ctx.quadraticCurveTo(cx + 2, cy + 32, cx + 4, cy + 20);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Golden arrowhead tail tip
  ctx.fillStyle = golden;
  ctx.strokeStyle = goldenDark;
  ctx.beginPath();
  ctx.moveTo(cx + 2, cy + 42);
  ctx.lineTo(cx - 4, cy + 45);
  ctx.lineTo(cx + 1, cy + 40);
  ctx.lineTo(cx + 6, cy + 44);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Head (from above — snout pointing up/forward) — purple
  ctx.fillStyle = bodyLight;
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 26, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // Snout
  ctx.fillStyle = bodyMain;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 38, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // Nostrils
  ctx.fillStyle = '#2C1A3C';
  ctx.beginPath();
  ctx.arc(cx - 3, cy - 40, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 3, cy - 40, 1.5, 0, Math.PI * 2);
  ctx.fill();
  // Nose horn (golden, tiny)
  ctx.fillStyle = golden;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 43);
  ctx.lineTo(cx - 2, cy - 40);
  ctx.lineTo(cx + 2, cy - 40);
  ctx.closePath();
  ctx.fill();
  // Golden horns (swept back, Spyro-style)
  ctx.fillStyle = golden;
  ctx.strokeStyle = goldenDark;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 7, cy - 30);
  ctx.lineTo(cx - 12, cy - 40);
  ctx.lineTo(cx - 5, cy - 33);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 7, cy - 30);
  ctx.lineTo(cx + 12, cy - 40);
  ctx.lineTo(cx + 5, cy - 33);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Eyes (green, visible from above as ovals on sides of head)
  ctx.fillStyle = '#4CAF50';
  ctx.strokeStyle = outline;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx - 6, cy - 27, 3, 2.5, -0.3, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + 6, cy - 27, 3, 2.5, 0.3, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // Pupils
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.arc(cx - 6, cy - 27, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 6, cy - 27, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Dax riding on back (small orange blob with ears)
  ctx.fillStyle = '#F0B860';
  ctx.strokeStyle = '#3C2415';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 6, 7, 8, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // Dax ears
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy - 12);
  ctx.lineTo(cx - 8, cy - 18);
  ctx.lineTo(cx - 2, cy - 13);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 5, cy - 12);
  ctx.lineTo(cx + 8, cy - 18);
  ctx.lineTo(cx + 2, cy - 13);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Stripes on Dax
  ctx.strokeStyle = '#C47A30';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 2, cy - 12);
  ctx.lineTo(cx - 3, cy - 8);
  ctx.moveTo(cx, cy - 13);
  ctx.lineTo(cx, cy - 8);
  ctx.moveTo(cx + 2, cy - 12);
  ctx.lineTo(cx + 3, cy - 8);
  ctx.stroke();

  return canvas;
}

function generateFlyingObstacles() {
  const textures = {};

  // Tree (top-down: green circle with trunk dot)
  const treeCanvas = document.createElement('canvas');
  treeCanvas.width = 32;
  treeCanvas.height = 32;
  let ctx = treeCanvas.getContext('2d');
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(17, 18, 13, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Foliage
  ctx.fillStyle = '#2D7A1E';
  ctx.strokeStyle = '#1A5C10';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(16, 16, 12, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // Lighter patches
  ctx.fillStyle = '#3A9A2C';
  ctx.beginPath();
  ctx.arc(12, 13, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, 15, 4, 0, Math.PI * 2);
  ctx.fill();
  // Trunk center
  ctx.fillStyle = '#5C3A1E';
  ctx.beginPath();
  ctx.arc(16, 16, 2, 0, Math.PI * 2);
  ctx.fill();
  textures.tree = treeCanvas;

  // Mountain peak (top-down: gray triangle/diamond)
  const mtnCanvas = document.createElement('canvas');
  mtnCanvas.width = 48;
  mtnCanvas.height = 48;
  ctx = mtnCanvas.getContext('2d');
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.moveTo(26, 4);
  ctx.lineTo(46, 38);
  ctx.lineTo(26, 46);
  ctx.lineTo(6, 38);
  ctx.closePath();
  ctx.fill();
  // Mountain
  ctx.fillStyle = '#808890';
  ctx.strokeStyle = '#505860';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(24, 2);
  ctx.lineTo(44, 36);
  ctx.lineTo(24, 44);
  ctx.lineTo(4, 36);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Snow cap
  ctx.fillStyle = '#E8E8F0';
  ctx.beginPath();
  ctx.moveTo(24, 2);
  ctx.lineTo(32, 16);
  ctx.lineTo(24, 20);
  ctx.lineTo(16, 16);
  ctx.closePath();
  ctx.fill();
  // Rock texture
  ctx.strokeStyle = '#687080';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(18, 24); ctx.lineTo(22, 30);
  ctx.moveTo(28, 22); ctx.lineTo(30, 28);
  ctx.stroke();
  textures.mountain = mtnCanvas;

  // House (top-down: colored rectangle with roof)
  const houseCanvas = document.createElement('canvas');
  houseCanvas.width = 28;
  houseCanvas.height = 32;
  ctx = houseCanvas.getContext('2d');
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(4, 6, 22, 24);
  // Roof
  ctx.fillStyle = '#CC4444';
  ctx.strokeStyle = '#8B2020';
  ctx.lineWidth = 1;
  ctx.fillRect(1, 2, 26, 28);
  ctx.strokeRect(1, 2, 26, 28);
  // Roof ridge line
  ctx.strokeStyle = '#AA3333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(14, 2);
  ctx.lineTo(14, 30);
  ctx.stroke();
  // Chimney
  ctx.fillStyle = '#666666';
  ctx.fillRect(20, 4, 6, 8);
  textures.house = houseCanvas;

  // Cloud (decoration, not obstacle)
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 48;
  cloudCanvas.height = 24;
  ctx = cloudCanvas.getContext('2d');
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(14, 14, 10, 0, Math.PI * 2);
  ctx.arc(26, 10, 12, 0, Math.PI * 2);
  ctx.arc(36, 14, 9, 0, Math.PI * 2);
  ctx.fill();
  textures.cloud = cloudCanvas;

  return textures;
}

function generateCastleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  const cx = 100;

  // Castle base
  ctx.fillStyle = '#D0D8E8';
  ctx.strokeStyle = '#8090A0';
  ctx.lineWidth = 2;
  ctx.fillRect(30, 40, 140, 90);
  ctx.strokeRect(30, 40, 140, 90);

  // Crystal shimmer on walls
  ctx.fillStyle = 'rgba(180,200,240,0.4)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(45 + i * 24, 70 + (i % 2) * 20, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Towers
  const towerPositions = [30, 100, 170];
  towerPositions.forEach((tx, i) => {
    const h = i === 1 ? 55 : 40;
    // Tower body
    ctx.fillStyle = '#C0C8D8';
    ctx.strokeStyle = '#8090A0';
    ctx.lineWidth = 2;
    ctx.fillRect(tx - 14, 40 - h, 28, h + 20);
    ctx.strokeRect(tx - 14, 40 - h, 28, h + 20);
    // Tower top (pointed)
    ctx.fillStyle = '#8B5CF6';
    ctx.strokeStyle = '#6A3CC8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, 40 - h - 20);
    ctx.lineTo(tx + 16, 40 - h);
    ctx.lineTo(tx - 16, 40 - h);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    // Crystal on top
    ctx.fillStyle = '#E0E8FF';
    ctx.beginPath();
    ctx.arc(tx, 40 - h - 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(tx - 1, 40 - h - 9, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Battlements
    for (let b = -2; b <= 2; b++) {
      ctx.fillStyle = '#B0B8C8';
      ctx.fillRect(tx + b * 6 - 2, 40 - h, 4, 4);
    }
  });

  // Gate (silver crystal)
  ctx.fillStyle = '#A0A8B8';
  ctx.strokeStyle = '#707888';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 16, 130);
  ctx.lineTo(cx - 16, 100);
  ctx.arc(cx, 100, 16, Math.PI, 0);
  ctx.lineTo(cx + 16, 130);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Gate crystal decoration
  ctx.fillStyle = '#C8D0F0';
  ctx.beginPath();
  ctx.moveTo(cx, 95);
  ctx.lineTo(cx - 6, 108);
  ctx.lineTo(cx, 104);
  ctx.lineTo(cx + 6, 108);
  ctx.closePath();
  ctx.fill();
  // Gate sparkle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx - 3, 97, 2, 0, Math.PI * 2);
  ctx.fill();

  // Windows
  const windowPositions = [55, 75, 125, 145];
  windowPositions.forEach(wx => {
    ctx.fillStyle = '#87CEEB';
    ctx.strokeStyle = '#8090A0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(wx, 65, 5, Math.PI, 0);
    ctx.lineTo(wx + 5, 75);
    ctx.lineTo(wx - 5, 75);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  });

  // Banner between towers
  ctx.fillStyle = '#8B5CF6';
  ctx.fillRect(cx - 20, 30, 40, 12);
  ctx.fillStyle = '#FFD700';
  ctx.font = '8px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CRYSTAL', cx, 39);

  return canvas;
}

function generateRiverSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Post
  ctx.fillStyle = '#6B4226';
  ctx.fillRect(20, 20, 8, 44);

  // Sign board
  ctx.fillStyle = '#C49A3C';
  ctx.strokeStyle = '#6B4226';
  ctx.lineWidth = 2;
  ctx.fillRect(2, 4, 44, 24);
  ctx.strokeRect(2, 4, 44, 24);

  // Arrow
  ctx.fillStyle = '#3C2415';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('River →', 24, 21);

  return canvas;
}

// ===== PALACE SCENE TEXTURES =====

function generateFairyQueenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');

  const cx = 40;
  const baseY = 115;

  // Wings (large, translucent blue butterfly wings)
  ctx.globalAlpha = 0.5;
  // Left wing
  ctx.fillStyle = '#4A90D9';
  ctx.beginPath();
  ctx.moveTo(cx - 5, baseY - 70);
  ctx.quadraticCurveTo(cx - 45, baseY - 95, cx - 40, baseY - 60);
  ctx.quadraticCurveTo(cx - 38, baseY - 40, cx - 5, baseY - 50);
  ctx.closePath();
  ctx.fill();
  // Left lower wing
  ctx.fillStyle = '#5BA0E8';
  ctx.beginPath();
  ctx.moveTo(cx - 5, baseY - 55);
  ctx.quadraticCurveTo(cx - 35, baseY - 40, cx - 30, baseY - 25);
  ctx.quadraticCurveTo(cx - 20, baseY - 20, cx - 5, baseY - 40);
  ctx.closePath();
  ctx.fill();
  // Right wing
  ctx.fillStyle = '#4A90D9';
  ctx.beginPath();
  ctx.moveTo(cx + 5, baseY - 70);
  ctx.quadraticCurveTo(cx + 45, baseY - 95, cx + 40, baseY - 60);
  ctx.quadraticCurveTo(cx + 38, baseY - 40, cx + 5, baseY - 50);
  ctx.closePath();
  ctx.fill();
  // Right lower wing
  ctx.fillStyle = '#5BA0E8';
  ctx.beginPath();
  ctx.moveTo(cx + 5, baseY - 55);
  ctx.quadraticCurveTo(cx + 35, baseY - 40, cx + 30, baseY - 25);
  ctx.quadraticCurveTo(cx + 20, baseY - 20, cx + 5, baseY - 40);
  ctx.closePath();
  ctx.fill();
  // Wing sparkles
  ctx.globalAlpha = 0.8;
  [[cx - 25, baseY - 70], [cx + 25, baseY - 70], [cx - 20, baseY - 50], [cx + 20, baseY - 50]].forEach(([x, y]) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Dress (crystal blue, flowing)
  const dressGrad = ctx.createLinearGradient(cx, baseY - 50, cx, baseY);
  dressGrad.addColorStop(0, '#3A7BD5');
  dressGrad.addColorStop(0.5, '#5B9EE8');
  dressGrad.addColorStop(1, '#87CEEB');
  ctx.fillStyle = dressGrad;
  ctx.strokeStyle = '#2C5F9E';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 8, baseY - 50);
  ctx.lineTo(cx - 22, baseY - 2);
  ctx.quadraticCurveTo(cx, baseY + 2, cx + 22, baseY - 2);
  ctx.lineTo(cx + 8, baseY - 50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Crystal shimmer on dress
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  [[cx - 6, baseY - 35], [cx + 3, baseY - 25], [cx - 2, baseY - 15], [cx + 7, baseY - 40]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x, y - 3);
    ctx.lineTo(x + 2, y);
    ctx.lineTo(x, y + 3);
    ctx.lineTo(x - 2, y);
    ctx.closePath();
    ctx.fill();
  });

  // Body/torso
  ctx.fillStyle = '#5B9EE8';
  ctx.strokeStyle = '#2C5F9E';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 55, 9, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Arms
  ctx.strokeStyle = '#FFD4B8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - 9, baseY - 55);
  ctx.quadraticCurveTo(cx - 18, baseY - 42, cx - 15, baseY - 35);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 9, baseY - 55);
  ctx.quadraticCurveTo(cx + 18, baseY - 42, cx + 15, baseY - 35);
  ctx.stroke();

  // Head
  ctx.fillStyle = '#FFE4CC';
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 75, 10, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hair (long, silvery-blue)
  ctx.fillStyle = '#B8D4F0';
  ctx.strokeStyle = '#7AA0C8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 10, baseY - 80);
  ctx.quadraticCurveTo(cx - 14, baseY - 65, cx - 16, baseY - 45);
  ctx.lineTo(cx - 12, baseY - 45);
  ctx.quadraticCurveTo(cx - 11, baseY - 65, cx - 8, baseY - 78);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 10, baseY - 80);
  ctx.quadraticCurveTo(cx + 14, baseY - 65, cx + 16, baseY - 45);
  ctx.lineTo(cx + 12, baseY - 45);
  ctx.quadraticCurveTo(cx + 11, baseY - 65, cx + 8, baseY - 78);
  ctx.closePath();
  ctx.fill();

  // Crown/tiara
  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#DAA520';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 8, baseY - 85);
  ctx.lineTo(cx - 5, baseY - 92);
  ctx.lineTo(cx - 2, baseY - 86);
  ctx.lineTo(cx, baseY - 94);
  ctx.lineTo(cx + 2, baseY - 86);
  ctx.lineTo(cx + 5, baseY - 92);
  ctx.lineTo(cx + 8, baseY - 85);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Crown jewel
  ctx.fillStyle = '#4A90D9';
  ctx.beginPath();
  ctx.arc(cx, baseY - 89, 2, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#4A90D9';
  ctx.beginPath();
  ctx.ellipse(cx - 4, baseY - 76, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 4, baseY - 76, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Eye sparkle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx - 3, baseY - 77, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 5, baseY - 77, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, baseY - 72, 3, 0.1, Math.PI - 0.1);
  ctx.stroke();

  return canvas;
}

function generateGnomeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 40;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');
  const cx = 20;
  const baseY = 54;

  // Body (short, stout)
  ctx.fillStyle = '#8B4513';
  ctx.strokeStyle = '#5C2D06';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 16, 10, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Belt
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(cx - 10, baseY - 18, 20, 3);

  // Legs
  ctx.fillStyle = '#654321';
  ctx.fillRect(cx - 7, baseY - 5, 5, 6);
  ctx.fillRect(cx + 2, baseY - 5, 5, 6);
  // Boots
  ctx.fillStyle = '#3C1A00';
  ctx.fillRect(cx - 8, baseY - 1, 7, 3);
  ctx.fillRect(cx + 1, baseY - 1, 7, 3);

  // Head
  ctx.fillStyle = '#FFD4B8';
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, baseY - 34, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Beard (big white beard)
  ctx.fillStyle = '#F0F0F0';
  ctx.beginPath();
  ctx.moveTo(cx - 6, baseY - 30);
  ctx.quadraticCurveTo(cx - 8, baseY - 20, cx - 4, baseY - 14);
  ctx.lineTo(cx + 4, baseY - 14);
  ctx.quadraticCurveTo(cx + 8, baseY - 20, cx + 6, baseY - 30);
  ctx.closePath();
  ctx.fill();

  // Pointy hat (red)
  ctx.fillStyle = '#CC2222';
  ctx.strokeStyle = '#881111';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 9, baseY - 38);
  ctx.lineTo(cx, baseY - 54);
  ctx.lineTo(cx + 9, baseY - 38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Eyes
  ctx.fillStyle = '#3C2415';
  ctx.beginPath();
  ctx.arc(cx - 3, baseY - 35, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 3, baseY - 35, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Nose (round, rosy)
  ctx.fillStyle = '#E8967A';
  ctx.beginPath();
  ctx.arc(cx, baseY - 32, 2.5, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function generatePixieTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 48;
  const ctx = canvas.getContext('2d');
  const cx = 16;
  const baseY = 44;

  // Tiny wings
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(cx - 10, baseY - 28, 6, 10, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 10, baseY - 28, 6, 10, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Body (tiny, green outfit)
  ctx.fillStyle = '#2ECC71';
  ctx.strokeStyle = '#1A8F4E';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 22, 5, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Legs
  ctx.strokeStyle = '#FFD4B8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 3, baseY - 14);
  ctx.lineTo(cx - 4, baseY - 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 3, baseY - 14);
  ctx.lineTo(cx + 4, baseY - 6);
  ctx.stroke();

  // Tiny shoes
  ctx.fillStyle = '#2ECC71';
  ctx.beginPath();
  ctx.ellipse(cx - 5, baseY - 5, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, baseY - 5, 3, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#FFE4CC';
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, baseY - 34, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pointy ears
  ctx.fillStyle = '#FFD4B8';
  ctx.beginPath();
  ctx.moveTo(cx - 6, baseY - 35);
  ctx.lineTo(cx - 12, baseY - 38);
  ctx.lineTo(cx - 6, baseY - 32);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 6, baseY - 35);
  ctx.lineTo(cx + 12, baseY - 38);
  ctx.lineTo(cx + 6, baseY - 32);
  ctx.closePath();
  ctx.fill();

  // Hair (green, messy)
  ctx.fillStyle = '#27AE60';
  ctx.beginPath();
  ctx.arc(cx, baseY - 38, 5, Math.PI, Math.PI * 2);
  ctx.fill();

  // Eyes (big, bright)
  ctx.fillStyle = '#2ECC71';
  ctx.beginPath();
  ctx.arc(cx - 2.5, baseY - 35, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 2.5, baseY - 35, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Glow aura
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(cx, baseY - 26, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  return canvas;
}

function generateGiantTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  const cx = 32;
  const baseY = 94;

  // Legs (thick)
  ctx.fillStyle = '#6B4423';
  ctx.strokeStyle = '#4A2F15';
  ctx.lineWidth = 1.5;
  ctx.fillRect(cx - 14, baseY - 28, 11, 26);
  ctx.fillRect(cx + 3, baseY - 28, 11, 26);
  ctx.strokeRect(cx - 14, baseY - 28, 11, 26);
  ctx.strokeRect(cx + 3, baseY - 28, 11, 26);

  // Boots
  ctx.fillStyle = '#3C1A00';
  ctx.fillRect(cx - 16, baseY - 4, 14, 6);
  ctx.fillRect(cx + 2, baseY - 4, 14, 6);

  // Body (large, brown tunic)
  ctx.fillStyle = '#8B6914';
  ctx.strokeStyle = '#5C4A0E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 48, 20, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Belt
  ctx.fillStyle = '#4A2F15';
  ctx.fillRect(cx - 18, baseY - 35, 36, 4);
  // Belt buckle
  ctx.fillStyle = '#DAA520';
  ctx.fillRect(cx - 4, baseY - 36, 8, 6);

  // Arms
  ctx.fillStyle = '#8B6914';
  ctx.strokeStyle = '#5C4A0E';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx - 22, baseY - 48, 7, 18, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx + 22, baseY - 48, 7, 18, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hands
  ctx.fillStyle = '#FFD4B8';
  ctx.beginPath();
  ctx.arc(cx - 24, baseY - 32, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 24, baseY - 32, 5, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#FFD4B8';
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, baseY - 78, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hair (bushy brown)
  ctx.fillStyle = '#654321';
  ctx.beginPath();
  ctx.arc(cx, baseY - 82, 12, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - 8, baseY - 78, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 8, baseY - 78, 5, 0, Math.PI * 2);
  ctx.fill();

  // Eyes (friendly)
  ctx.fillStyle = '#5C3A1E';
  ctx.beginPath();
  ctx.arc(cx - 5, baseY - 79, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 5, baseY - 79, 2, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#C4956A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, baseY - 74, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  return canvas;
}

function generateMagicWolfTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 56;
  const ctx = canvas.getContext('2d');
  const cx = 32;
  const baseY = 52;

  // Tail (fluffy, upward)
  ctx.fillStyle = '#6A5ACD';
  ctx.strokeStyle = '#483D8B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + 18, baseY - 24);
  ctx.quadraticCurveTo(cx + 30, baseY - 38, cx + 26, baseY - 44);
  ctx.quadraticCurveTo(cx + 22, baseY - 36, cx + 16, baseY - 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.fillStyle = '#7B68EE';
  ctx.strokeStyle = '#483D8B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 22, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Legs
  ctx.fillStyle = '#6A5ACD';
  ctx.strokeStyle = '#483D8B';
  ctx.lineWidth = 1;
  [[cx - 12, baseY - 12], [cx - 6, baseY - 11], [cx + 6, baseY - 11], [cx + 12, baseY - 12]].forEach(([x, y]) => {
    ctx.fillRect(x - 2, y, 4, 12);
    ctx.strokeRect(x - 2, y, 4, 12);
  });
  // Paws
  ctx.fillStyle = '#9B8FFF';
  [[cx - 12, baseY - 1], [cx - 6, baseY], [cx + 6, baseY], [cx + 12, baseY - 1]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Head
  ctx.fillStyle = '#7B68EE';
  ctx.strokeStyle = '#483D8B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx - 16, baseY - 28, 10, 9, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Snout
  ctx.fillStyle = '#9B8FFF';
  ctx.beginPath();
  ctx.ellipse(cx - 26, baseY - 27, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#483D8B';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Nose
  ctx.fillStyle = '#2C2040';
  ctx.beginPath();
  ctx.arc(cx - 30, baseY - 28, 2, 0, Math.PI * 2);
  ctx.fill();

  // Ears (pointed)
  ctx.fillStyle = '#7B68EE';
  ctx.strokeStyle = '#483D8B';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 20, baseY - 34);
  ctx.lineTo(cx - 24, baseY - 46);
  ctx.lineTo(cx - 15, baseY - 35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 12, baseY - 34);
  ctx.lineTo(cx - 10, baseY - 46);
  ctx.lineTo(cx - 8, baseY - 34);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Eyes (glowing)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(cx - 19, baseY - 30, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - 13, baseY - 30, 2, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pupils
  ctx.fillStyle = '#2C1040';
  ctx.beginPath();
  ctx.arc(cx - 19, baseY - 30, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - 13, baseY - 30, 1, 0, Math.PI * 2);
  ctx.fill();

  // Magical sparkles around wolf
  ctx.fillStyle = '#E0D0FF';
  ctx.globalAlpha = 0.6;
  [[cx + 10, baseY - 40], [cx - 28, baseY - 42], [cx + 20, baseY - 18], [cx - 8, baseY - 44]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x, y - 2);
    ctx.lineTo(x + 1, y);
    ctx.lineTo(x, y + 2);
    ctx.lineTo(x - 1, y);
    ctx.closePath();
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  return canvas;
}

function generateMapTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 170;
  const ctx = canvas.getContext('2d');

  // Parchment background
  const parchGrad = ctx.createRadialGradient(120, 85, 10, 120, 85, 140);
  parchGrad.addColorStop(0, '#F5E6C8');
  parchGrad.addColorStop(1, '#D4B896');
  ctx.fillStyle = parchGrad;
  ctx.fillRect(0, 0, 240, 170);

  // Aged edges
  ctx.strokeStyle = '#A08060';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 236, 166);
  ctx.strokeStyle = '#C0A078';
  ctx.lineWidth = 1;
  ctx.strokeRect(5, 5, 230, 160);

  // Stain spots for aged look
  ctx.fillStyle = 'rgba(160, 120, 80, 0.12)';
  ctx.beginPath(); ctx.arc(50, 35, 18, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(190, 130, 22, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(130, 95, 14, 0, Math.PI * 2); ctx.fill();

  // --- OCEAN (left edge and bottom) ---
  ctx.fillStyle = '#7EAED4';
  ctx.beginPath();
  ctx.moveTo(8, 8);
  ctx.lineTo(8, 162);
  ctx.lineTo(90, 162);
  ctx.quadraticCurveTo(70, 140, 45, 135);
  ctx.quadraticCurveTo(20, 130, 15, 100);
  ctx.quadraticCurveTo(12, 60, 8, 8);
  ctx.fill();
  // Ocean waves
  ctx.strokeStyle = '#6A9AC0';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(12, 50 + i * 28);
    ctx.quadraticCurveTo(22, 45 + i * 28, 30, 50 + i * 28);
    ctx.stroke();
  }
  // Ocean label
  ctx.fillStyle = '#4A7A9A';
  ctx.font = 'italic 7px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Silver', 25, 70);
  ctx.fillText('Sea', 25, 78);

  // --- LAKE (center-left area) ---
  ctx.fillStyle = '#8BBBD8';
  ctx.beginPath();
  ctx.ellipse(75, 105, 14, 8, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#6A9AC0';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.fillStyle = '#5A8AA8';
  ctx.font = '5px Arial';
  ctx.fillText('Moonlake', 75, 108);

  // --- DENSE FOREST (center area) ---
  ctx.fillStyle = '#2D6B1E';
  const forestTrees = [
    [65, 85], [72, 82], [80, 78], [88, 82], [95, 76],
    [68, 90], [78, 86], [86, 88], [92, 83],
    [100, 72], [108, 68], [115, 74], [105, 78],
    [55, 92], [60, 88], [48, 95],
  ];
  forestTrees.forEach(([x, y]) => {
    ctx.fillStyle = ['#2D6B1E', '#3A7D2C', '#1E5A14'][Math.floor(Math.random() * 3)];
    ctx.beginPath();
    ctx.moveTo(x - 3, y + 3); ctx.lineTo(x, y - 4); ctx.lineTo(x + 3, y + 3);
    ctx.closePath(); ctx.fill();
  });
  ctx.fillStyle = '#1E4A10';
  ctx.font = '5px Arial';
  ctx.fillText('Whispering', 82, 95);
  ctx.fillText('Woods', 82, 101);

  // --- SMALL VILLAGE (south of forest) ---
  ctx.fillStyle = '#B8860B';
  [[95, 110], [102, 112], [109, 109]].forEach(([x, y]) => {
    ctx.fillRect(x - 2, y - 2, 4, 3);
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 2); ctx.lineTo(x, y - 5); ctx.lineTo(x + 3, y - 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#B8860B';
  });
  ctx.fillStyle = '#6B4226';
  ctx.font = '5px Arial';
  ctx.fillText('Willowvale', 102, 120);

  // --- ROLLING HILLS (bottom-center) ---
  ctx.fillStyle = 'rgba(120, 160, 80, 0.25)';
  ctx.beginPath();
  ctx.moveTo(90, 155);
  ctx.quadraticCurveTo(110, 140, 130, 148);
  ctx.quadraticCurveTo(150, 138, 170, 150);
  ctx.lineTo(170, 162);
  ctx.lineTo(90, 162);
  ctx.closePath();
  ctx.fill();

  // --- RIVER (winding from lake toward mountains) ---
  ctx.strokeStyle = '#6AA0C0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(82, 100);
  ctx.quadraticCurveTo(95, 90, 105, 80);
  ctx.quadraticCurveTo(118, 65, 135, 55);
  ctx.stroke();

  // --- MOUNTAIN RANGE (top-right) ---
  // Background smaller mountains
  ctx.fillStyle = '#9B8B75';
  [[135, 55, 10], [155, 50, 8], [180, 52, 9]].forEach(([mx, my, h]) => {
    ctx.beginPath();
    ctx.moveTo(mx - h, my); ctx.lineTo(mx, my - h * 1.5); ctx.lineTo(mx + h, my);
    ctx.closePath(); ctx.fill();
  });

  // Main mountain (Malachar's peak)
  ctx.fillStyle = '#7B6B55';
  ctx.strokeStyle = '#5C4A35';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(145, 52);
  ctx.lineTo(168, 14);
  ctx.lineTo(195, 55);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Snow cap
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(160, 24); ctx.lineTo(168, 14); ctx.lineTo(176, 24);
  ctx.closePath();
  ctx.fill();
  // Second snow peak
  ctx.fillStyle = '#E8E8E8';
  ctx.beginPath();
  ctx.moveTo(183, 38); ctx.lineTo(188, 30); ctx.lineTo(193, 38);
  ctx.closePath();
  ctx.fill();

  // --- NIGHTMARE VILLAGE on mountain ---
  ctx.fillStyle = '#2C1A2C';
  ctx.fillRect(163, 28, 8, 5);
  ctx.fillRect(171, 30, 5, 3);
  ctx.fillStyle = '#4A1A3A';
  ctx.fillRect(159, 32, 4, 3);

  // Red X marking
  ctx.strokeStyle = '#CC0000';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(158, 20); ctx.lineTo(176, 38);
  ctx.moveTo(176, 20); ctx.lineTo(158, 38);
  ctx.stroke();

  // --- CRYSTAL PALACE icon (bottom-left area) ---
  ctx.fillStyle = '#6A90C0';
  ctx.fillRect(38, 130, 14, 10);
  ctx.fillStyle = '#8B5CF6';
  ctx.beginPath();
  ctx.moveTo(38, 130); ctx.lineTo(45, 123); ctx.lineTo(52, 130);
  ctx.closePath(); ctx.fill();
  // Towers
  ctx.fillStyle = '#7AA0D0';
  ctx.fillRect(36, 126, 4, 8);
  ctx.fillRect(50, 126, 4, 8);

  // --- PATH from Crystal Palace to Mountain (dashed) ---
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(52, 128);
  ctx.quadraticCurveTo(70, 115, 85, 100);
  ctx.quadraticCurveTo(105, 80, 125, 65);
  ctx.quadraticCurveTo(145, 50, 160, 35);
  ctx.stroke();
  ctx.setLineDash([]);

  // --- ANCIENT GATE marker on the path ---
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(128, 60, 3, 6);
  ctx.fillRect(133, 60, 3, 6);
  ctx.fillRect(127, 59, 10, 2);
  ctx.fillStyle = '#6B5040';
  ctx.font = '4px Arial';
  ctx.fillText('Gate', 131, 70);

  // --- FAIRY RING (small detail near palace) ---
  ctx.strokeStyle = 'rgba(180, 140, 255, 0.5)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.arc(60, 140, 5, 0, Math.PI * 2);
  ctx.stroke();

  // --- DRAGON ROOST (small island in ocean) ---
  ctx.fillStyle = '#C0A878';
  ctx.beginPath();
  ctx.ellipse(20, 42, 7, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8B6040';
  ctx.font = '4px Arial';
  ctx.fillText('Dragon', 20, 40);
  ctx.fillText('Isle', 20, 46);

  // --- FAR CITY (top-left, across the sea) ---
  ctx.fillStyle = '#D4A860';
  [[22, 18], [27, 16], [32, 19]].forEach(([x, y]) => {
    ctx.fillRect(x - 1, y, 3, 3);
    ctx.beginPath();
    ctx.moveTo(x - 2, y); ctx.lineTo(x + 0.5, y - 3); ctx.lineTo(x + 3, y);
    ctx.closePath(); ctx.fill();
  });
  ctx.fillStyle = '#8B6A30';
  ctx.font = '4px Arial';
  ctx.fillText('Sunhaven', 27, 27);

  // --- Labels ---
  ctx.fillStyle = '#5C3A1E';
  ctx.font = 'bold 7px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Crystal Palace', 45, 150);
  ctx.fillStyle = '#4A0020';
  ctx.font = 'bold 7px Arial';
  ctx.fillText('Nightmare', 168, 50);
  ctx.fillText('Village', 168, 58);

  // --- FANG VILLAGE (dark wolf forest, south of mountain) ---
  // Dense dark forest surrounding the village
  ctx.fillStyle = '#1A4A12';
  const fangTrees = [
    [130, 108], [138, 104], [145, 110], [152, 106], [160, 112],
    [125, 115], [133, 118], [140, 114], [148, 120], [155, 116],
    [162, 118], [168, 108], [172, 114], [128, 122], [136, 126],
    [144, 124], [152, 128], [160, 126], [166, 122], [174, 120],
    [132, 132], [140, 130], [148, 134], [156, 132], [164, 130],
  ];
  fangTrees.forEach(([x, y]) => {
    ctx.fillStyle = ['#1A4A12', '#0E3A0A', '#1A3010'][Math.floor(Math.random() * 3)];
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 3); ctx.lineTo(x, y - 5); ctx.lineTo(x + 4, y + 3);
    ctx.closePath(); ctx.fill();
  });
  // Village huts (small, dark)
  ctx.fillStyle = '#4A3030';
  [[145, 118], [152, 120], [148, 124]].forEach(([x, y]) => {
    ctx.fillRect(x - 2, y - 1, 4, 3);
    ctx.fillStyle = '#2A1010';
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 1); ctx.lineTo(x, y - 4); ctx.lineTo(x + 3, y - 1);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4A3030';
  });
  // Wolf paw mark
  ctx.fillStyle = 'rgba(100, 50, 50, 0.5)';
  ctx.beginPath(); ctx.arc(148, 128, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(145, 124, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(148, 123, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(151, 124, 1.5, 0, Math.PI * 2); ctx.fill();
  // Label
  ctx.fillStyle = '#4A1010';
  ctx.font = 'bold 5px Arial';
  ctx.fillText('Fang', 148, 138);
  ctx.fillText('Village', 148, 143);
  // Question mark (mysterious)
  ctx.fillStyle = '#8A2020';
  ctx.font = 'bold 7px Arial';
  ctx.fillText('?', 162, 136);

  // --- COMPASS ROSE (bottom-right) ---
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 1;
  const cx2 = 218, cy2 = 148;
  // Diamond shape
  ctx.beginPath();
  ctx.moveTo(cx2, cy2 - 10); ctx.lineTo(cx2 + 3, cy2);
  ctx.lineTo(cx2, cy2 + 10); ctx.lineTo(cx2 - 3, cy2);
  ctx.closePath();
  ctx.strokeStyle = '#8B4513';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx2 - 10, cy2); ctx.lineTo(cx2, cy2 - 3);
  ctx.lineTo(cx2 + 10, cy2); ctx.lineTo(cx2, cy2 + 3);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = '#8B4513';
  ctx.font = 'bold 6px Arial';
  ctx.fillText('N', cx2, cy2 - 12);
  ctx.font = '5px Arial';
  ctx.fillText('S', cx2, cy2 + 16);
  ctx.fillText('E', cx2 + 14, cy2 + 2);
  ctx.fillText('W', cx2 - 14, cy2 + 2);

  // --- MAP TITLE ---
  ctx.fillStyle = '#5C3A1E';
  ctx.font = 'bold 8px Arial';
  ctx.fillText('The Kingdom of Fantasy', 120, 14);

  return canvas;
}

function generateWizardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 80;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  const cx = 40;
  const baseY = 118;

  // Robe (dark purple/black)
  const robeGrad = ctx.createLinearGradient(cx, baseY - 70, cx, baseY);
  robeGrad.addColorStop(0, '#2C1040');
  robeGrad.addColorStop(0.5, '#1A0828');
  robeGrad.addColorStop(1, '#0D0414');
  ctx.fillStyle = robeGrad;
  ctx.strokeStyle = '#3C1858';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 10, baseY - 65);
  ctx.lineTo(cx - 24, baseY - 2);
  ctx.quadraticCurveTo(cx, baseY + 2, cx + 24, baseY - 2);
  ctx.lineTo(cx + 10, baseY - 65);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Robe trim (eerie green glow)
  ctx.strokeStyle = '#40E040';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(cx - 22, baseY - 5);
  ctx.quadraticCurveTo(cx, baseY, cx + 22, baseY - 5);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Belt with skull buckle
  ctx.fillStyle = '#1A0828';
  ctx.fillRect(cx - 12, baseY - 40, 24, 4);
  ctx.fillStyle = '#C0C0C0';
  ctx.beginPath();
  ctx.arc(cx, baseY - 38, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1A0828';
  ctx.beginPath();
  ctx.arc(cx - 1.5, baseY - 39, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 1.5, baseY - 39, 1, 0, Math.PI * 2);
  ctx.fill();

  // Sleeves/arms
  ctx.fillStyle = '#2C1040';
  ctx.beginPath();
  ctx.ellipse(cx - 16, baseY - 55, 7, 14, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 16, baseY - 55, 7, 14, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Hands (bony, pale)
  ctx.fillStyle = '#C8B8A0';
  ctx.beginPath();
  ctx.arc(cx - 18, baseY - 42, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 18, baseY - 42, 4, 0, Math.PI * 2);
  ctx.fill();
  // Long fingers
  ctx.strokeStyle = '#C8B8A0';
  ctx.lineWidth = 1.5;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + 18 + i * 2, baseY - 42);
    ctx.lineTo(cx + 20 + i * 3, baseY - 36);
    ctx.stroke();
  }

  // Head
  ctx.fillStyle = '#D8C8B0';
  ctx.strokeStyle = '#A09080';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 78, 11, 13, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Wizard hat (tall, pointed, dark)
  ctx.fillStyle = '#1A0828';
  ctx.strokeStyle = '#3C1858';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 16, baseY - 85);
  ctx.lineTo(cx + 3, baseY - 118);
  ctx.lineTo(cx + 16, baseY - 85);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Hat brim
  ctx.fillStyle = '#2C1040';
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 85, 20, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3C1858';
  ctx.stroke();
  // Hat band with glowing symbol
  ctx.fillStyle = '#40E040';
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(cx + 2, baseY - 92, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // RED EYES (the spooky signature!)
  ctx.fillStyle = '#FF0000';
  ctx.shadowColor = '#FF0000';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.ellipse(cx - 5, baseY - 80, 3, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + 5, baseY - 80, 3, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Glowing pupils (darker red center)
  ctx.fillStyle = '#880000';
  ctx.beginPath();
  ctx.arc(cx - 5, baseY - 80, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 5, baseY - 80, 1.5, 0, Math.PI * 2);
  ctx.fill();
  // Eye glow highlights
  ctx.fillStyle = '#FF6666';
  ctx.beginPath();
  ctx.arc(cx - 4, baseY - 81, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 6, baseY - 81, 0.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // SPOOKY SMILE
  ctx.strokeStyle = '#2C0000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, baseY - 73, 6, 0.15, Math.PI - 0.15);
  ctx.stroke();
  // Smile is wide and slightly upturned at edges
  ctx.strokeStyle = '#4A0000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 6, baseY - 74);
  ctx.quadraticCurveTo(cx - 8, baseY - 76, cx - 7, baseY - 77);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 6, baseY - 74);
  ctx.quadraticCurveTo(cx + 8, baseY - 76, cx + 7, baseY - 77);
  ctx.stroke();

  // Nose (hooked)
  ctx.strokeStyle = '#A09080';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, baseY - 79);
  ctx.quadraticCurveTo(cx + 3, baseY - 76, cx + 1, baseY - 74);
  ctx.stroke();

  // Eyebrows (thick, angled menacingly)
  ctx.strokeStyle = '#4A3A2A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 8, baseY - 84);
  ctx.lineTo(cx - 3, baseY - 85);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 3, baseY - 85);
  ctx.lineTo(cx + 8, baseY - 84);
  ctx.stroke();

  // Staff in right hand
  ctx.strokeStyle = '#4A3020';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx + 22, baseY - 5);
  ctx.lineTo(cx + 16, baseY - 95);
  ctx.stroke();
  // Orb on staff
  ctx.fillStyle = '#40E040';
  ctx.shadowColor = '#40E040';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx + 15, baseY - 98, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Orb inner glow
  ctx.fillStyle = '#80FF80';
  ctx.beginPath();
  ctx.arc(cx + 14, baseY - 99, 2, 0, Math.PI * 2);
  ctx.fill();

  // Dark aura around wizard
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#2C0040';
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 55, 35, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  return canvas;
}

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Generate Dax sprite sheet
    const totalFrames = 6;
    const canvas = document.createElement('canvas');
    canvas.width = FRAME_W * totalFrames;
    canvas.height = FRAME_H;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < totalFrames; i++) {
      drawCatFrame(ctx, i, i * FRAME_W);
    }
    this.textures.addSpriteSheet('dax', canvas, {
      frameWidth: FRAME_W,
      frameHeight: FRAME_H
    });

    // Generate background textures
    this.textures.addCanvas('bg-sky', generateSkyTexture());
    this.textures.addCanvas('bg-hills', generateHillsTexture());
    this.textures.addCanvas('bg-trees', generateTreesTexture());
    this.textures.addCanvas('ground-tile', generateGroundTexture());
    this.textures.addCanvas('river-sign', generateRiverSignTexture());

    // Generate fish spritesheet
    const fishCanvas = generateFishTexture();
    this.textures.addSpriteSheet('fish', fishCanvas, {
      frameWidth: 32,
      frameHeight: 16
    });
    this.anims.create({
      key: 'fish-swim',
      frames: this.anims.generateFrameNumbers('fish', { start: 0, end: 1 }),
      frameRate: 4,
      repeat: -1
    });

    // Generate knockable object textures
    const knockables = generateKnockableTextures();
    this.textures.addCanvas('knockable-vase', knockables.vase);
    this.textures.addCanvas('knockable-milk', knockables.milk);
    this.textures.addCanvas('knockable-yarn', knockables.yarn);
    this.textures.addCanvas('knockable-books', knockables.books);
    this.textures.addCanvas('knockable-mug', knockables.mug);

    // Generate dragon texture
    this.textures.addCanvas('dragon', generateDragonTexture());

    // Flying game textures
    this.textures.addCanvas('flying-dragon', generateFlyingDragonTexture());
    const obstacles = generateFlyingObstacles();
    this.textures.addCanvas('obstacle-tree', obstacles.tree);
    this.textures.addCanvas('obstacle-mountain', obstacles.mountain);
    this.textures.addCanvas('obstacle-house', obstacles.house);
    this.textures.addCanvas('obstacle-cloud', obstacles.cloud);
    this.textures.addCanvas('crystal-palace', generateCastleTexture());

    // Generate NPC cat textures
    // Mom — gray/white cat with apron
    this.textures.addCanvas('cat-mom', generateNpcCat('#C0C0C8', '#9898A0', '#D4A0A0', 'apron'));
    // Brother (Tom) — darker orange tabby with bowtie
    this.textures.addCanvas('cat-brother', generateNpcCat('#D49040', '#A06820', '#D08060', 'bowtie'));
    // Neighbor cats
    this.textures.addCanvas('cat-neighbor1', generateNpcCat('#2C2C2C', '#1A1A1A', '#4A3040', 'none'));  // black cat
    this.textures.addCanvas('cat-neighbor2', generateNpcCat('#F0F0F0', '#D0D0D0', '#E0B0B0', 'none'));  // white cat

    // Palace scene textures
    this.textures.addCanvas('fairy-queen', generateFairyQueenTexture());
    this.textures.addCanvas('gnome', generateGnomeTexture());
    this.textures.addCanvas('pixie', generatePixieTexture());
    this.textures.addCanvas('giant', generateGiantTexture());
    this.textures.addCanvas('magic-wolf', generateMagicWolfTexture());
    this.textures.addCanvas('quest-map', generateMapTexture());
    this.textures.addCanvas('wizard', generateWizardTexture());

    // Register animations
    createAnimations(this);

    this.scene.start('TitleScene');
  }
}
