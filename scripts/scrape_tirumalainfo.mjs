import { chromium } from '@playwright/test';

async function scrapeTirumalaInfoDetailed() {
  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to https://tirumalainfo.com/tirumala-live-status.php...');
  await page.goto('https://tirumalainfo.com/tirumala-live-status.php', { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('Page loaded. Parsing live status...');
  const data = await page.evaluate(() => {
    const results = {};
    results.title = document.title;
    
    // Extract text paragraphs / cards
    const textNodes = document.body.innerText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const keyPhrases = ['Darshan', 'SSD', 'Sarva', 'Queue', 'Compartments', 'Tokens', 'Wait', 'Hours', 'Pilgrims', 'Hundi', 'Tonsures', 'Bhudevi', 'Vishnu', 'Srinivasam'];
    
    results.relevantMetrics = textNodes.filter(line => 
      keyPhrases.some(kp => line.toLowerCase().includes(kp.toLowerCase()))
    );

    return results;
  });

  console.log('\n=== PARSED LIVE TIRUMALA METRICS VIA PLAYWRIGHT ===\n');
  console.log('Page Title:', data.title);
  console.log('\nExtracted Key Live Status Lines (First 35):');
  console.log(data.relevantMetrics.slice(0, 35).join('\n'));

  await browser.close();
  console.log('\nBrowser closed successfully.');
}

scrapeTirumalaInfoDetailed().catch(err => {
  console.error('Error during detailed scraping:', err);
  process.exit(1);
});
