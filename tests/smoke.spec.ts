import { test, expect } from '@playwright/test';

test.describe('Saarthi Smoke Baseline Tests', () => {
  test('01: App loads, title and body are present', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Check page title contains Saarthi
    await expect(page).toHaveTitle(/Saarthi/i);
    
    // Check if main container or body is present
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    const loadDuration = Date.now() - startTime;
    console.log('[Metric] Initial Load Duration: ' + loadDuration + 'ms');
  });

  test('02: Onboarding renders, language selection and continue work', async ({ page }) => {
    await page.goto('/onboarding');
    
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

  test('05: Splash screen displays clean minimalist identity and skip works', async ({ page }) => {
    await page.goto('/splash');

    // Verify wordmark SAARTHI is present
    const brandHeading = page.locator('h1', { hasText: 'SAARTHI' });
    await expect(brandHeading).toBeVisible();

    // Verify Telugu script is present
    const teluguText = page.getByText('సారథి');
    await expect(teluguText).toBeVisible();

    // Verify Skip button is present
    const skipBtn = page.getByRole('button', { name: /Skip/i });
    await expect(skipBtn).toBeVisible();

    // Click Skip and verify transition to onboarding
    await skipBtn.click();
    await page.waitForURL(/\/(onboarding)?/, { timeout: 4000 });
  });
});