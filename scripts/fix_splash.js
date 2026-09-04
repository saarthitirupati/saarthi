const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function fixSplash() {
  const densities = [
    { dir: 'drawable-mdpi', size: 300 },
    { dir: 'drawable-hdpi', size: 450 },
    { dir: 'drawable-xhdpi', size: 600 },
    { dir: 'drawable-xxhdpi', size: 900 },
    { dir: 'drawable-xxxhdpi', size: 1200 }
  ];

  for (const d of densities) {
    const splashPath = path.join(__dirname, '..', 'twa-output', 'app', 'src', 'main', 'res', d.dir, 'splash.png');
    
    // Create pure #FAF8F5 background
    const splashBg = sharp({
      create: {
        width: d.size,
        height: d.size,
        channels: 4,
        background: { r: 250, g: 248, b: 245, alpha: 1 }
      }
    });

    const logoSize = Math.round(d.size * 0.7);
    const resizedLogo = await sharp(path.join(__dirname, '..', 'public', 'icon-512.png'))
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 250, g: 248, b: 245, alpha: 0 } })
      .toBuffer();

    await splashBg
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png()
      .toFile(splashPath);

    console.log(`✅ Generated clean splash for ${d.dir} (${d.size}x${d.size})`);
  }
}

fixSplash().catch(console.error);
