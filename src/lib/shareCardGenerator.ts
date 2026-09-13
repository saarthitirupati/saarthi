/**
 * 🎨 Saarthi First-Principles Shareable Card Generator
 * 
 * Uses 100% native HTML5 Canvas 2D API (zero external dependencies, 0 KB bundle weight).
 * Generates ultra-crisp 2x Retina PNG cards for WhatsApp, Instagram, and social sharing:
 * 
 * 1. 🛕 TODAY IN TIRUMALA CARD (Replicating exact high-contrast native UI from Image 1)
 * 2. 📿 JAPA MALA BEAD / MILESTONE / POORTHI CARD (Deep sanctum emerald & gold shrine)
 */

export interface DarshanQueueData {
  name: string;
  subtitle: string;
  wait: string;
  label: string;
  meter: number; // 1 to 5
  color: string;
  bg: string;
}

export interface TodayPulseCardData {
  dateStr: string;
  dayName: string;
  statusHeadline: string;
  queues: DarshanQueueData[];
  weatherTemp: string;
  ghatsOpen?: boolean;
  lang: 'te' | 'en';
}

export interface JapaShareCardData {
  type: 'bead' | 'milestone' | 'poorthi';
  beadNumber: number;
  namaTe: string;
  namaEn: string;
  blessingTe: string;
  blessingEn: string;
  completedMalas?: number;
  lang: 'te' | 'en';
}

// ─────────────────────────────────────────────────────────────────────────────
// 🎨 SAFE CANVAS PATH PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

const INDIC_FONT = '"Noto Sans Telugu", "Nirmala UI", "Segoe UI", system-ui, -apple-system, sans-serif';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  if (!text) return y;
  const paragraphs = text.split('\n');
  let curY = y;

  for (let p = 0; p < paragraphs.length; p++) {
    const words = paragraphs[p].split(' ').filter(Boolean);
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line ? `${line} ${words[n]}` : words[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n];
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, curY);
      curY += lineHeight;
    }
  }
  return curY;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      if (typeof canvas.toBlob === 'function') {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(canvasDataURLToBlob(canvas));
          }
        }, 'image/png');
      } else {
        resolve(canvasDataURLToBlob(canvas));
      }
    } catch {
      resolve(canvasDataURLToBlob(canvas));
    }
  });
}

function canvasDataURLToBlob(canvas: HTMLCanvasElement): Blob | null {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const parts = dataUrl.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 VECTOR ICON DRAWING PRIMITIVES (Zero OS Emoji Inconsistencies)
// ─────────────────────────────────────────────────────────────────────────────

function drawFlameIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.bezierCurveTo(cx + size * 0.6, cy - size * 0.3, cx + size * 0.8, cy + size * 0.4, cx, cy + size);
  ctx.bezierCurveTo(cx - size * 0.8, cy + size * 0.4, cx - size * 0.6, cy - size * 0.3, cx, cy - size);
  ctx.fill();

  // Inner flame highlight
  ctx.fillStyle = '#FEF08A';
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.3);
  ctx.bezierCurveTo(cx + size * 0.3, cy + size * 0.1, cx + size * 0.4, cy + size * 0.6, cx, cy + size * 0.85);
  ctx.bezierCurveTo(cx - size * 0.4, cy + size * 0.6, cx - size * 0.3, cy + size * 0.1, cx, cy - size * 0.3);
  ctx.fill();
  ctx.restore();
}

function drawUsersIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  // Center head
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.35, size * 0.32, 0, Math.PI * 2);
  ctx.fill();
  // Center torso
  ctx.beginPath();
  ctx.arc(cx, cy + size * 0.75, size * 0.65, Math.PI, 0);
  ctx.fill();

  // Left companion head & shoulder
  ctx.beginPath();
  ctx.arc(cx - size * 0.65, cy - size * 0.2, size * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - size * 0.65, cy + size * 0.8, size * 0.45, Math.PI, 0);
  ctx.fill();

  // Right companion head & shoulder
  ctx.beginPath();
  ctx.arc(cx + size * 0.65, cy - size * 0.2, size * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + size * 0.65, cy + size * 0.8, size * 0.45, Math.PI, 0);
  ctx.fill();
  ctx.restore();
}

function drawZapIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.15, cy - size);
  ctx.lineTo(cx - size * 0.75, cy + size * 0.05);
  ctx.lineTo(cx - size * 0.05, cy + size * 0.05);
  ctx.lineTo(cx - size * 0.25, cy + size);
  ctx.lineTo(cx + size * 0.75, cy - size * 0.15);
  ctx.lineTo(cx + size * 0.05, cy - size * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTicketIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  const w = size * 1.6;
  const h = size * 1.1;
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.arc(x + w, cy, size * 0.28, -Math.PI / 2, Math.PI / 2, true);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.arc(x, cy, size * 0.28, Math.PI / 2, -Math.PI / 2, true);
  ctx.closePath();
  ctx.fill();

  // Cut line
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(cx, y + 4);
  ctx.lineTo(cx, y + h - 4);
  ctx.stroke();
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1️⃣ GENERATE: TODAY IN TIRUMALA CARD (Exact Image 1 Spec)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateTodayInTirumalaCard(data: TodayPulseCardData): Promise<Blob | null> {
  if (typeof window === 'undefined') return null;

  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Outer Dark Emerald Canvas Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#04160F');
  bgGrad.addColorStop(0.3, '#08251B');
  bgGrad.addColorStop(0.7, '#072016');
  bgGrad.addColorStop(1, '#020D08');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Golden Top Aura
  const aura = ctx.createRadialGradient(width / 2, 80, 20, width / 2, 80, 500);
  aura.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, 500);

  // Top App Brand Title
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FDE68A';
  ctx.font = '700 22px system-ui, -apple-system, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('✦ SAARTHI PILGRIM COMPANION ✦', width / 2, 68);
  ctx.restore();

  // 2. MAIN CARD CONTAINER (White/Ivory Glass Container with Dark Border)
  const mainX = 54;
  const mainY = 100;
  const mainW = width - 108;
  const mainH = 1080;

  // Shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 16;
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, mainX, mainY, mainW, mainH, 32);
  ctx.fill();
  ctx.restore();

  // Dark Outline Border matching UI
  ctx.save();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 3.5;
  drawRoundedRect(ctx, mainX, mainY, mainW, mainH, 32);
  ctx.stroke();
  ctx.restore();

  // 3. HEADER ROW
  const headY = mainY + 32;

  // Flame Icon Box
  const flameBoxX = mainX + 28;
  const flameBoxY = headY;
  const flameBoxSize = 64;
  ctx.save();
  ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
  drawRoundedRect(ctx, flameBoxX, flameBoxY, flameBoxSize, flameBoxSize, 16);
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, flameBoxX, flameBoxY, flameBoxSize, flameBoxSize, 16);
  ctx.stroke();
  drawFlameIcon(ctx, flameBoxX + flameBoxSize / 2, flameBoxY + flameBoxSize / 2, 16, '#D97706');
  ctx.restore();

  // Title: TODAY IN TIRUMALA
  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0F172A';
  ctx.font = '900 34px -apple-system, system-ui, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('TODAY IN TIRUMALA', flameBoxX + flameBoxSize + 18, headY + 30);

  // Subtitle: • Sunday Surge • Compartments Full
  ctx.fillStyle = '#047857';
  ctx.font = '700 22px -apple-system, system-ui, sans-serif';
  ctx.fillText(`• ${data.statusHeadline}`, flameBoxX + flameBoxSize + 18, headY + 58);
  ctx.restore();

  // LIVE Pill on Right
  const livePillW = 110;
  const livePillH = 40;
  const livePillX = mainX + mainW - livePillW - 28;
  const livePillY = headY + 12;
  ctx.save();
  ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
  drawRoundedRect(ctx, livePillX, livePillY, livePillW, livePillH, 20);
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, livePillX, livePillY, livePillW, livePillH, 20);
  ctx.stroke();

  // Green dot
  ctx.fillStyle = '#059669';
  ctx.beginPath();
  ctx.arc(livePillX + 26, livePillY + livePillH / 2, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#065F46';
  ctx.font = '800 18px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LIVE', livePillX + 66, livePillY + livePillH / 2 + 6);
  ctx.restore();

  // 4. THREE EXPRESSIVE QUEUE CARDS
  const queuesStartY = headY + 95;
  const queueCardW = mainW - 56;
  const queueCardH = 220;
  const queueGap = 24;

  data.queues.forEach((q, idx) => {
    const qY = queuesStartY + idx * (queueCardH + queueGap);
    const qX = mainX + 28;

    // Card White Body with status tint
    ctx.save();
    ctx.fillStyle = idx === 1 ? '#FFFDF5' : '#FFF7F7';
    drawRoundedRect(ctx, qX, qY, queueCardW, queueCardH, 24);
    ctx.fill();

    // Colored Border
    ctx.strokeStyle = q.color === '#E11D48' ? '#FECDD3' : '#FDE68A';
    ctx.lineWidth = 2.5;
    drawRoundedRect(ctx, qX, qY, queueCardW, queueCardH, 24);
    ctx.stroke();

    // Left Colored Vertical Indicator Strip
    ctx.fillStyle = q.color;
    drawRoundedRect(ctx, qX, qY, 12, queueCardH, 6);
    ctx.fill();

    // Left Icon Rounded Box
    const iconBoxX = qX + 32;
    const iconBoxY = qY + (queueCardH - 74) / 2;
    const iconBoxSize = 74;
    ctx.fillStyle = q.color === '#E11D48' ? '#FFE4E6' : '#FEF3C7';
    drawRoundedRect(ctx, iconBoxX, iconBoxY, iconBoxSize, iconBoxSize, 18);
    ctx.fill();
    ctx.strokeStyle = q.color;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, iconBoxX, iconBoxY, iconBoxSize, iconBoxSize, 18);
    ctx.stroke();

    // Vector Icon inside
    const iconCenterX = iconBoxX + iconBoxSize / 2;
    const iconCenterY = iconBoxY + iconBoxSize / 2;
    if (idx === 0) {
      drawUsersIcon(ctx, iconCenterX, iconCenterY, 18, q.color);
    } else if (idx === 1) {
      drawZapIcon(ctx, iconCenterX, iconCenterY, 18, q.color);
    } else {
      drawTicketIcon(ctx, iconCenterX, iconCenterY, 18, q.color);
    }

    // Card Title & Subtitle
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 32px -apple-system, system-ui, sans-serif';
    ctx.fillText(q.name, iconBoxX + iconBoxSize + 22, qY + 92);

    ctx.fillStyle = '#475569';
    ctx.font = '600 22px -apple-system, system-ui, sans-serif';
    ctx.fillText(q.subtitle, iconBoxX + iconBoxSize + 22, qY + 138);

    // Right: Wait Time (Large & Bold)
    const rightEdgeX = qX + queueCardW - 32;
    ctx.textAlign = 'right';
    ctx.fillStyle = q.color;
    ctx.font = '900 46px -apple-system, system-ui, sans-serif';
    ctx.fillText(q.wait, rightEdgeX, qY + 98);

    // Below Wait Time: 5-Step Crowd Meter + Solid Badge
    const badgeW = 145;
    const badgeH = 38;
    const badgeX = rightEdgeX - badgeW;
    const badgeY = qY + 125;

    // Solid Badge
    ctx.fillStyle = q.color;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 10);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 18px -apple-system, system-ui, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(q.label, badgeX + badgeW / 2, badgeY + 25);

    // 5 Meter Bars immediately to the left of the badge
    const barCount = 5;
    const barWidth = 7;
    const barHeight = 22;
    const barGap = 4;
    const totalBarsW = barCount * barWidth + (barCount - 1) * barGap;
    const barsStartX = badgeX - totalBarsW - 14;

    for (let b = 1; b <= barCount; b++) {
      ctx.fillStyle = b <= q.meter ? q.color : 'rgba(15, 23, 42, 0.18)';
      drawRoundedRect(ctx, barsStartX + (b - 1) * (barWidth + barGap), badgeY + 8, barWidth, barHeight, 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // 5. DIVIDER LINE
  const dividerY = queuesStartY + 3 * queueCardH + 2 * queueGap + 28;
  ctx.save();
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(mainX + 28, dividerY);
  ctx.lineTo(mainX + mainW - 28, dividerY);
  ctx.stroke();
  ctx.restore();

  // 6. FOOTER TELEMETRY PILLS (Inside Main White Card)
  const footY = dividerY + 24;
  const pillH = 54;
  const pillGap = 20;
  const halfPillW = (mainW - 56 - pillGap) / 2;

  // Weather Pill
  const pill1X = mainX + 28;
  ctx.save();
  ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
  drawRoundedRect(ctx, pill1X, footY, halfPillW, pillH, 16);
  ctx.fill();
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, pill1X, footY, halfPillW, pillH, 16);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#B45309';
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.fillText(`☀️  ${data.weatherTemp || '26°C'}`, pill1X + halfPillW / 2, footY + 35);
  ctx.restore();

  // Verified Live Pill
  const pill2X = pill1X + halfPillW + pillGap;
  ctx.save();
  ctx.fillStyle = '#F0FDF4';
  drawRoundedRect(ctx, pill2X, footY, halfPillW, pillH, 16);
  ctx.fill();
  ctx.strokeStyle = '#16A34A';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, pill2X, footY, halfPillW, pillH, 16);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#166534';
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.fillText('🛡️  Verified Live', pill2X + halfPillW / 2, footY + 35);
  ctx.restore();

  // 7. BOTTOM ATTRIBUTION & LINK (On Canvas Outside)
  const bottomY = mainY + mainH + 42;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FEF08A';
  ctx.font = '700 24px Georgia, serif';
  ctx.fillText('Live Tirumala Queue Updates & Smart Companion:', width / 2, bottomY);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '900 28px -apple-system, system-ui, sans-serif';
  ctx.fillText('👉  https://saarthiguide.in', width / 2, bottomY + 38);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = `500 18px ${INDIC_FONT}`;
  ctx.fillText('Serving Sri Venkateswara Swami Pilgrims with First-Principles Clarity', width / 2, bottomY + 70);
  ctx.restore();

  return canvasToBlob(canvas);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2️⃣ GENERATE: JAPA MALA BEAD / MILESTONE / POORTHI CARD (Image 2 Fix)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateJapaCard(data: JapaShareCardData): Promise<Blob | null> {
  if (typeof window === 'undefined') return null;

  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isPoorthi = data.type === 'poorthi';
  const isMilestone = data.type === 'milestone';

  // 1. Deep Sanctum Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#03120B');
  bgGrad.addColorStop(0.3, '#072418');
  bgGrad.addColorStop(0.7, '#051B12');
  bgGrad.addColorStop(1, '#020A07');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Golden Top Aura
  const aura = ctx.createRadialGradient(width / 2, 280, 50, width / 2, 280, 550);
  aura.addColorStop(0, isPoorthi ? 'rgba(74, 222, 128, 0.28)' : 'rgba(245, 158, 11, 0.25)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, 750);

  // 2. Ornate Double Golden Border Frame
  ctx.save();
  ctx.strokeStyle = isPoorthi ? 'rgba(74, 222, 128, 0.55)' : 'rgba(212, 175, 55, 0.55)';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 42, 42, width - 84, height - 84, 36);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(253, 224, 71, 0.25)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 54, 54, width - 108, height - 108, 30);
  ctx.stroke();

  // Corner Diamond Pins
  const drawPin = (cx: number, cy: number) => {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  };
  drawPin(64, 64);
  drawPin(width - 64, 64);
  drawPin(64, height - 64);
  drawPin(width - 64, height - 64);
  ctx.restore();

  // 3. HEADER
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F59E0B';
  ctx.font = '32px system-ui, sans-serif';
  ctx.fillText('🛕 ✨ 📿', width / 2, 115);

  ctx.fillStyle = '#FFFDF5';
  ctx.font = '700 24px Georgia, serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('SAARTHI GUIDE', width / 2, 158);

  ctx.fillStyle = isPoorthi ? '#86EFAC' : '#FDE68A';
  ctx.font = '700 20px -apple-system, system-ui, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('SRIVARI 108 SACRED JAPA MALA', width / 2, 194);
  ctx.restore();

  // 4. SACRED SANCTUM ALTAR (Center Card)
  const shrineX = 80;
  const shrineY = 230;
  const shrineW = width - 160;
  const shrineH = 800;

  // Dark Sanctum Body
  ctx.save();
  ctx.fillStyle = '#061D14';
  drawRoundedRect(ctx, shrineX, shrineY, shrineW, shrineH, 28);
  ctx.fill();

  ctx.strokeStyle = isPoorthi ? 'rgba(74, 222, 128, 0.5)' : 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, shrineX, shrineY, shrineW, shrineH, 28);
  ctx.stroke();
  ctx.restore();

  // Altar Pill Badge
  const badgeW = 380;
  const badgeH = 50;
  const badgeX = (width - badgeW) / 2;
  const badgeY = shrineY + 36;
  ctx.save();
  ctx.fillStyle = isPoorthi ? 'rgba(34, 197, 94, 0.22)' : 'rgba(245, 158, 11, 0.2)';
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 25);
  ctx.fill();
  ctx.strokeStyle = isPoorthi ? '#4ADE80' : '#F59E0B';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 25);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = isPoorthi ? '#86EFAC' : '#FDE047';
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.letterSpacing = '1.5px';
  if (isPoorthi) {
    ctx.fillText('🎉 MALA POORTHI (108/108) 🎉', width / 2, badgeY + 32);
  } else if (isMilestone) {
    ctx.fillText(`🌟 MILESTONE #${data.beadNumber} / 108 🌟`, width / 2, badgeY + 32);
  } else {
    ctx.fillText(`✦ DIVINE NAMA #${data.beadNumber} OF 108 ✦`, width / 2, badgeY + 32);
  }
  ctx.restore();

  // Dynamically flow content vertically to eliminate overlap
  let curY = shrineY + 140;

  // Holy Nama (Telugu & Sanskrit)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFDF5';
  ctx.font = `800 50px ${INDIC_FONT}`;
  ctx.shadowColor = 'rgba(245, 158, 11, 0.65)';
  ctx.shadowBlur = 22;
  curY = wrapText(ctx, data.namaTe, width / 2, curY, shrineW - 80, 62) + 14;
  ctx.restore();

  // Transliteration & English
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#CBD5E1';
  ctx.font = 'italic 500 26px -apple-system, system-ui, sans-serif';
  curY = wrapText(ctx, data.namaEn, width / 2, curY, shrineW - 100, 34) + 10;

  // Lotus Divider
  ctx.fillStyle = '#F59E0B';
  ctx.font = '24px system-ui, sans-serif';
  ctx.fillText('─── 🪷 ───', width / 2, curY);
  curY += 40;

  // Divine Blessing Title
  ctx.fillStyle = '#F59E0B';
  ctx.font = '700 20px system-ui, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('DIVINE BLESSING & ANUGRAHAM', width / 2, curY);
  curY += 36;

  // Blessing Telugu Text
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `600 28px ${INDIC_FONT}`;
  curY = wrapText(ctx, `"${data.blessingTe}"`, width / 2, curY, shrineW - 100, 44) + 14;

  // Blessing English Meaning
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'italic 500 22px -apple-system, system-ui, sans-serif';
  curY = wrapText(ctx, `"${data.blessingEn}"`, width / 2, curY, shrineW - 120, 32);
  ctx.restore();

  // 5. PROGRESS STRAND (Strictly scoped paths)
  const barY = shrineY + shrineH - 85;
  const barW = shrineW - 120;
  const barX = shrineX + 60;
  const pct = Math.min(1, data.beadNumber / 108);

  // Groove
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  drawRoundedRect(ctx, barX, barY, barW, 16, 8);
  ctx.fill();

  // Progress Fill
  const fillW = Math.max(20, barW * pct);
  const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
  barGrad.addColorStop(0, '#D97706');
  barGrad.addColorStop(0.5, '#F59E0B');
  barGrad.addColorStop(1, '#FDE047');
  ctx.fillStyle = barGrad;
  drawRoundedRect(ctx, barX, barY, fillW, 16, 8);
  ctx.fill();

  // Text above bar
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FDE047';
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.fillText(`Mala Progress: ${data.beadNumber} / 108 Beads`, barX, barY - 14);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.fillText(`${Math.round(pct * 100)}%`, barX + barW, barY - 14);
  ctx.restore();

  // 6. BOTTOM CALL TO ACTION
  const botY = shrineY + shrineH + 48;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FEF08A';
  ctx.font = '700 24px Georgia, serif';
  ctx.fillText('Chant the sacred 108 Srivari Japa Mala on Saarthi:', width / 2, botY);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '900 28px -apple-system, system-ui, sans-serif';
  ctx.fillText('👉  https://saarthiguide.in', width / 2, botY + 38);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = `500 18px ${INDIC_FONT}`;
  ctx.fillText('ఓం నమో వేంకటేశాయ • సర్వే జనాః సుఖినో భవంతు', width / 2, botY + 70);
  ctx.restore();

  return canvasToBlob(canvas);
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 NATIVE SHARING / DOWNLOAD DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────

