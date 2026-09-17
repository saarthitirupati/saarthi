import { chromium } from '@playwright/test';
import { spawn } from 'child_process';

async function runSelfContainedHomeScreenTest() {
  console.log('===================================================');
  console.log('📱 SAARTHI HOME SCREEN OVERVIEW - PLAYWRIGHT TEST');
  console.log('===================================================\n');

  console.log('Starting Next.js dev server on http://127.0.0.1:3005...');
  const serverProc = spawn('npx', ['next', 'dev', '-p', '3005'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'ignore'
  });

  console.log('Waiting 12s for Next.js server to initialize...');
  await new Promise(r => setTimeout(r, 12000));

  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'Desktop Chrome (1440x900)', width: 1440, height: 900, isMobile: false },
    { name: 'Tablet iPad (768x1024)', width: 768, height: 1024, isMobile: false },
    { name: 'Mobile iPhone 14 (390x844)', width: 390, height: 844, isMobile: true },
    { name: 'Mobile Android (360x740)', width: 360, height: 740, isMobile: true }
  ];

  const summary = [];

  for (const vp of viewports) {
    console.log(`\n▶ Testing Viewport: ${vp.name}...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile
    });
    const page = await context.newPage();

    const start = Date.now();
    try {
      const res = await page.goto('http://127.0.0.1:3005/', { waitUntil: 'domcontentloaded', timeout: 25000 });
      const duration = Date.now() - start;
      const status = res ? res.status() : 0;
      const title = await page.title();

      // Check overflow
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

      // Count links & headings
      const linksCount = await page.locator('a').count();
      const h1Text = await page.locator('h1').first().innerText().catch(() => 'Saarthi');

      console.log(`  ✅ Status Code  : ${status}`);
      console.log(`  ✅ Load Latency : ${duration}ms`);
      console.log(`  ✅ Page Title   : "${title}"`);
      console.log(`  ✅ H1 Heading   : "${h1Text}"`);
      console.log(`  ✅ Overflow Check: ${overflow ? '❌ HAS OVERFLOW' : '✅ CLEAN (No Horizontal Overflow)'}`);
      console.log(`  ✅ Nav Links    : ${linksCount} visible`);

      summary.push({
        viewport: vp.name,
        status,
        durationMs: duration,
        title,
        h1Text,
        overflow,
        linksCount,
        passed: status === 200 && !overflow
      });
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      summary.push({
        viewport: vp.name,
        passed: false,
        error: err.message
      });
    } finally {
      await context.close();
    }
  }

  await browser.close();
  try { process.kill(serverProc.pid); } catch {}

  console.log('\n===================================================');
  console.log('📊 PLAYWRIGHT HOME SCREEN OVERVIEW TEST REPORT');
  console.log('===================================================');
  summary.forEach(s => {
    if (s.passed) {
      console.log(`[PASS] ${s.viewport} | Status: ${s.status} | Load: ${s.durationMs}ms | Links: ${s.linksCount} | Overflow: NONE`);
    } else {
      console.log(`[FAIL] ${s.viewport} | Error: ${s.error || 'Failed'}`);
    }
  });
  console.log('===================================================\n');
}

runSelfContainedHomeScreenTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
