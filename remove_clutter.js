const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src', 'app', 'page.tsx');
let lines = fs.readFileSync(pagePath, 'utf8').split('\n');

const clutterStart = lines.findIndex(l => l.includes('{/* ─── BEFORE DARSHAN CHECKLIST ─── */}'));
const exploreBeyondStart = lines.findIndex(l => l.includes('{/* ─── EXPLORE BEYOND TEMPLES SECTION ─── */}'));

if (clutterStart === -1 || exploreBeyondStart === -1) {
    console.error("Could not find bounds");
    process.exit(1);
}

// Find the end of Explore Beyond Temples
let clutterEnd = exploreBeyondStart;
while (clutterEnd < lines.length && !lines[clutterEnd].includes('</section>')) {
    clutterEnd++;
}

let newLines = [];
for (let i = 0; i < lines.length; i++) {
    if (i >= clutterStart && i <= clutterEnd) {
        continue;
    }
    newLines.push(lines[i]);
}

fs.writeFileSync(pagePath, newLines.join('\n'));
console.log('Successfully removed clutter widgets from page.tsx');
