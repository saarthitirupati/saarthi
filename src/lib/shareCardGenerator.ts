/**
 * 🎨 Saarthi First-Principles Shareable Card Generator
 * 
 * Uses 100% native HTML5 Canvas (zero external packages, zero puppeteer bloat).
 * Generates ultra-crisp 2x Retina PNG cards for WhatsApp, Instagram, and social sharing:
 * 
 * 1. 🛕 TODAY IN TIRUMALA CARD:
 *    - Live Darshan Wait Times (Sarva, ₹300 Special, SSD Tokens)
 *    - Live crowd status meter and weather/ghats telemetry
 *    - Official Saarthi Pilgrim Companion branding & verification watermark
 * 
 * 2. 📿 JAPA MALA BEAD CARD:
 *    - Sacred Nama in Telugu & English
 *    - Divine Blessing & Grace
 *    - Luminous bead progress (X/108)
 * 
 * 3. 🌟 MILESTONE CARD (27, 54, 81 Beads):
 *    - Quarter / Half / Three-Quarter Mala celebration badge
 *    - Ethereal Govinda blessing
 * 
 * 4. 🎉 108 MALA POORTHI GRAND CARD:
 *    - Celebratory Garbhagriha layout
 *    - Maha Phala Shruthi & total completed malas count
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
  ghatsOpen: boolean;
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
// 🎨 HELPER: Canvas Drawing Primitives
// ─────────────────────────────────────────────────────────────────────────────

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY + lineHeight;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1️⃣ GENERATE: TODAY IN TIRUMALA CARD (Image 1)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateTodayInTirumalaCard(data: TodayPulseCardData): Promise<Blob | null> {
  if (typeof window === 'undefined') return null;

  const width = 1080;
  const height = 1350; // Ideal 4:5 vertical portrait for WhatsApp & Instagram
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background: Warm Ivory & Velvet Emerald Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#061D15');
  bgGrad.addColorStop(0.18, '#0B2B20');
  bgGrad.addColorStop(0.70, '#0F372A');
  bgGrad.addColorStop(1, '#051811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Radial Golden Aura on top
  const aura = ctx.createRadialGradient(width / 2, 180, 50, width / 2, 180, 520);
  aura.addColorStop(0, 'rgba(245, 158, 11, 0.22)');
  aura.addColorStop(0.5, 'rgba(217, 119, 6, 0.08)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, 700);

  // Decorative Golden Border Frame
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 36, 36, width - 72, height - 72, 32);
  ctx.stroke();

  // Corner Accent Diamonds
  const drawCorner = (cx: number, cy: number) => {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCorner(56, 56);
  drawCorner(width - 56, 56);
  drawCorner(56, height - 56);
  drawCorner(width - 56, height - 56);

  // ── HEADER: BRAND LOCKUP ──
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FDE68A';
  ctx.font = '700 24px system-ui, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('✦ SAARTHI PILGRIM COMPANION ✦', width / 2, 105);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px Georgia, serif';
  ctx.fillText('TODAY IN TIRUMALA', width / 2, 165);

  // Live Subtitle Pill
  ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 2;
  const pillW = 420;
  const pillH = 46;
  drawRoundedRect(ctx, (width - pillW) / 2, 195, pillW, pillH, 23);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc((width - pillW) / 2 + 28, 218, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ECFDF5';
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('LIVE DARSHAN PULSE', (width - pillW) / 2 + 48, 226);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#A7F3D0';
  ctx.font = '600 20px system-ui, sans-serif';
  ctx.fillText(data.dateStr, (width + pillW) / 2 - 24, 226);

  // Contextual Advisory Banner
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FEF08A';
  ctx.font = '700 28px system-ui, sans-serif';
  ctx.fillText(`• ${data.statusHeadline} •`, width / 2, 290);

  // ── 3 QUEUE TILES ──
  const startY = 340;
  const cardW = width - 130;
  const cardH = 200;
  const cardGap = 34;

  data.queues.forEach((q, idx) => {
    const cardY = startY + idx * (cardH + cardGap);

    // Card White Glass Body
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRect(ctx, 65, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.restore();

    // Card Border
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3;
    drawRoundedRect(ctx, 65, cardY, cardW, cardH, 24);
    ctx.stroke();

    // Left Colored Accent Strip
    ctx.fillStyle = q.color;
    drawRoundedRect(ctx, 65, cardY, 14, cardH, 7);
    ctx.fill();

    // Left Icon Placeholder Circle
    ctx.fillStyle = q.bg || 'rgba(0, 0, 0, 0.05)';
    ctx.beginPath();
    ctx.arc(140, cardY + cardH / 2, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = q.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Emoji in icon circle
    ctx.font = '36px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(idx === 0 ? '👥' : idx === 1 ? '⚡' : '🎫', 140, cardY + cardH / 2 + 13);

    // Title & Subtitle
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0F172A';
    ctx.font = '800 36px system-ui, sans-serif';
    ctx.fillText(q.name, 210, cardY + 76);

    ctx.fillStyle = '#475569';
    ctx.font = '600 24px system-ui, sans-serif';
    ctx.fillText(q.subtitle, 210, cardY + 124);

    // Right: Wait Time
    ctx.textAlign = 'right';
    ctx.fillStyle = q.color;
    ctx.font = '900 46px system-ui, sans-serif';
    ctx.fillText(q.wait, width - 110, cardY + 80);

    // Meter Bars + Badge
    const meterX = width - 260;
    const meterY = cardY + 115;
    for (let b = 1; b <= 5; b++) {
      ctx.fillStyle = b <= q.meter ? q.color : 'rgba(15, 23, 42, 0.2)';
      drawRoundedRect(ctx, meterX + (b - 1) * 14, meterY, 9, 22, 2);
      ctx.fill();
    }

    // Badge
    const badgeW = 140;
    const badgeH = 34;
    ctx.fillStyle = q.color;
    drawRoundedRect(ctx, width - 110 - badgeW, cardY + 110, badgeW, badgeH, 8);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 18px system-ui, sans-serif';
    ctx.fillText(q.label, width - 110 - badgeW / 2, cardY + 133);
  });

  // ── FOOTER TELEMETRY PILLS ──
  const footerY = 1080;
  ctx.textAlign = 'center';

  // Ghat Road Pill
  ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 110, footerY, 260, 56, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#A7F3D0';
  ctx.font = '700 24px system-ui, sans-serif';
  ctx.fillText('🚗  Ghats Open', 240, footerY + 37);

  // Weather Pill
  ctx.fillStyle = 'rgba(217, 119, 6, 0.18)';
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 410, footerY, 260, 56, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FDE68A';
  ctx.font = '700 24px system-ui, sans-serif';
  ctx.fillText(`☀️  ${data.weatherTemp || '26°C'}`, 540, footerY + 37);

  // Verified Badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 710, footerY, 260, 56, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 24px system-ui, sans-serif';
  ctx.fillText('🛡️  Verified Live', 840, footerY + 37);

  // ── FOOTER CALL TO ACTION ──
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FEF08A';
  ctx.font = '700 26px Georgia, serif';
  ctx.fillText('Get live Tirumala queue updates & AI smart companion:', width / 2, 1205);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '900 30px system-ui, sans-serif';
  ctx.fillText('👉  https://saarthiguide.in', width / 2, 1250);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '500 20px system-ui, sans-serif';
  ctx.fillText('Serving Sri Venkateswara Swami Pilgrims with First-Principles Clarity', width / 2, 1290);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2️⃣ GENERATE: JAPA MALA BEAD / MILESTONE / POORTHI CARD (Image 2)
// ─────────────────────────────────────────────────────────────────────────────

export async function generateJapaCard(data: JapaShareCardData): Promise<Blob | null> {
  if (typeof window === 'undefined') return null;

  const width = 1080;
  const height = 1350; // 4:5 vertical portrait
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const isPoorthi = data.type === 'poorthi';
  const isMilestone = data.type === 'milestone';

  // Deep Sanctum Emerald Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, isPoorthi ? '#052418' : '#041811');
  bgGrad.addColorStop(0.35, isPoorthi ? '#093B27' : '#072419');
  bgGrad.addColorStop(0.75, '#04160F');
  bgGrad.addColorStop(1, '#020A07');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Luminous Sanctum Golden Halo
  const aura = ctx.createRadialGradient(width / 2, 320, 60, width / 2, 320, 600);
  aura.addColorStop(0, isPoorthi ? 'rgba(74, 222, 128, 0.35)' : 'rgba(245, 158, 11, 0.30)');
  aura.addColorStop(0.45, isPoorthi ? 'rgba(34, 197, 94, 0.12)' : 'rgba(217, 119, 6, 0.10)');
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, 850);

  // Ornate Double Gold Outer Border
  ctx.strokeStyle = isPoorthi ? 'rgba(74, 222, 128, 0.6)' : 'rgba(212, 175, 55, 0.55)';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, 40, 40, width - 80, height - 80, 36);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(253, 224, 71, 0.2)';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 52, 52, width - 104, height - 104, 30);
  ctx.stroke();

  // ── HEADER: BRAND LOGO & MOTIF ──
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F59E0B';
  ctx.font = '32px system-ui, sans-serif';
  ctx.fillText('🛕 ✨ 📿', width / 2, 110);

  ctx.fillStyle = '#FFFDF5';
  ctx.font = '700 24px system-ui, sans-serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('SAARTHI GUIDE', width / 2, 150);

  ctx.fillStyle = isPoorthi ? '#86EFAC' : '#FDE68A';
  ctx.font = '600 20px system-ui, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('SRIVARI 108 SACRED JAPA MALA', width / 2, 185);

  // ── HERO ALTAR CARD (Center Shrine) ──
  const shrineY = 230;
  const shrineW = width - 140;
  const shrineH = isPoorthi ? 740 : 680;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowColor = isPoorthi ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.25)';
  ctx.shadowBlur = 30;
  drawRoundedRect(ctx, 70, shrineY, shrineW, shrineH, 30);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = isPoorthi ? 'rgba(74, 222, 128, 0.45)' : 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 2.5;
  drawRoundedRect(ctx, 70, shrineY, shrineW, shrineH, 30);
  ctx.stroke();

  // Bead Pill Indicator on Altar
  const badgeW = 320;
  const badgeH = 46;
  ctx.fillStyle = isPoorthi ? 'rgba(34, 197, 94, 0.25)' : 'rgba(245, 158, 11, 0.22)';
  ctx.strokeStyle = isPoorthi ? '#4ADE80' : '#F59E0B';
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, (width - badgeW) / 2, shrineY + 40, badgeW, badgeH, 23);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = isPoorthi ? '#86EFAC' : '#FDE047';
  ctx.font = '800 22px system-ui, sans-serif';
  ctx.letterSpacing = '1.5px';
  if (isPoorthi) {
    ctx.fillText('🎉 MALA POORTHI (108/108) 🎉', width / 2, shrineY + 71);
  } else if (isMilestone) {
    ctx.fillText(`🌟 MILESTONE #${data.beadNumber} / 108 🌟`, width / 2, shrineY + 71);
  } else {
    ctx.fillText(`✦ DIVINE NAMA #${data.beadNumber} OF 108 ✦`, width / 2, shrineY + 71);
  }

  // Holy Nama (Telugu)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 52px Georgia, serif';
  ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
  ctx.shadowBlur = 24;
  wrapText(ctx, data.namaTe, width / 2, shrineY + 160, shrineW - 80, 68);
  ctx.shadowBlur = 0;

  // Nama Transliteration (English)
  ctx.fillStyle = '#CBD5E1';
  ctx.font = 'italic 500 28px system-ui, sans-serif';
  ctx.fillText(data.namaEn, width / 2, shrineY + 240);

  // Lotus Divider
  ctx.fillStyle = '#F59E0B';
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillText('─── 🪷 ───', width / 2, shrineY + 295);

  // Divine Blessing Title
  ctx.fillStyle = '#F59E0B';
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('DIVINE BLESSING & ANUGRAHAM', width / 2, shrineY + 340);

  // Blessing Telugu Text
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '600 30px Georgia, serif';
  wrapText(ctx, `"${data.blessingTe}"`, width / 2, shrineY + 395, shrineW - 100, 48);

  // Blessing English Meaning
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'italic 500 24px system-ui, sans-serif';
  wrapText(ctx, `"${data.blessingEn}"`, width / 2, shrineY + 520, shrineW - 120, 36);

  // Progress Bar
  const progY = shrineY + shrineH - 85;
  const barW = shrineW - 120;
  const barX = 130;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  drawRoundedRect(ctx, barX, progY, barW, 14, 7);
  ctx.fill();

  const pct = Math.min(1, data.beadNumber / 108);
  const fillW = Math.max(16, barW * pct);
  const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
  barGrad.addColorStop(0, '#D97706');
  barGrad.addColorStop(0.5, '#F59E0B');
  barGrad.addColorStop(1, '#FDE047');
  ctx.fillStyle = barGrad;
  drawRoundedRect(ctx, barX, progY, fillW, 14, 7);
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FDE047';
  ctx.font = '800 20px system-ui, sans-serif';
  ctx.fillText(`Japa Progress: ${data.beadNumber} / 108 Chants`, barX, progY - 14);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '800 20px system-ui, sans-serif';
  ctx.fillText(`${Math.round(pct * 100)}%`, barX + barW, progY - 14);

  // ── FOOTER CALL TO ACTION ──
  const botY = shrineY + shrineH + 50;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FEF08A';
  ctx.font = '700 26px Georgia, serif';
  ctx.fillText('Chant the sacred 108 Srivari Japa Mala on Saarthi:', width / 2, botY);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '900 30px system-ui, sans-serif';
  ctx.fillText('👉  https://saarthiguide.in', width / 2, botY + 44);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.font = '500 20px system-ui, sans-serif';
  ctx.fillText('ఓం నమో వేంకటేశాయ • సర్వే జనాః సుఖినో భవంతు', width / 2, botY + 84);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
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

  const file = new File([blob], filename, { type: 'image/png' });

  // 1. Try Native Web Share API Level 2 with files (Android Chrome, iOS Safari)
  if (
    typeof navigator !== 'undefined' &&
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        title,
        text,
        url,
        files: [file]
      });
      return true;
    } catch (err: any) {
      if (err.name === 'AbortError') return true; // User intentionally dismissed
    }
  }

  // 2. Desktop or Non-file Share Fallback: Trigger direct image download + open WhatsApp
  try {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);

    // Open WhatsApp with rich text caption
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n' + url)}`;
    window.open(whatsappUrl, '_blank');
    return true;
  } catch {
    return false;
  }
}
