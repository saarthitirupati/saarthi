import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'fs/promises';
import path from 'path';

const ASSETS_DIR = './public/assets';
const QUALITY = 80;
const MAX_WIDTH = 800;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFiles(fullPath));
    } else if (entry.name.endsWith('.png') || entry.name.endsWith('.jpg') || entry.name.endsWith('.jpeg')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function compressImage(filePath) {
  const tmpPath = filePath + '.tmp.png';
  try {
    const info = await stat(filePath);
    const originalKB = (info.size / 1024).toFixed(1);
    
    await sharp(filePath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .png({ compressionLevel: 9, effort: 10 })
      .toFile(tmpPath);
    
    const newInfo = await stat(tmpPath);
    const newKB = (newInfo.size / 1024).toFixed(1);
    
    if (newInfo.size < info.size) {
      await unlink(filePath);
      await rename(tmpPath, filePath);
      console.log(`OK ${path.basename(filePath)}: ${originalKB}KB -> ${newKB}KB (-${(((info.size - newInfo.size) / info.size) * 100).toFixed(0)}%)`);
    } else {
      await unlink(tmpPath);
      console.log(`SKIP ${path.basename(filePath)}: ${originalKB}KB already optimal`);
    }
  } catch (e) {
    try { await unlink(tmpPath); } catch {}
    console.error(`ERR ${path.basename(filePath)}: ${e.message}`);
  }
}

const files = await getFiles(ASSETS_DIR);
console.log(`Found ${files.length} images to compress...\n`);

let totalBefore = 0, totalAfter = 0;
for (const file of files) {
  const before = (await stat(file)).size;
  totalBefore += before;
  await compressImage(file);
  const after = (await stat(file)).size;
  totalAfter += after;
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB -> ${(totalAfter/1024/1024).toFixed(1)}MB (saved ${(((totalBefore-totalAfter)/totalBefore)*100).toFixed(0)}%)`);
