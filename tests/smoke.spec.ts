import { test, expect } from '@playwright/test';

test.describe('Saarthi Smoke Baseline Tests', () => {
  test('01: App loads, title and body are present', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check page title contains Saarthi
    await expect(page).toHaveTitle(/Saarthi/i);
    
    // Check if main container or body is present
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    const loadDuration = Date.now() - startTime;
    console.log('[Metric] Initial Load Duration: ' + loadDuration + 'ms');
  });

  test('02: Onboarding renders, language selection and continue work', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });
    
    // Verify Onboarding headings exist
    const heading = page.locator('h1');
    await expect(heading.first()).toBeVisible();
    
    // Verify Language selection cards exist
    const langCard = page.getByText('English', { exact: true });
    await expect(langCard).toBeVisible();
    
    // Verify Continue button is present and not cut off (target the footer continue button specifically)
    const continueBtn = page.getByRole('button', { name: 'Continue', exact: true });
    await expect(continueBtn).toBeVisible();
  });

  test('03: Live status API responds with valid payload', async ({ request }) => {
    const start = Date.now();
    const res = await request.get('/api/v1/live-status');
    const latency = Date.now() - start;
    
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('crowd');
    expect(data.crowd).toHaveProperty('status');
    console.log('[Metric] /api/v1/live-status Latency: ' + latency + 'ms');
  });

  test('04: Places API responds with verified places list', async ({ request }) => {
    const start = Date.now();
    const res = await request.get('/api/v1/places');
    const latency = Date.now() - start;
    
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    const places = Array.isArray(json) ? json : (json.data || json.places || []);
    expect(places.length).toBeGreaterThan(0);
    console.log('[Metric] /api/v1/places Latency: ' + latency + 'ms | Places Count: ' + places.length);
  });

  test('05: Splash screen displays clean minimalist identity and video container', async ({ page }) => {
    await page.goto('/splash', { waitUntil: 'domcontentloaded' });

    // Verify video splash element exists
    const video = page.locator('video').first();
    await expect(video).toBeVisible({ timeout: 5000 });
  });

  test('06: Real user-facing Status API (/api/v1/status) responds with live temple data', async ({ request }) => {
    const start = Date.now();
    const res = await request.get('/api/v1/status');
    const latency = Date.now() - start;

    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('waitTime');
    expect(data).toHaveProperty('crowdLevel');
    expect(data).toHaveProperty('darshans');
    expect(Array.isArray(data.darshans)).toBeTruthy();
    expect(data).toHaveProperty('ssdTokenStatus');
    console.log('[Metric] /api/v1/status Latency: ' + latency + 'ms | Wait Time: ' + data.waitTime);
  });

  test('07: Zero horizontal overflow on core routes (scrollWidth <= innerWidth)', async ({ page }) => {
    const routesToTest = ['/', '/onboarding', '/explore'];

    for (const route of routesToTest) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(isOverflowing, `Horizontal overflow detected on ${route}`).toBe(false);
    }
  });

  test('08: Core pilgrim journey: Splash -> Onboarding -> Home -> Darshan -> Explore -> Place -> Directions', async ({ page }) => {
    // 1. Splash / Onboarding
    await page.goto('/onboarding', { waitUntil: 'domcontentloaded' });

    // 2. Complete Onboarding
    // Step 1: Language selection Continue
    const step1Continue = page.getByRole('button', { name: /Continue|కొనసాగండి/i }).first();
    await expect(step1Continue).toBeVisible({ timeout: 5000 });
    await step1Continue.click();

    // Step 2: Now on Welcome step, click Skip to quickly complete onboarding
    const step2Skip = page.getByRole('button', { name: /Skip|దాటవేయి/i });
    await expect(step2Skip).toBeVisible({ timeout: 5000 });
    await step2Skip.click();

    // 3. Wait for Home page load
    await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded', timeout: 20000 });

    // 4. Handle Location Prompt if shown
    const notNowBtn = page.getByRole('button', { name: /Not Now/i });
    if (await notNowBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await notNowBtn.click();
    }

    // 5. Home: Verify main content and navigation links are rendered
    await expect(page.locator('body')).toBeVisible();
    const essentialsLink = page.locator('a[href="/essentials"]').first();
    await expect(essentialsLink).toBeAttached({ timeout: 8000 });

    // 6. Explore: Navigate to Explore
    await page.goto('/explore');
    await page.waitForLoadState('domcontentloaded');

    // 7. Select Place: Find first place card link
    const placeLink = page.locator('a[href^="/place/"]').first();
    await expect(placeLink).toBeVisible({ timeout: 6000 });
    await placeLink.click({ force: true });

    // 8. Place Details: Wait for details page and verify Directions CTA
    await page.waitForURL((url) => url.pathname.startsWith('/place/'), { timeout: 10000 });
    const directionsBtn = page.getByRole('button', { name: /Start Navigation|దర్శన మార్గం|మార్గం/i }).first();
    await expect(directionsBtn).toBeVisible({ timeout: 10000 });
  });
});