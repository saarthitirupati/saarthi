const fs = require('fs');

const raw = fs.readFileSync('eslint.json', 'utf16le');
const data = JSON.parse(raw.replace(/^\uFEFF/, ''));

let total = 0;
const ruleCounts = {};
const details = [];

data.forEach(file => {
  file.messages.forEach(msg => {
    total++;
    const rule = msg.ruleId || 'unknown';
    ruleCounts[rule] = (ruleCounts[rule] || 0) + 1;
    
    // Determine risk and recommendation
    let safeToFix = 'No';
    let risk = 'High';
    let recommendation = 'Leave intentionally';
    let why = msg.message.split('\n')[0];
    
    if (rule === 'react-hooks/exhaustive-deps') {
      risk = 'Medium';
      recommendation = 'Leave as-is (intentional omission)';
      why = 'Missing dependency in hook';
    } else if (rule === '@typescript-eslint/no-explicit-any') {
      risk = 'Medium';
      recommendation = 'Leave as-is unless obvious type exists';
      why = 'Unexpected any. Specify a different type';
    } else if (rule === 'react-hooks/set-state-in-effect') {
      risk = 'High';
      recommendation = 'Review manually (potential render loop)';
      why = 'Calling setState synchronously in effect';
    } else if (rule === '@typescript-eslint/no-require-imports') {
      risk = 'Low';
      recommendation = 'Safe to fix (change to import)';
      safeToFix = 'Yes';
    } else if (rule === 'react-hooks/rules-of-hooks') {
      risk = 'High';
      recommendation = 'Review manually (breaks hook rules)';
    } else if (rule === '@typescript-eslint/no-unused-vars') {
      risk = 'Low';
      recommendation = 'Safe to remove or prefix with _';
      safeToFix = 'Yes';
    } else if (rule === 'react/no-unescaped-entities') {
      risk = 'Low';
      recommendation = 'Safe to fix (escape quotes)';
      safeToFix = 'Yes';
    } else {
      risk = 'Medium';
      recommendation = 'Review manually';
    }
    
    details.push({
      file: file.filePath.split('travel\\\\')[1] || file.filePath.split('travel/')[1] || file.filePath,
      rule,
      why,
      safeToFix,
      risk,
      recommendation
    });
  });
});

let markdown = `# Phase 3B.1: ESLint Documentation & Analysis Report

## Remaining ESLint Warnings

**Total:** ${total}

────────────────────────
\n`;

const sortedRules = Object.entries(ruleCounts).sort((a, b) => b[1] - a[1]);
sortedRules.forEach(([rule, count]) => {
  markdown += `${count} × ${rule}\n`;
});

let autofix = details.filter(d => d.safeToFix === 'Yes').length;
let manualReview = details.filter(d => d.recommendation.includes('Review manually')).length;
let leaveIntentionally = details.filter(d => d.recommendation.includes('Leave')).length;

markdown += `\n────────────────────────\n\n## Recommendation Summary\n\n`;
markdown += `Auto-fix (Safe to fix):\n${autofix}\n\n`;
markdown += `Manual review:\n${manualReview}\n\n`;
markdown += `Leave intentionally:\n${leaveIntentionally}\n\n`;

markdown += `\n## Warning Details\n\n`;
markdown += `| File | Rule | Why ESLint flagged it | Safe to Fix? | Risk | Recommendation |\n`;
markdown += `| ---- | ---- | --------------------- | ------------ | ---- | -------------- |\n`;

details.forEach(d => {
  // truncate file path for cleaner table
  const shortFile = d.file.split(/[\\/]/).pop();
  markdown += `| ${shortFile} | \`${d.rule}\` | ${d.why.substring(0, 40)}${d.why.length > 40 ? '...' : ''} | ${d.safeToFix} | ${d.risk} | ${d.recommendation} |\n`;
});

fs.writeFileSync('C:/Users/thatr/.gemini/antigravity/brain/aba2607f-657c-4119-b885-503bce71e372/eslint_analysis_report.md', markdown, 'utf8');
console.log('Report generated.');
