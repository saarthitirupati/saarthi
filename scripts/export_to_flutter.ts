import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PLACES as places } from '../src/data/places';
import { FESTIVALS_2026 } from '../src/data/festivals';
import { GITA_SHLOKAS } from '../src/data/bhagavadGita';
import { CURATED_LAYOUTS as TEMPLE_LAYOUTS } from '../src/data/templeLayouts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../saarthi_mobile/assets/data');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Export Places with website image URLs
const placesPath = path.join(targetDir, 'places.json');
const processedPlaces = places.map((p) => {
  let img = p.image;
  if (img && img.startsWith('/')) {
    img = `https://www.saarthiguide.in${img}`;
  }
  return { ...p, image: img };
});
fs.writeFileSync(placesPath, JSON.stringify(processedPlaces, null, 2), 'utf-8');
console.log(`✅ Exported ${processedPlaces.length} places to ${placesPath}`);

// 2. Export Festivals
const festivalsPath = path.join(targetDir, 'festivals.json');
fs.writeFileSync(festivalsPath, JSON.stringify(FESTIVALS_2026, null, 2), 'utf-8');
console.log(`✅ Exported ${FESTIVALS_2026.length} festivals to ${festivalsPath}`);

// 3. Export Gita Shlokas
const shlokasPath = path.join(targetDir, 'gita_shlokas.json');
fs.writeFileSync(shlokasPath, JSON.stringify(GITA_SHLOKAS, null, 2), 'utf-8');
console.log(`✅ Exported ${GITA_SHLOKAS.length} Gita shlokas to ${shlokasPath}`);

// 4. Export Temple Precinct Layouts (Offline Maps)
const layoutsPath = path.join(targetDir, 'temple_layouts.json');
fs.writeFileSync(layoutsPath, JSON.stringify(TEMPLE_LAYOUTS, null, 2), 'utf-8');
console.log(`✅ Exported ${Object.keys(TEMPLE_LAYOUTS).length} temple layouts to ${layoutsPath}`);

console.log('🎉 Flutter offline data pipeline completed successfully!');
