import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 Load Test Configuration for Saarthi Production
// Stages: Ramp-up to 10 -> 25 -> 50 -> 100 concurrent virtual users
export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Warm-up to 10 users
    { duration: '1m',  target: 25 },  // Moderate load
    { duration: '1m',  target: 50 },  // High load
    { duration: '1m',  target: 100 }, // Peak load (100 users)
    { duration: '30s', target: 0 },   // Cool-down
  ],
  thresholds: {
    // 95% of requests must complete below 1.5s
    http_req_duration: ['p(95)<1500'],
    // Error rate must remain below 1%
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'https://www.saarthiguide.in';

export default function () {
  // 1. Home Page
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, {
    'home status 200': (r) => r.status === 200,
  });

  sleep(1);

  // 2. Live Status API (Crowd + Sevas)
  const statusRes = http.get(`${BASE_URL}/api/v1/live-status`);
  check(statusRes, {
    'live-status status 200': (r) => r.status === 200,
    'live-status has crowd': (r) => r.json('crowd') !== undefined,
  });

  sleep(1);

  // 3. Places API (53 verified places)
  const placesRes = http.get(`${BASE_URL}/api/v1/places`);
  check(placesRes, {
    'places status 200': (r) => r.status === 200,
  });

  sleep(2);
}