export async function shareOrDownloadCard(
  blob: Blob,
  filename: string,
  title: string,
  text: string,
  url: string
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  let file: File;
  try {
    file = new File([blob], filename, { type: 'image/png', lastModified: Date.now() });
  } catch {
    file = Object.assign(blob.slice(0, blob.size, 'image/png'), {
      name: filename,
      lastModified: Date.now()
    }) as unknown as File;
  }

  // 1. Native Web Share API Level 2 (Android Chrome, iOS Safari)
  if (typeof navigator !== 'undefined' && navigator.share) {
    let canShareFile = false;
    try {
      canShareFile = typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });
    } catch {
      canShareFile = false;
    }

    if (canShareFile) {
      // NOTE: DO NOT pass a separate `url` property alongside `files`!
      // In WhatsApp on Android, passing `url` makes WhatsApp discard the file and treat it as a link-only share.
      // In iOS Safari, passing both `files` and `url` throws a fatal TypeError.
      const shareCaption = text ? `${text}\n\n${url}` : url;
      try {
        await navigator.share({
          files: [file],
          title,
          text: shareCaption
        });
        return true;
      } catch (err: any) {
        if (err?.name === 'AbortError') return true;
        // Fallback retry with files ONLY (maximally compatible across strict iOS/Android versions)
        try {
          await navigator.share({
            files: [file],
            title
          });
          return true;
        } catch (err2: any) {
          if (err2?.name === 'AbortError') return true;
        }
      }
    }
  }

  // 2. Desktop or Non-file Share Fallback: Clipboard + Direct Download + WhatsApp
  try {
    // A. Copy Image directly to Clipboard for instant 1-tap paste (Ctrl+V) in WhatsApp Web
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof window.ClipboardItem === 'function') {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      } catch {
        // Clipboard write might require active tab focus
      }
    }

    // B. Direct Image Download
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);

    // C. Open WhatsApp with formatted caption
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + url)}`;
    window.open(whatsappUrl, '_blank');
    return true;
  } catch {
    return false;
  }
}
