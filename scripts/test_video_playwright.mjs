import { chromium } from '@playwright/test';

async function testVideoPlayback() {
  console.log('Testing video playback on http://127.0.0.1:3005...');
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'Mobile iPhone (390x844)', width: 390, height: 844, isMobile: true },
    { name: 'Desktop Chrome (1440x900)', width: 1440, height: 900, isMobile: false }
  ];

  for (const vp of viewports) {
    console.log(`\n▶ Testing Viewport: ${vp.name}...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile
    });
    const page = await context.newPage();

    page.on('console', msg => console.log('  PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('  PAGE ERROR:', err.message));

    await page.goto('http://127.0.0.1:3005/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('  Page body text length:', bodyText.length);
    console.log('  Page body text preview:', JSON.stringify(bodyText.slice(0, 400)));

    const videoElements = await page.evaluate(() => {
      const v = document.querySelectorAll('video');
      const containers = Array.from(document.querySelectorAll('*')).filter(el => el.style && el.style.background && el.style.background.includes('banner_poster'));
      return {
        videoCount: v.length,
        containerCount: containers.length,
        containersHTML: containers.map(c => c.outerHTML.slice(0, 300)),
        videosHTML: Array.from(v).map(el => el.outerHTML.slice(0, 300))
      };
    });

    console.log('  Video DOM details:', JSON.stringify(videoElements, null, 2));
    await context.close();
  }

  await browser.close();
}

testVideoPlayback().catch(console.error);
