// Native Node.js Pilgrim Journey Load Simulator (0 external dependencies)
// Simulates concurrent active pilgrims performing realistic multi-step journeys.
// Target: Local production build by default (protecting live production).

const BASE_URL = process.env.BASE_URL || 'http://localhost:3005';
const REQUEST_TIMEOUT_MS = 5000; // 5-second SLA timeout

const CONCURRENCY_LEVELS = [10, 25, 50, 100];
const JOURNEYS_PER_VU = 2; // Each VU performs 2 complete consecutive journeys

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function calculatePercentile(values, percentile) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

// Single HTTP fetch with strict 5-second timeout and SLA tracking
async function makeRequest(path, label) {
  const url = `${BASE_URL}${path}`;
  const start = performance.now();

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        'User-Agent': 'Saarthi-PilgrimSimulator/2.0',
        'Accept': 'application/json, text/html, */*',
      },
    });

    const duration = performance.now() - start;

    if (!res.ok) {
      return { ok: false, status: res.status, duration, timeout: false, error: `HTTP ${res.status}`, label };
    }

    // Drain body to simulate complete transfer
    await res.arrayBuffer();

    return { ok: true, status: res.status, duration, timeout: false, label };
  } catch (err) {
    const duration = performance.now() - start;
    const isTimeout = err.name === 'TimeoutError' || err.message?.includes('timeout') || duration >= REQUEST_TIMEOUT_MS;
    return { ok: false, status: 0, duration, timeout: isTimeout, error: err.message, label };
  }
}

// Complete realistic pilgrim user journey
async function runPilgrimJourney(pilgrimId) {
  const journeyResults = [];

  // Step 1: Open Home Page
  const homeRes = await makeRequest('/', 'Home');
  journeyResults.push(homeRes);
  await sleep(150); // Think time: viewing top banner

  // Step 2: Client polls Canonical Live Status (/api/v1/status)
  const statusRes1 = await makeRequest('/api/v1/status', 'Live Status');
  journeyResults.push(statusRes1);
  await sleep(200); // Think time: reading queue wait times

  // Step 3: Pilgrim opens Explore (/explore)
  const exploreRes = await makeRequest('/explore', 'Explore Page');
  journeyResults.push(exploreRes);
  await sleep(150); // Think time: browsing categories

  // Step 4: Client fetches verified Places Directory (/api/v1/places)
  const placesRes = await makeRequest('/api/v1/places', 'Places API');
  journeyResults.push(placesRes);
  await sleep(250); // Think time: scrolling place cards

  // Step 5: Pilgrim clicks Place Details (/place/govindaraja)
  const placeDetailRes = await makeRequest('/place/govindaraja', 'Place Detail');
  journeyResults.push(placeDetailRes);
  await sleep(200); // Think time: viewing timings & directions

  // Step 6: Background refresh of Live Status
  const statusRes2 = await makeRequest('/api/v1/status', 'Live Status Refresh');
  journeyResults.push(statusRes2);

  return journeyResults;
}

// Run a Virtual User (VU) loop
async function runVirtualUser(vuId, totalJourneys) {
  const allResults = [];
  for (let j = 0; j < totalJourneys; j++) {
    const journeyResults = await runPilgrimJourney(`${vuId}-${j}`);
    allResults.push(...journeyResults);
    await sleep(200); // Inter-journey pause
  }
  return allResults;
}

async function runStage(concurrency) {
  const startTime = performance.now();
  const vuPromises = Array.from({ length: concurrency }, (_, idx) => 
    runVirtualUser(idx + 1, JOURNEYS_PER_VU)
  );

  const nestedResults = await Promise.all(vuPromises);
  const totalDurationSec = (performance.now() - startTime) / 1000;
  const flatResults = nestedResults.flat();

  const totalRequests = flatResults.length;
  const totalJourneys = concurrency * JOURNEYS_PER_VU;
  const errorCount = flatResults.filter(r => !r.ok && !r.timeout).length;
  const timeoutCount = flatResults.filter(r => r.timeout).length;
  const successfulDurations = flatResults.filter(r => r.ok).map(r => r.duration);

  const meanMs = successfulDurations.length > 0 
    ? Math.round(successfulDurations.reduce((a, b) => a + b, 0) / successfulDurations.length) 
    : 0;

  const p50Ms = Math.round(calculatePercentile(successfulDurations, 50));
  const p90Ms = Math.round(calculatePercentile(successfulDurations, 90));
  const p95Ms = Math.round(calculatePercentile(successfulDurations, 95));
  const p99Ms = Math.round(calculatePercentile(successfulDurations, 99));
  const reqPerSec = (totalRequests / totalDurationSec).toFixed(1);
  const journeysPerSec = (totalJourneys / totalDurationSec).toFixed(1);

  // Per-step P50 and P95 breakdowns
  const stepBreakdown = {};
  const steps = ['Home', 'Live Status', 'Explore Page', 'Places API', 'Place Detail', 'Live Status Refresh'];
  for (const step of steps) {
    const stepDurations = flatResults.filter(r => r.label === step && r.ok).map(r => r.duration);
    stepBreakdown[step] = {
      p50: Math.round(calculatePercentile(stepDurations, 50)),
      p95: Math.round(calculatePercentile(stepDurations, 95)),
    };
  }

  return {
    concurrency,
    totalJourneys,
    totalRequests,
    errors: errorCount,
    timeouts: timeoutCount,
    errorRate: ((errorCount / totalRequests) * 100).toFixed(2) + '%',
    timeoutRate: ((timeoutCount / totalRequests) * 100).toFixed(2) + '%',
    meanMs,
    p50Ms,
    p90Ms,
    p95Ms,
    p99Ms,
    reqPerSec,
    journeysPerSec,
    stepBreakdown,
  };
}

