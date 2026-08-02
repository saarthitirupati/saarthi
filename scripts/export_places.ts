import * as fs from 'fs';
import * as path from 'path';
import { PLACES } from '../src/data/places';

const outputDir = path.join(__dirname, '../backend/scripts');
const outputFile = path.join(outputDir, 'places_export.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(PLACES, null, 2), 'utf-8');

console.log(`Exported ${PLACES.length} places to ${outputFile}`);
