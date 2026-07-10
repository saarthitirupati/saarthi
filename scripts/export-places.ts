import { PLACES } from '../src/data/places';
import * as fs from 'fs';
import * as path from 'path';

const dir = path.join(__dirname, '../data');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const outputPath = path.join(dir, 'total_places.json');
fs.writeFileSync(outputPath, JSON.stringify(PLACES, null, 2), 'utf-8');
console.log('Successfully exported places to data/total_places.json');
