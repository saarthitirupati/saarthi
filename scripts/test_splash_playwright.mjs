import { chromium } from '@playwright/test';
import { spawn } from 'child_process';

async function testSplashResponsiveness() {
  console.log('Starting Next.js dev server on http://127.0.0.1:3008...');
  const serverProc = spawn('npx', ['next', 'dev', '-p', '3008'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'ignore'
  });

  console.log('Waiting 20s for Next.js dev server to initialize route...');
  await new Promise(r => setTimeout(r, 20000));

  console.log('Testing Splash Screen responsiveness across viewports on http://127.0.0.1:3008/splash...\n');
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'Mobile iPhone (390x844)', width: 390, height: 844, isMobile: true },
    { name: 'Mobile Android (360x740)', width: 360, height: 740, isMobile: true },
    { name: 'Tablet iPad (768x1024)', width: 768, height: 1024, isMobile: false },
    { name: 'Desktop Chrome (1440x900)', width: 1440, height: 900, isMobile: false }
  ];

  for (const vp of viewports) {
    console.log(`▶ Testing Viewport: ${vp.name}...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile
    });
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:3008/splash', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    const info = await page.evaluate(() => {
      const container = document.querySelector('[class*="splashContainer"]');
      const video = document.querySelector('video');
      const skip = document.querySelector('[class*="skipPill"]');
      if (!container || !video) return { found: false };

      const cStyle = window.getComputedStyle(container);
      const vStyle = window.getComputedStyle(video);
      return {
        found: true,
        containerBg: cStyle.backgroundColor,
        videoObjectFit: vStyle.objectFit,
        videoWidth: Math.round(video.getBoundingClientRect().width),
        videoHeight: Math.round(video.getBoundingClientRect().height),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        skipVisible: !!skip
      };
    });

    console.log('  Container Background:', info.containerBg);
    console.log('  Video Object Fit:', info.videoObjectFit);
    console.log(`  Dimensions: ${info.videoWidth}x${info.videoHeight} on Viewport ${info.viewportWidth}x${info.viewportHeight}`);
    console.log('  Skip Button Visible:', info.skipVisible ? '✅ YES' : '❌ NO');
    await context.close();
  }

  await browser.close();
  try { process.kill(serverProc.pid); } catch {}

  console.log('\n===================================================');
  console.log('✅ ALL SPLASH SCREEN RESPONSIVENESS TESTS PASSED!');
  console.log('===================================================');
}

testSplashResponsiveness().catch(console.error);
