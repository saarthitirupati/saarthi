// Native Node.js Load & Latency Testing Script (0 external dependencies)
// Evaluates Saarthi endpoints under 10, 25, 50, 100 concurrent requests

const BASE_URL = process.env.BASE_URL || 'https://www.saarthiguide.in';

const ENDPOINTS = [
  { name: 'Live Status API', path: '/api/v1/live-status' },
  { name: 'Places API', path: '/api/v1/places' },
  { name: 'Home Landing Page', path: '/' },
];

const CONCURRENCY_LEVELS = [10, 25, 50, 100];
const REQUESTS_PER_CONCURRENCY = 100;

function calculatePercentile(latencies, percentile) {
  if (latencies.length === 0) return 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

async function runWorker(url) {
  const start = performance.now();
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Saarthi-LoadTester/1.0' } });
    const duration = performance.now() - start;
    return { ok: res.ok, status: res.status, duration };
  } catch (err) {
    return { ok: false, status: 0, duration: performance.now() - start, error: err.message };
  }
}

async function runBenchmark(endpoint, concurrency, totalRequests) {
  const url = `${BASE_URL}${endpoint.path}`;
  const latencies = [];
  let errorCount = 0;
  const startTime = performance.now();

  let executed = 0;
  while (executed < totalRequests) {
    const batchSize = Math.min(concurrency, totalRequests - executed);
    const promises = Array.from({ length: batchSize }, () => runWorker(url));
    const results = await Promise.all(promises);
    executed += batchSize;

    for (const res of results) {
      if (res.ok) {
        latencies.push(res.duration);
      } else {
        errorCount++;
      }
    }
  }

  const totalTimeSeconds = (performance.now() - startTime) / 1000;
  const mean = latencies.length > 0 ? (latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
  const p50 = calculatePercentile(latencies, 50);
  const p90 = calculatePercentile(latencies, 90);
  const p95 = calculatePercentile(latencies, 95);
  const p99 = calculatePercentile(latencies, 99);
  const reqPerSec = (totalRequests / totalTimeSeconds).toFixed(1);

  return {
    endpoint: endpoint.name,
    concurrency,
    totalRequests,
    errors: errorCount,
    meanMs: Math.round(mean),
    p50Ms: Math.round(p50),
    p90Ms: Math.round(p90),
    p95Ms: Math.round(p95),
    p99Ms: Math.round(p99),
    reqPerSec,
  };
}

async function main() {
  console.log(`\n======================================================`);
  console.log(`⚡ SAARTHI PRODUCTION LOAD & LATENCY BENCHMARK`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  for (const endpoint of ENDPOINTS) {
    console.log(`\nTesting: [${endpoint.name}] -> ${endpoint.path}`);
    console.log(`-----------------------------------------------------------------------------------------`);
    console.log(`| Concurrency | Requests | Errors | Mean (ms) | P50 (ms) | P95 (ms) | P99 (ms) | Req/Sec |`);
    console.log(`|-------------|----------|--------|-----------|----------|----------|----------|---------|`);

    for (const concurrency of CONCURRENCY_LEVELS) {
      const result = await runBenchmark(endpoint, concurrency, REQUESTS_PER_CONCURRENCY);
      const c = String(result.concurrency).padEnd(11);
      const r = String(result.totalRequests).padEnd(8);
      const err = String(result.errors).padEnd(6);
      const mean = String(result.meanMs).padEnd(9);
      const p50 = String(result.p50Ms).padEnd(8);
      const p95 = String(result.p95Ms).padEnd(8);
      const p99 = String(result.p99Ms).padEnd(8);
      const rps = String(result.reqPerSec).padEnd(7);

      console.log(`| ${c} | ${r} | ${err} | ${mean} | ${p50} | ${p95} | ${p99} | ${rps} |`);
    }
  }

  console.log(`\n✅ Load test complete.\n`);
}

main().catch(console.error);
