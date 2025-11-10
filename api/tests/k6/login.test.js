
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 }, // simulate ramp-up of traffic from 1 to 20 virtual users in 30s
    { duration: '1m', target: 20 },  // stay at 20 virtual users for 1 minute
    { duration: '20s', target: 0 },  // ramp-down to 0 virtual users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

export default function () {
  const url = 'http://localhost:3000/api/auth/login'; // Assuming API runs on port 3000
  const payload = JSON.stringify({
    matricula: 'admin', // Replace with valid test user
    senha: 'admin',     // Replace with valid test password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response contains token': (r) => r.json() && r.json().token !== '',
  });

  sleep(1);
}