async function main() {
  console.log(`\n========================================================================`);
  console.log(`🧭 SAARTHI PILGRIM JOURNEY LOAD SIMULATION`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timeout SLA: ${REQUEST_TIMEOUT_MS}ms per request`);
  console.log(`User Flow: Home -> Status -> Explore -> Places -> Detail -> Status`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`========================================================================\n`);

  const summary = [];

  for (const concurrency of CONCURRENCY_LEVELS) {
    process.stdout.write(`Ramping up ${String(concurrency).padStart(3)} concurrent pilgrims... `);
    const result = await runStage(concurrency);
    summary.push(result);
    console.log(`Done in ${(result.totalRequests / parseFloat(result.reqPerSec)).toFixed(1)}s (P50: ${result.p50Ms}ms, P95: ${result.p95Ms}ms, Errors: ${result.errors}, Timeouts: ${result.timeouts})`);
    await sleep(500); // Cool-down between concurrency stages
  }

  console.log(`\n------------------------------------------------------------------------------------------------------------------`);
  console.log(`| Concurrency | Journeys | Requests | Errors | Timeouts | Mean (ms) | P50 (ms) | P95 (ms) | P99 (ms) | Req/Sec | Journeys/s |`);
  console.log(`|-------------|----------|----------|--------|----------|-----------|----------|----------|----------|---------|------------|`);

  for (const s of summary) {
    const c = String(s.concurrency).padEnd(11);
    const j = String(s.totalJourneys).padEnd(8);
    const r = String(s.totalRequests).padEnd(8);
    const err = String(s.errors).padEnd(6);
    const to = String(s.timeouts).padEnd(8);
    const mean = String(s.meanMs).padEnd(9);
    const p50 = String(s.p50Ms).padEnd(8);
    const p95 = String(s.p95Ms).padEnd(8);
    const p99 = String(s.p99Ms).padEnd(8);
    const rps = String(s.reqPerSec).padEnd(7);
    const jps = String(s.journeysPerSec).padEnd(10);
    console.log(`| ${c} | ${j} | ${r} | ${err} | ${to} | ${mean} | ${p50} | ${p95} | ${p99} | ${rps} | ${jps} |`);
  }
  console.log(`------------------------------------------------------------------------------------------------------------------\n`);

  console.log(`📊 PER-STEP LATENCY BREAKDOWN (P50 / P95 in ms):`);
  console.log(`----------------------------------------------------------------------------------------`);
  console.log(`| Step Name            | 10 Users (P50/P95) | 25 Users (P50/P95) | 50 Users (P50/P95) | 100 Users (P50/P95) |`);
  console.log(`|----------------------|--------------------|--------------------|--------------------|---------------------|`);

  const stepKeys = ['Home', 'Live Status', 'Explore Page', 'Places API', 'Place Detail', 'Live Status Refresh'];
  for (const step of stepKeys) {
    const c10 = `${summary[0].stepBreakdown[step].p50} / ${summary[0].stepBreakdown[step].p95}`.padEnd(18);
    const c25 = `${summary[1].stepBreakdown[step].p50} / ${summary[1].stepBreakdown[step].p95}`.padEnd(18);
    const c50 = `${summary[2].stepBreakdown[step].p50} / ${summary[2].stepBreakdown[step].p95}`.padEnd(18);
    const c100 = `${summary[3].stepBreakdown[step].p50} / ${summary[3].stepBreakdown[step].p95}`.padEnd(19);
    console.log(`| ${step.padEnd(20)} | ${c10} | ${c25} | ${c50} | ${c100} |`);
  }
  console.log(`----------------------------------------------------------------------------------------\n`);
  console.log(`✅ Pilgrim journey load simulation complete.\n`);
}

main().catch(console.error);
