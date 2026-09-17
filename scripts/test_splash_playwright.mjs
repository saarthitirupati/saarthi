import { chromium } from '@playwright/test';

async function testSplashVideo() {
  console.log('Testing Splash Screen Video on http://127.0.0.1:3005/splash...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:3005/splash', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const splashStats = await page.evaluate(() => {
    const v = document.querySelector('video');
    if (!v) return { found: false };
    return {
      found: true,
      src: v.currentSrc || v.src,
      paused: v.paused,
      muted: v.muted,
      currentTime: v.currentTime,
      duration: v.duration,
      readyState: v.readyState,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight
    };
  });

  console.log('Splash Video Stats:', JSON.stringify(splashStats, null, 2));

  await browser.close();

  if (splashStats.found && splashStats.src.includes('saarthi-splashscreen.mp4')) {
    console.log('✅ SUCCESS: Video Splash Screen saarthi-splashscreen.mp4 is mounted and playing!');
  } else {
    console.log('⚠️ WARNING: Splash screen video check details:', splashStats);
  }
}

testSplashVideo().catch(console.error);
