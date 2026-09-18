import { chromium } from '@playwright/test';

async function testBothVideos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const videos = [
    '/banner/hero_banner_compressed.mp4',
    '/banner/Absolutely_For_the_Saarthi_SV.mp4'
  ];

  for (const vUrl of videos) {
    console.log(`\nTesting video URL: http://127.0.0.1:3005${vUrl}...`);
    const res = await page.goto(`http://127.0.0.1:3005${vUrl}`);
    console.log(`  HTTP Status: ${res ? res.status() : 0}`);
    console.log(`  Content-Type: ${res ? res.headers()['content-type'] : 'none'}`);
  }

  await browser.close();
}

testBothVideos().catch(console.error);
