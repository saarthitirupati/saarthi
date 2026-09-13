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
  category?: string;
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
  crowdSummary?: string;
  updatedTime?: string;
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

function drawCarIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  // Roof
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.55, cy - size * 0.08);
  ctx.lineTo(cx - size * 0.32, cy - size * 0.62);
  ctx.lineTo(cx + size * 0.32, cy - size * 0.62);
  ctx.lineTo(cx + size * 0.55, cy - size * 0.08);
  ctx.closePath();
  ctx.fill();
  // Body
  drawRoundedRect(ctx, cx - size * 0.82, cy - size * 0.1, size * 1.64, size * 0.58, size * 0.18);
  ctx.fill();
  // Wheels
  ctx.fillStyle = '#061E14';
  ctx.beginPath();
  ctx.arc(cx - size * 0.44, cy + size * 0.48, size * 0.2, 0, Math.PI * 2);
  ctx.arc(cx + size * 0.44, cy + size * 0.48, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSunIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * size * 0.62, cy + Math.sin(angle) * size * 0.62);
    ctx.lineTo(cx + Math.cos(angle) * size * 0.9, cy + Math.sin(angle) * size * 0.9);
    ctx.stroke();
  }
  ctx.restore();
}

function drawShieldCheckIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.8);
  ctx.lineTo(cx + size * 0.72, cy - size * 0.48);
  ctx.lineTo(cx + size * 0.72, cy + size * 0.12);
  ctx.bezierCurveTo(cx + size * 0.72, cy + size * 0.68, cx, cy + size * 0.92, cx, cy + size * 0.92);
  ctx.bezierCurveTo(cx, cy + size * 0.92, cx - size * 0.72, cy + size * 0.68, cx - size * 0.72, cy + size * 0.12);
  ctx.lineTo(cx - size * 0.72, cy - size * 0.48);
  ctx.closePath();
  ctx.fill();
  // White checkmark inside
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.32, cy + size * 0.05);
  ctx.lineTo(cx - size * 0.05, cy + size * 0.32);
  ctx.lineTo(cx + size * 0.36, cy - size * 0.22);
  ctx.stroke();
  ctx.restore();
}

function drawNamamIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  // Gold decorative circle aura
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.9, 0, Math.PI * 2);
  ctx.stroke();
  // White outer U-shape / Tiruman
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.4, cy - size * 0.55);
  ctx.lineTo(cx - size * 0.4, cy + size * 0.15);
  ctx.bezierCurveTo(cx - size * 0.4, cy + size * 0.58, cx + size * 0.4, cy + size * 0.58, cx + size * 0.4, cy + size * 0.15);
  ctx.lineTo(cx + size * 0.4, cy - size * 0.55);
  ctx.stroke();
  // Red center Srichurnam (Tilak)
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.moveTo(cx - 2.5, cy - size * 0.75);
  ctx.lineTo(cx + 2.5, cy - size * 0.75);
  ctx.lineTo(cx + 2.5, cy + size * 0.4);
  ctx.lineTo(cx - 2.5, cy + size * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1️⃣ GENERATE: TODAY IN TIRUMALA CARD (Standardized Information Architecture)
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

  const isTe = data.lang === 'te';
  const marginX = 72;

  // 1. Outer Deep Emerald Spiritual Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#04160E');
  bgGrad.addColorStop(0.25, '#072418');
  bgGrad.addColorStop(0.65, '#051E14');
  bgGrad.addColorStop(1, '#020C07');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Top Right Golden Temple Aura
  const aura = ctx.createRadialGradient(880, 130, 20, 880, 130, 440);
  aura.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, 500);

  // Scriptural Calligraphy in Top Right: "Govinda Govinda"
  ctx.save();
  ctx.fillStyle = 'rgba(253, 230, 138, 0.55)';
  ctx.font = 'italic 300 32px Georgia, serif';
  ctx.textAlign = 'right';
  ctx.fillText('Govinda', 1008, 62);
  ctx.fillText('Govinda', 1030, 96);
  ctx.restore();

  // 2. TOP BRANDING (Saarthi Pilgrim Companion)
  drawNamamIcon(ctx, marginX + 22, 68, 22);

  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 38px Georgia, serif';
  ctx.fillText('Saarthi', marginX + 58, 68);

  ctx.fillStyle = '#FDE68A';
  ctx.font = '800 12px system-ui, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('PILGRIM COMPANION', marginX + 60, 88);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 10.5px system-ui, sans-serif';
  ctx.letterSpacing = '2.5px';
  ctx.fillText('PLAN  •  TRAVEL  •  EXPERIENCE  •  REPEAT', marginX + 60, 110);
  ctx.restore();

  // 3. TIRUMALA TODAY HEADER + LIVE UPDATE BADGE
  const headerY = 146;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.font = '900 46px -apple-system, system-ui, sans-serif';
  ctx.letterSpacing = '0.5px';

  if (isTe) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('నేటి తిరుమల ', marginX, headerY + 40);
    const teMetrics = ctx.measureText('నేటి తిరుమల ');
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('సమాచారం', marginX + teMetrics.width, headerY + 40);
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('TIRUMALA ', marginX, headerY + 40);
    const wTitle = ctx.measureText('TIRUMALA ');
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('TODAY', marginX + wTitle.width, headerY + 40);
  }

  // Exact Date: Sunday, 13 September 2026
  const now = new Date();
  const fullDate = now.toLocaleDateString(isTe ? 'te-IN' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  ctx.fillStyle = '#F8FAFC';
  ctx.font = `700 22px ${INDIC_FONT}`;
  ctx.fillText(`📅  ${fullDate}`, marginX, headerY + 76);

  // Factual Crowd & Day Rush subtitle
  const cleanStatus = data.statusHeadline
    ? data.statusHeadline.replace(/^[•\s-]+/, '').trim()
    : `${data.dayName} Rush`;
  const crowdText = data.crowdSummary || cleanStatus;

  ctx.fillStyle = '#CBD5E1';
  ctx.font = `600 18px ${INDIC_FONT}`;
  ctx.fillText(`👥  ${crowdText}`, marginX, headerY + 106);
  ctx.restore();

  // Live Update Box (Right)
  const liveBoxW = 236;
  const liveBoxH = 74;
  const liveBoxX = width - marginX - liveBoxW;
  const liveBoxY = headerY + 18;

  ctx.save();
  ctx.fillStyle = 'rgba(6, 78, 59, 0.65)';
  drawRoundedRect(ctx, liveBoxX, liveBoxY, liveBoxW, liveBoxH, 16);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.8;
  drawRoundedRect(ctx, liveBoxX, liveBoxY, liveBoxW, liveBoxH, 16);
  ctx.stroke();

  // Glowing Green Dot
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(liveBoxX + 26, liveBoxY + 26, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 18px ${INDIC_FONT}`;
  ctx.letterSpacing = '0.5px';
  ctx.fillText(isTe ? 'లైవ్ అప్‌డేట్' : 'LIVE UPDATE', liveBoxX + 42, liveBoxY + 32);

  const updatedTime = data.updatedTime || now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  ctx.fillStyle = '#A7F3D0';
  ctx.font = `600 13px ${INDIC_FONT}`;
  ctx.fillText(`${isTe ? 'తాజా సమయం:' : 'Last updated:'} ${updatedTime}`, liveBoxX + 24, liveBoxY + 56);
  ctx.restore();

  // 4. THREE STANDALONE QUEUE CARDS
  const cardsStartY = headerY + 130;
  const cardW = width - 2 * marginX;
  const cardH = 175;
  const cardGap = 16;

  const defaultCategories = [
    isTe ? 'భక్తులందరికీ' : 'For all devotees',
    isTe ? '₹300 టికెట్ ఉన్నవారికి' : 'For ₹300 ticket holders',
    isTe ? 'SSD (సమయ స్లాట్)' : 'SSD (Time-Slotted)'
  ];

  data.queues.forEach((q, idx) => {
    const qY = cardsStartY + idx * (cardH + cardGap);
    const qX = marginX;

    // Card Body (Clean White with Soft Status Tint)
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, qX, qY, cardW, cardH, 20);
    ctx.fill();

    // Colored Border
    ctx.strokeStyle = q.color === '#E11D48' ? '#FECDD3' : '#FDE68A';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, qX, qY, cardW, cardH, 20);
    ctx.stroke();

    // Left Vertical Accent Bar
    ctx.fillStyle = q.color;
    drawRoundedRect(ctx, qX, qY, 10, cardH, 5);
    ctx.fill();

    // Left Rounded Icon Box
    const iconBoxSize = 68;
    const iconBoxX = qX + 26;
    const iconBoxY = qY + (cardH - iconBoxSize) / 2;
    ctx.fillStyle = q.color === '#E11D48' ? '#FFE4E6' : '#FEF3C7';
    drawRoundedRect(ctx, iconBoxX, iconBoxY, iconBoxSize, iconBoxSize, 16);
    ctx.fill();
    ctx.strokeStyle = q.color;
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, iconBoxX, iconBoxY, iconBoxSize, iconBoxSize, 16);
    ctx.stroke();

    const iconCenterX = iconBoxX + iconBoxSize / 2;
    const iconCenterY = iconBoxY + iconBoxSize / 2;
    if (idx === 0) {
      drawUsersIcon(ctx, iconCenterX, iconCenterY, 16, q.color);
    } else if (idx === 1) {
      drawZapIcon(ctx, iconCenterX, iconCenterY, 16, q.color);
    } else {
      drawTicketIcon(ctx, iconCenterX, iconCenterY, 16, q.color);
    }

    // Titles Column
    const textX = iconBoxX + iconBoxSize + 18;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = `800 29px ${INDIC_FONT}`;
    ctx.fillText(q.name, textX, qY + 48);

    ctx.fillStyle = '#334155';
    ctx.font = `600 19px ${INDIC_FONT}`;
    ctx.fillText(q.subtitle, textX, qY + 84);

    const cat = q.category || defaultCategories[idx] || '';
    ctx.fillStyle = '#64748B';
    ctx.font = `500 15px ${INDIC_FONT}`;
    ctx.fillText(cat, textX, qY + 116);

    // Middle-Right: EST. WAIT TIME + Giant Hero Number
    const waitColX = qX + cardW - 370;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748B';
    ctx.font = `700 13px system-ui, sans-serif`;
    ctx.letterSpacing = '0.8px';
    ctx.fillText(isTe ? 'నిరీక్షణ సమయం' : 'EST. WAIT TIME', waitColX, qY + 48);

    // Format wait hours cleanly
    let waitText = q.wait;
    if (!/hour|hr|గంట/i.test(waitText)) {
      waitText = `${waitText} Hours`;
    }
    ctx.fillStyle = q.color;
    ctx.font = '900 40px -apple-system, system-ui, sans-serif';
    ctx.letterSpacing = '-0.5px';
    ctx.fillText(waitText, waitColX, qY + 98);

    // Far Right: Status Badge & 5-Step Meter
    const badgeW = 120;
    const badgeH = 34;
    const badgeX = qX + cardW - badgeW - 24;
    const badgeY = qY + 36;

    // Solid Status Badge
    ctx.fillStyle = q.color;
    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 8);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 15.5px system-ui, sans-serif';
    ctx.letterSpacing = '0.8px';
    ctx.fillText(q.label, badgeX + badgeW / 2, badgeY + 23);

    // 5 Meter Bars directly under the badge
    const barCount = 5;
    const barW = 18;
    const barH = 15;
    const barGap = 6;
    const totalBarsW = barCount * barW + (barCount - 1) * barGap;
    const barsStartX = badgeX + (badgeW - totalBarsW) / 2;
    const barsY = badgeY + 46;

    for (let b = 1; b <= barCount; b++) {
      ctx.fillStyle = b <= q.meter ? q.color : 'rgba(15, 23, 42, 0.14)';
      drawRoundedRect(ctx, barsStartX + (b - 1) * (barW + barGap), barsY, barW, barH, 3);
      ctx.fill();
    }

    ctx.restore();
  });

  // 5. BOTTOM UTILITY STRIP (3 Rounded Glass Capsules)
  const utilityY = cardsStartY + 3 * (cardH + cardGap) + 14;
  const pillGap = 18;
  const pillW = (cardW - 2 * pillGap) / 3;
  const pillH = 72;

  // Pill 1: Ghats Open
  const p1X = marginX;
  ctx.save();
  ctx.fillStyle = 'rgba(6, 78, 59, 0.55)';
  drawRoundedRect(ctx, p1X, utilityY, pillW, pillH, 16);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, p1X, utilityY, pillW, pillH, 16);
  ctx.stroke();

  drawCarIcon(ctx, p1X + 38, utilityY + pillH / 2, 16, '#34D399');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ECFDF5';
  ctx.font = `700 18px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'ఘాట్ రోడ్లు ఓపెన్' : 'Ghats Open', p1X + 68, utilityY + 32);
  ctx.fillStyle = '#A7F3D0';
  ctx.font = `500 12.5px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'అలిపిరి & శ్రీవారి మెట్టు' : 'Both Alipiri & Srivari Mettu', p1X + 68, utilityY + 54);
  ctx.restore();

  // Pill 2: Weather
  const p2X = p1X + pillW + pillGap;
  ctx.save();
  ctx.fillStyle = 'rgba(120, 53, 15, 0.4)';
  drawRoundedRect(ctx, p2X, utilityY, pillW, pillH, 16);
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, p2X, utilityY, pillW, pillH, 16);
  ctx.stroke();

  drawSunIcon(ctx, p2X + 38, utilityY + pillH / 2, 16, '#FBBF24');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFBEB';
  ctx.font = '700 20px system-ui, sans-serif';
  ctx.fillText(data.weatherTemp || '32°C', p2X + 68, utilityY + 32);
  ctx.fillStyle = '#FDE68A';
  ctx.font = `500 12.5px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'ఆహ్లాదకర వాతావరణం' : 'Clear Skies', p2X + 68, utilityY + 54);
  ctx.restore();

  // Pill 3: Source: TTD (Verified Information)
  const p3X = p2X + pillW + pillGap;
  ctx.save();
  ctx.fillStyle = 'rgba(6, 78, 59, 0.55)';
  drawRoundedRect(ctx, p3X, utilityY, pillW, pillH, 16);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, p3X, utilityY, pillW, pillH, 16);
  ctx.stroke();

  drawShieldCheckIcon(ctx, p3X + 38, utilityY + pillH / 2, 16, '#34D399');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ECFDF5';
  ctx.font = `700 18px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'మూలం: TTD' : 'Source: TTD', p3X + 68, utilityY + 32);
  ctx.fillStyle = '#A7F3D0';
  ctx.font = `500 12.5px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'ధృవీకరించిన సమాచారం' : 'Verified Information', p3X + 68, utilityY + 54);
  ctx.restore();

  // 6. CALL TO ACTION HOOK & WEBSITE SEARCH PILL
  const ctaY = utilityY + pillH + 20;
  const ctaBoxW = 560;
  const ctaBoxH = 78;

  // Left Gold CTA Box
  ctx.save();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
  drawRoundedRect(ctx, marginX, ctaY, ctaBoxW, ctaBoxH, 18);
  ctx.fill();
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, marginX, ctaY, ctaBoxW, ctaBoxH, 18);
  ctx.stroke();

  // Hands Folded Emoji
  ctx.font = '30px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🙏', marginX + 42, ctaY + 49);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FEF08A';
  ctx.font = `800 20px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'ఈరోజు దర్శనానికి వెళ్తున్నారా?' : 'Planning Darshan Today?', marginX + 78, ctaY + 32);
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `500 14.5px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'వెళ్లేముందు లైవ్ క్యూ సమయం చూసుకోండి.' : 'Check the queue before you go.', marginX + 78, ctaY + 58);
  ctx.restore();

  // Right Side Micro-Brand
  ctx.save();
  const rightSideCenterX = marginX + ctaBoxW + (cardW - ctaBoxW) / 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#CBD5E1';
  ctx.font = `600 14px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'మీ ప్రశాంత తిరుమల యాత్రకు' : 'Your Guide to a Meaningful', rightSideCenterX, ctaY + 30);
  ctx.fillText(isTe ? 'సంపూర్ణ డిజిటల్ తోడు' : 'Tirumala Yatra', rightSideCenterX, ctaY + 52);

  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText('🪷', rightSideCenterX, ctaY + 74);
  ctx.restore();

  // Center Search Pill: saarthiguide.in ➔
  const searchY = ctaY + ctaBoxH + 16;
  const searchW = 560;
  const searchH = 54;

  ctx.save();
  ctx.fillStyle = 'rgba(4, 22, 15, 0.95)';
  drawRoundedRect(ctx, marginX, searchY, searchW, searchH, 27);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, marginX, searchY, searchW, searchH, 27);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('🔍   saarthiguide.in   ➔', marginX + searchW / 2, searchY + 35);
  ctx.restore();

  // 7. SUB-FOOTER BAR (Icon Category Links & Hashtag)
  const footBarY = searchY + searchH + 28;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(marginX, footBarY);
  ctx.lineTo(width - marginX, footBarY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#94A3B8';
  ctx.font = `600 13px ${INDIC_FONT}`;
  ctx.fillText(
    isTe
      ? '📱 లైవ్ అప్‌డేట్స్   •   🛕 ప్రయాణ మార్గదర్శి   •   📖 పుణ్యక్షేత్రాలు   •   👥 ఆధ్యాత్మికం   |   #SaarthiTirupati'
      : '📱 Live Updates   •   🛕 Travel Guidance   •   📖 Nearby Places   •   👥 Spiritual Content   |   #SaarthiTirupati',
    width / 2,
    footBarY + 32
  );
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
