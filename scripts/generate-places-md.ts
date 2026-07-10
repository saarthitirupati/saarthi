import { PLACES } from '../src/data/places';
import * as fs from 'fs';
import * as path from 'path';

// Clean out food spots
const touristPlaces = PLACES.filter(p => p.placeType !== 'food' && p.category !== 'Food');

let content = `# Saarthi Total Places List\n\n`;
content += `This artifact lists all **${touristPlaces.length} tourist, spiritual, and leisure locations** configured in the Saarthi directory database. The raw data has also been exported as a JSON array to [total_places.json](file:///D:/travel/data/total_places.json) for programmatic use.\n\n---\n\n`;

// Group by category
const categories: Record<string, typeof touristPlaces> = {};
for (const p of touristPlaces) {
  const cat = p.category || 'Other';
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(p);
}

for (const [catName, spots] of Object.entries(categories)) {
  content += `## 📍 ${catName}\n`;
  content += `| No. | Place Name | Location | Rating | Coordinates | Key Feature |\n`;
  content += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  
  spots.forEach((p, idx) => {
    const lat = p.coordinates?.lat?.toFixed(5) ?? '0.00000';
    const lng = p.coordinates?.lng?.toFixed(5) ?? '0.00000';
    content += `| ${idx + 1} | **${p.name}** | ${p.location ?? ''} | ${p.rating ?? 'N/A'} | \`${lat}, ${lng}\` | ${p.description ?? ''} |\n`;
  });
  content += `\n---\n\n`;
}

const outputPath = 'C:\\Users\\thatr\\.gemini\\antigravity\\brain\\3b191f53-11ae-41a7-a72c-f77b8d77e5f0\\total_places.md';
fs.writeFileSync(outputPath, content, 'utf-8');
console.log('Successfully generated total_places.md artifact at:', outputPath);
