const sharp = require('sharp');
const path = require('path');

async function fixSplash() {
  const densities = [
    { dir: 'drawable-mdpi', size: 300, card: 160, logo: 120 },
    { dir: 'drawable-hdpi', size: 450, card: 240, logo: 180 },
    { dir: 'drawable-xhdpi', size: 600, card: 320, logo: 240 },
    { dir: 'drawable-xxhdpi', size: 900, card: 480, logo: 360 },
    { dir: 'drawable-xxxhdpi', size: 1200, card: 640, logo: 480 }
  ];

  for (const d of densities) {
    const splashPath = path.join(__dirname, '..', 'twa-output', 'app', 'src', 'main', 'res', d.dir, 'splash.png');
    const radius = Math.round(d.card * 0.22);
    
    // Smooth SVG white squircle card with rounded corners - ZERO black edge pixels
    const cardSvg = Buffer.from(
      `<svg width="${d.card}" height="${d.card}" viewBox="0 0 ${d.card} ${d.card}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${d.card}" height="${d.card}" rx="${radius}" ry="${radius}" fill="#FFFFFF"/>
      </svg>`
    );

    const logoBuf = await sharp(path.join(__dirname, '..', 'public', 'assets', 'logo.png'))
      .resize(d.logo, d.logo, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();

    const cardWithLogo = await sharp(cardSvg)
      .composite([{ input: logoBuf, gravity: 'center' }])
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: d.size,
        height: d.size,
        channels: 4,
        background: { r: 250, g: 248, b: 245, alpha: 1 }
      }
    })
      .composite([{ input: cardWithLogo, gravity: 'center' }])
      .png()
      .toFile(splashPath);

    console.log(`✅ Generated clean squircle splash (NO black corners) for ${d.dir} (${d.size}x${d.size})`);
  }
}

fixSplash().catch(console.error);
