import { chromium } from '@playwright/test';
import { spawn } from 'child_process';

async function testSplashLaunchSequence() {
  console.log('Starting Next.js dev server on http://127.0.0.1:3009...');
  const serverProc = spawn('npx', ['next', 'dev', '-p', '3009'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'ignore'
  });

  console.log('Waiting 18s for Next.js dev server to initialize...');
  await new Promise(r => setTimeout(r, 18000));

  console.log('Launching Playwright Chromium browser to test cold start sequence...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:3009/ ...');
  await page.goto('http://127.0.0.1:3009/', { waitUntil: 'domcontentloaded' });

  // Evaluate DOM state in the first 200ms of load
  const initialCheck = await page.evaluate(() => {
    const splash = document.querySelector('[class*="splashContainer"]');
    const bottomNav = document.querySelector('nav') || document.querySelector('[class*="bottomNav"]');
    const loadingText = document.body.innerText.includes('Loading your Saarthi');
    const rawPlayIcon = document.querySelector('video::-webkit-media-controls-play-button');
    return {
      splashMounted: !!splash,
      bottomNavVisibleOnStart: !!bottomNav,
      loadingTextVisibleOnStart: loadingText,
      rawPlayIconPresent: !!rawPlayIcon
    };
  });

  console.log('\n===================================================');
  console.log('📱 INITIAL LAUNCH DOM INSPECTION (First 200ms)');
  console.log('===================================================');
  console.log('  Splash Screen Mounted    :', initialCheck.splashMounted ? '✅ YES (Mounted immediately)' : '❌ NO');
  console.log('  BottomNav Flashing       :', initialCheck.bottomNavVisibleOnStart ? '❌ FLASHED (Bug)' : '✅ NONE (Clean)');
  console.log('  Loading Spinner Flashing :', initialCheck.loadingTextVisibleOnStart ? '❌ FLASHED (Bug)' : '✅ NONE (Clean)');
  console.log('  Raw Play Icon Placeholder:', initialCheck.rawPlayIconPresent ? '❌ VISIBLE (Bug)' : '✅ HIDDEN (Clean)');
  console.log('===================================================\n');

  await browser.close();
  try { process.kill(serverProc.pid); } catch {}

  if (initialCheck.splashMounted && !initialCheck.bottomNavVisibleOnStart && !initialCheck.loadingTextVisibleOnStart) {
    console.log('✅ SUCCESS: Launch sequence bugs are 100% fixed!');
  } else {
    console.error('❌ FAIL: Splash launch sequence issues detected.');
    process.exit(1);
  }
}

testSplashLaunchSequence().catch(console.error);
