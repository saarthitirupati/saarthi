const fs = require('fs');

// 1. Fix page.tsx (remove the bottomNav block)
let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
const startTag = '{/* ─── BOTTOM NAVIGATION ─── */}';
const startIndex = pageContent.indexOf(startTag);

if (startIndex !== -1) {
  // Find the end of the div (just before the closing </div> of the page)
  const endIndex = pageContent.lastIndexOf('</div>\n  );');
  if (endIndex !== -1 && endIndex > startIndex) {
    const newPageContent = pageContent.substring(0, startIndex) + pageContent.substring(endIndex);
    fs.writeFileSync('src/app/page.tsx', newPageContent);
    console.log('Successfully removed bottom nav from page.tsx');
  } else {
    console.log('Could not find the end of page.tsx properly');
  }
} else {
  console.log('Could not find bottom nav block in page.tsx');
}

// 2. Fix Home.module.css (remove margin-top: -12px)
let cssContent = fs.readFileSync('src/app/Home.module.css', 'utf8');
cssContent = cssContent.replace('margin-top: -12px;', 'margin-top: 0;');
fs.writeFileSync('src/app/Home.module.css', cssContent);
console.log('Successfully updated Home.module.css');
