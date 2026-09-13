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
// 🖼️ OFFICIAL SAARTHI LOGO LOADER & BRANDING
// ─────────────────────────────────────────────────────────────────────────────

let cachedLogoImage: HTMLImageElement | null = null;

export function getSaarthiLogoImage(): Promise<HTMLImageElement | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (cachedLogoImage && cachedLogoImage.complete && cachedLogoImage.naturalWidth > 0) {
    return Promise.resolve(cachedLogoImage);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedLogoImage = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = '/saarthi-logo.png';
  });
}

/**
 * Draws a professional outer luxury border frame and corner cornerpins
 * around the entire canvas to give the card a prestigious, premium poster finish.
 */
function drawCardOuterFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  primaryColor: string = 'rgba(212, 175, 55, 0.4)',
  innerColor: string = 'rgba(253, 224, 71, 0.15)'
) {
  ctx.save();
  // Outer primary golden/emerald border
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 24, 24, width - 48, height - 48, 24);
  ctx.stroke();

  // Subtle inner accent line
  ctx.strokeStyle = innerColor;
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 32, 32, width - 64, height - 64, 18);
  ctx.stroke();

  // 4 Corner diamond accents
  const drawCornerAccent = (cx: number, cy: number) => {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCornerAccent(32, 32);
  drawCornerAccent(width - 32, 32);
  drawCornerAccent(32, height - 32);
  drawCornerAccent(width - 32, height - 32);
  ctx.restore();
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

function drawCalendarIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string = '#F8FAFC') {
  ctx.save();
  const w = size * 1.5;
  const h = size * 1.3;
  const x = cx - w / 2;
  const y = cy - h / 2;
  // Outer frame
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  drawRoundedRect(ctx, x, y, w, h, 3.5);
  ctx.stroke();

  // Top header bar
  ctx.fillStyle = '#E11D48';
  drawRoundedRect(ctx, x, y, w, h * 0.35, 3.5);
  ctx.fill();

  // Ring binder tabs at top
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + w * 0.22, y - 2, 2.5, 4);
  ctx.fillRect(x + w * 0.72, y - 2, 2.5, 4);

  // Calendar grid dots/lines
  ctx.fillStyle = color;
  const dotR = 1.2;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      ctx.beginPath();
      ctx.arc(x + w * 0.25 + c * (w * 0.25), y + h * 0.55 + r * (h * 0.22), dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawCrowdIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string = '#CBD5E1') {
  ctx.save();
  ctx.fillStyle = color;
  // Center head
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.3, size * 0.28, 0, Math.PI * 2);
  ctx.fill();
  // Center body
  ctx.beginPath();
  ctx.arc(cx, cy + size * 0.7, size * 0.55, Math.PI, 0);
  ctx.fill();

  // Left companion
  ctx.beginPath();
  ctx.arc(cx - size * 0.55, cy - size * 0.15, size * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - size * 0.55, cy + size * 0.75, size * 0.4, Math.PI, 0);
  ctx.fill();

  // Right companion
  ctx.beginPath();
  ctx.arc(cx + size * 0.55, cy - size * 0.15, size * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + size * 0.55, cy + size * 0.75, size * 0.4, Math.PI, 0);
  ctx.fill();
  ctx.restore();
}

function drawNamasteIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string = '#FDE047') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Left hand palm/fingers arch
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.35, cy + size * 0.7);
  ctx.lineTo(cx - size * 0.08, cy - size * 0.5);
  ctx.quadraticCurveTo(cx, cy - size * 0.85, cx + size * 0.08, cy - size * 0.5);
  ctx.lineTo(cx + size * 0.35, cy + size * 0.7);
  ctx.stroke();

  // Center joining crease
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.7);
  ctx.lineTo(cx, cy + size * 0.45);
  ctx.stroke();

  // Subtle wrist cuffs
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy + size * 0.75, size * 0.45, 0, Math.PI);
  ctx.stroke();
  ctx.restore();
}

function drawLotusIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string = '#F59E0B') {
  ctx.save();
  ctx.fillStyle = color;

  // Center petal
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.5);
  ctx.quadraticCurveTo(cx - size * 0.3, cy, cx, cy - size * 0.7);
  ctx.quadraticCurveTo(cx + size * 0.3, cy, cx, cy + size * 0.5);
  ctx.fill();

  // Left petal
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.5);
  ctx.quadraticCurveTo(cx - size * 0.6, cy + size * 0.1, cx - size * 0.65, cy - size * 0.3);
  ctx.quadraticCurveTo(cx - size * 0.25, cy - size * 0.1, cx, cy + size * 0.5);
  ctx.fill();

  // Right petal
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.5);
  ctx.quadraticCurveTo(cx + size * 0.6, cy + size * 0.1, cx + size * 0.65, cy - size * 0.3);
  ctx.quadraticCurveTo(cx + size * 0.25, cy - size * 0.1, cx, cy + size * 0.5);
  ctx.fill();

  // Base arc
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy + size * 0.45, size * 0.4, 0.1 * Math.PI, 0.9 * Math.PI);
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

  // Load official Saarthi logo icon
  const logoImg = await getSaarthiLogoImage();

  const width = 1080;
  const height = 1220;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isTe = data.lang === 'te';
  const marginX = 72;

  // 1. Deep Emerald Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#04160E');
  bgGrad.addColorStop(0.25, '#072418');
  bgGrad.addColorStop(0.65, '#051E14');
  bgGrad.addColorStop(1, '#020C07');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle golden top aura
  const aura = ctx.createRadialGradient(880, 100, 20, 880, 100, 380);
  aura.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, 400);

  // Luxury Card Outer Border Frame & Corner Pins (Covers entire image with refined finish)
  drawCardOuterFrame(ctx, width, height, 'rgba(212, 175, 55, 0.45)', 'rgba(253, 224, 71, 0.15)');

  // 2. BRANDING: OFFICIAL SAARTHI LOGO + PILGRIM COMPANION
  const logoX = marginX + 4;
  const logoY = 46;
  const logoSize = 48;

  if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.save();
    // Circular subtle glowing backdrop
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Clip circular shape so pin logo blends seamlessly
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();
  } else {
    // Elegant fallback if image asset is not ready
    drawNamamIcon(ctx, logoX + logoSize / 2, logoY + logoSize / 2, 22);
  }

  ctx.save();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 36px Georgia, serif';
  ctx.fillText('Saarthi', logoX + logoSize + 16, logoY + 28);

  ctx.fillStyle = '#FDE68A';
  ctx.font = '800 12px system-ui, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('PILGRIM COMPANION', logoX + logoSize + 18, logoY + 46);
  ctx.restore();

  // 3. TIRUMALA TODAY HEADER
  const headerY = 114;

  ctx.save();
  ctx.textAlign = 'left';
  ctx.font = '900 46px -apple-system, system-ui, sans-serif';
  ctx.letterSpacing = '0.5px';

  if (isTe) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('నేటి తిరుమల ', marginX, headerY + 40);
    const teW = ctx.measureText('నేటి తిరుమల ');
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('సమాచారం', marginX + teW.width, headerY + 40);
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('TIRUMALA ', marginX, headerY + 40);
    const wTitle = ctx.measureText('TIRUMALA ');
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('TODAY', marginX + wTitle.width, headerY + 40);
  }

  // Exact date
  const now = new Date();
  const fullDate = now.toLocaleDateString(isTe ? 'te-IN' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  drawCalendarIcon(ctx, marginX + 10, headerY + 68, 12, '#F8FAFC');
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `700 22px ${INDIC_FONT}`;
  ctx.fillText(fullDate, marginX + 28, headerY + 76);

  // Clean crowd subtitle: "Sunday • Heavy Crowd"
  const crowdText = data.crowdSummary || `${data.dayName} • Heavy Crowd`;
  drawCrowdIcon(ctx, marginX + 10, headerY + 100, 11, '#CBD5E1');
  ctx.fillStyle = '#CBD5E1';
  ctx.font = `600 18px ${INDIC_FONT}`;
  ctx.fillText(crowdText, marginX + 28, headerY + 106);
  ctx.restore();

  // 4. Compact LIVE badge (right-aligned)
  const updatedTime = data.updatedTime || now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  const liveBoxW = 180;
  const liveBoxH = 58;
  const liveBoxX = width - marginX - liveBoxW;
  const liveBoxY = headerY + 16;

  ctx.save();
  ctx.fillStyle = 'rgba(6, 78, 59, 0.65)';
  drawRoundedRect(ctx, liveBoxX, liveBoxY, liveBoxW, liveBoxH, 14);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.8;
  drawRoundedRect(ctx, liveBoxX, liveBoxY, liveBoxW, liveBoxH, 14);
  ctx.stroke();

  // Green dot
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(liveBoxX + 22, liveBoxY + 22, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 20px ${INDIC_FONT}`;
  ctx.letterSpacing = '1px';
  ctx.fillText(isTe ? 'లైవ్' : 'LIVE', liveBoxX + 38, liveBoxY + 28);

  ctx.fillStyle = '#A7F3D0';
  ctx.font = `600 13px ${INDIC_FONT}`;
  ctx.letterSpacing = '0px';
  ctx.fillText(`${isTe ? 'అప్‌డేట్' : 'Updated'} ${updatedTime}`, liveBoxX + 22, liveBoxY + 48);
  ctx.restore();

  // 5. THREE COMPACT QUEUE CARDS (reduced height, wait time is hero)
  const cardsStartY = headerY + 128;
  const cardW = width - 2 * marginX;
  const cardH = 140;
  const cardGap = 14;

  data.queues.forEach((q, idx) => {
    const qY = cardsStartY + idx * (cardH + cardGap);
    const qX = marginX;

    // Card body
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, qX, qY, cardW, cardH, 18);
    ctx.fill();

    ctx.strokeStyle = q.color === '#E11D48' ? '#FECDD3' : '#FDE68A';
    ctx.lineWidth = 1.8;
    drawRoundedRect(ctx, qX, qY, cardW, cardH, 18);
    ctx.stroke();

    // Left accent bar
    ctx.fillStyle = q.color;
    drawRoundedRect(ctx, qX, qY, 8, cardH, 4);
    ctx.fill();

    // Left icon box
    const iconBoxSize = 56;
    const iconBoxX = qX + 22;
    const iconBoxY = qY + (cardH - iconBoxSize) / 2;
    ctx.fillStyle = q.color === '#E11D48' ? '#FFE4E6' : '#FEF3C7';
    drawRoundedRect(ctx, iconBoxX, iconBoxY, iconBoxSize, iconBoxSize, 14);
    ctx.fill();
    ctx.strokeStyle = q.color;
    ctx.lineWidth = 1.2;
    drawRoundedRect(ctx, iconBoxX, iconBoxY, iconBoxSize, iconBoxSize, 14);
    ctx.stroke();

    const icx = iconBoxX + iconBoxSize / 2;
    const icy = iconBoxY + iconBoxSize / 2;
    if (idx === 0) drawUsersIcon(ctx, icx, icy, 14, q.color);
    else if (idx === 1) drawZapIcon(ctx, icx, icy, 14, q.color);
    else drawTicketIcon(ctx, icx, icy, 14, q.color);

    // LEFT: Name + Subtitle + optional category
    const textX = iconBoxX + iconBoxSize + 16;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = `800 26px ${INDIC_FONT}`;
    ctx.fillText(q.name, textX, qY + 42);

    ctx.fillStyle = '#334155';
    ctx.font = `600 17px ${INDIC_FONT}`;
    ctx.fillText(q.subtitle, textX, qY + 72);

    if (q.category) {
      ctx.fillStyle = '#64748B';
      ctx.font = `500 14px ${INDIC_FONT}`;
      ctx.fillText(q.category, textX, qY + 98);
    }

    // RIGHT: EST. WAIT → Hero wait time → Status dot + label + tiny bars
    const rightEdge = qX + cardW - 28;
    ctx.textAlign = 'right';

    // "EST. WAIT" (small label)
    ctx.fillStyle = '#64748B';
    ctx.font = '700 12px system-ui, sans-serif';
    ctx.letterSpacing = '0.8px';
    ctx.fillText(isTe ? 'నిరీక్షణ' : 'EST. WAIT', rightEdge, qY + 30);

    // Hero wait time (biggest element on the card)
    let waitText = q.wait;
    waitText = waitText.replace(/\s*hours?\s*/gi, ' HRS').replace(/\s*hrs?\s*/gi, ' HRS');
    if (!/hrs|గంట|min/i.test(waitText)) waitText = `${waitText} HRS`;
    waitText = waitText.replace(/\s+/g, ' ').trim();

    ctx.fillStyle = q.color;
    ctx.font = '900 38px -apple-system, system-ui, sans-serif';
    ctx.letterSpacing = '-0.5px';
    ctx.fillText(waitText, rightEdge, qY + 72);

    // Status indicator dot (vector arc) + label
    const labelMetrics = ctx.measureText(q.label);
    const labelW = labelMetrics.width;
    const dotX = rightEdge - labelW - 10;
    const dotY = qY + 91;

    ctx.fillStyle = q.color;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '800 14px system-ui, sans-serif';
    ctx.letterSpacing = '0.5px';
    ctx.fillText(q.label, rightEdge, qY + 96);

    // Tiny inline meter bars
    const barCount = 5;
    const barW = 12;
    const barH = 6;
    const barGapX = 3;
    const totalBarsW = barCount * barW + (barCount - 1) * barGapX;
    const barsStartX = rightEdge - totalBarsW;
    const barsY = qY + 106;

    for (let b = 1; b <= barCount; b++) {
      ctx.fillStyle = b <= q.meter ? q.color : 'rgba(15, 23, 42, 0.12)';
      drawRoundedRect(ctx, barsStartX + (b - 1) * (barW + barGapX), barsY, barW, barH, 2);
      ctx.fill();
    }

    ctx.restore();
  });

  // 6. COMPACT UTILITY STRIP (3 single-line pills)
  const utilityY = cardsStartY + 3 * (cardH + cardGap) + 10;
  const pillGap = 14;
  const pillW = (cardW - 2 * pillGap) / 3;
  const pillH = 52;

  // Pill 1: Ghats Open
  ctx.save();
  ctx.fillStyle = 'rgba(6, 78, 59, 0.55)';
  drawRoundedRect(ctx, marginX, utilityY, pillW, pillH, 14);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, marginX, utilityY, pillW, pillH, 14);
  ctx.stroke();

  drawCarIcon(ctx, marginX + 32, utilityY + pillH / 2, 13, '#34D399');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ECFDF5';
  ctx.font = `700 17px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'ఘాట్ రోడ్లు ఓపెన్' : 'Ghats Open', marginX + 56, utilityY + 33);
  ctx.restore();

  // Pill 2: Weather
  const p2X = marginX + pillW + pillGap;
  ctx.save();
  ctx.fillStyle = 'rgba(120, 53, 15, 0.4)';
  drawRoundedRect(ctx, p2X, utilityY, pillW, pillH, 14);
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, p2X, utilityY, pillW, pillH, 14);
  ctx.stroke();

  drawSunIcon(ctx, p2X + 32, utilityY + pillH / 2, 13, '#FBBF24');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFBEB';
  ctx.font = '700 18px system-ui, sans-serif';
  ctx.fillText(data.weatherTemp || '32°C', p2X + 56, utilityY + 33);
  ctx.restore();

  // Pill 3: Verified (honest — not "Source: TTD")
  const p3X = p2X + pillW + pillGap;
  ctx.save();
  ctx.fillStyle = 'rgba(6, 78, 59, 0.55)';
  drawRoundedRect(ctx, p3X, utilityY, pillW, pillH, 14);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.2;
  drawRoundedRect(ctx, p3X, utilityY, pillW, pillH, 14);
  ctx.stroke();

  drawShieldCheckIcon(ctx, p3X + 32, utilityY + pillH / 2, 13, '#34D399');
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ECFDF5';
  ctx.font = `700 17px ${INDIC_FONT}`;
  ctx.fillText(isTe ? 'ధృవీకరించబడింది' : 'Verified', p3X + 56, utilityY + 33);
  ctx.restore();

  // 7. CENTERED CTA BLOCK (no split layout, no footer)
  const ctaY = utilityY + pillH + 24;
  const centerX = width / 2;

  ctx.save();
  ctx.textAlign = 'center';

  // Planning Darshan Namaste vector
  drawNamasteIcon(ctx, centerX, ctaY + 12, 18, '#FDE047');

  ctx.fillStyle = '#FEF08A';
  ctx.font = `800 24px ${INDIC_FONT}`;
  ctx.letterSpacing = '0.5px';
  ctx.fillText(isTe ? 'ఈరోజు దర్శనానికి వెళ్తున్నారా?' : 'PLANNING DARSHAN TODAY?', centerX, ctaY + 48);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = `500 17px ${INDIC_FONT}`;
  ctx.letterSpacing = '0px';
  ctx.fillText(isTe ? 'వెళ్లేముందు లైవ్ క్యూ సమయం చూసుకోండి.' : 'Check the queue before you go.', centerX, ctaY + 68);

  // saarthiguide.in → pill
  const searchW = 380;
  const searchH = 50;
  const searchX = (width - searchW) / 2;
  const searchY = ctaY + 84;

  ctx.fillStyle = 'rgba(4, 22, 15, 0.95)';
  drawRoundedRect(ctx, searchX, searchY, searchW, searchH, 25);
  ctx.fill();
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, searchX, searchY, searchW, searchH, 25);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('saarthiguide.in  →', centerX, searchY + 33);
  ctx.restore();

  return canvasToBlob(canvas);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2️⃣ GENERATE: JAPA MALA BEAD / MILESTONE / POORTHI CARD (Image 2 Fix)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateJapaCard(data: JapaShareCardData): Promise<Blob | null> {
  if (typeof window === 'undefined') return null;

  // Load official Saarthi logo icon
  const logoImg = await getSaarthiLogoImage();

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

  // 3. HEADER WITH OFFICIAL LOGO
  ctx.save();
  ctx.textAlign = 'center';

  const japaLogoSize = 44;
  if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(width / 2, 108, japaLogoSize / 2 + 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, 108, japaLogoSize / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoImg, width / 2 - japaLogoSize / 2, 108 - japaLogoSize / 2, japaLogoSize, japaLogoSize);
    ctx.restore();
  } else {
    drawNamamIcon(ctx, width / 2, 108, 20);
  }

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
    ctx.fillText('✦ MALA POORTHI (108/108) ✦', width / 2, badgeY + 32);
  } else if (isMilestone) {
    ctx.fillText(`✦ MILESTONE #${data.beadNumber} / 108 ✦`, width / 2, badgeY + 32);
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

  // Lotus Divider (Custom Vector Icon)
  const lotusY = curY + 15;
  // Left divider line
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 120, lotusY);
  ctx.lineTo(width / 2 - 25, lotusY);
  ctx.stroke();
  // Vector lotus
  drawLotusIcon(ctx, width / 2, lotusY, 14, '#F59E0B');
  // Right divider line
  ctx.beginPath();
  ctx.moveTo(width / 2 + 25, lotusY);
  ctx.lineTo(width / 2 + 120, lotusY);
  ctx.stroke();
  curY += 45;

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
  ctx.fillText('saarthiguide.in  →', width / 2, botY + 38);

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

  // 1. Construct File strictly with correct PNG mime type and name
  let file: File;
  try {
    file = new File([blob], filename, { type: 'image/png', lastModified: Date.now() });
  } catch {
    // Safari/older webviews fallback
    const b: any = blob;
    b.lastModifiedDate = new Date();
    b.name = filename;
    file = b as File;
  }

  // 2. Native Web Share API Level 2 (Mobile Chrome, Samsung Internet, iOS Safari)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    let canShareFile = false;
    try {
      if (typeof navigator.canShare === 'function') {
        canShareFile = navigator.canShare({ files: [file] });
      } else {
        // Assume file sharing might work if navigator.share exists
        canShareFile = true;
      }
    } catch {
      canShareFile = false;
    }

    if (canShareFile) {
      // ⚠️ FIRST PRINCIPLES FIX FOR WHATSAPP ON ANDROID / iOS:
      // WhatsApp on Android and iOS has a known bug/limitation:
      // If BOTH `files` AND `text` (or `url`) are provided, WhatsApp either:
      // A) Only imports the `text` and completely ignores the image file, OR
      // B) Fails the file transfer intent and reverts to plain text link.
      // To guarantee the image card is shared, we share ONLY files: [file] with title.
      try {
        await navigator.share({
          files: [file],
          title
        });
        return true;
      } catch (err: any) {
        // User dismissed the share sheet - do NOT fallback to opening WhatsApp text
        if (err?.name === 'AbortError' || err?.message?.includes('abort')) {
          return true;
        }
      }
    }
  }

  // 3. Fallback for Desktop or browsers without file Web Share:
  // Trigger direct download of the image card and copy image to clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof window.ClipboardItem === 'function') {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      } catch {
        // Clipboard write might require active tab focus
      }
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);

    // Open WhatsApp Web with caption if desktop
    const isMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || '');
    if (!isMobile) {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + url)}`;
      window.open(whatsappUrl, '_blank');
    }
    return true;
  } catch {
    return false;
  }
}
