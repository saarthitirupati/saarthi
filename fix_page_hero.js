const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Remove the old HERO / GREETING section
const heroRegex = /\{\/\* ─── HERO \/ GREETING ─── \*\/\}[\s\S]*?<\/section>/;
content = content.replace(heroRegex, '');

// 2. Rename heroSection to decisionCardSection for the Decision Card
content = content.replace(/<section className=\{styles\.heroSection\}>/, '<section className={styles.decisionCardSection}>');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Fixed page.tsx');
