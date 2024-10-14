import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    cloud: {
        // Project: K6 (Demo)
        projectID: 3719141,
        // Test runs with the same name groups test runs together.
        name: 'GitHub Testing (Demo)'
    },
    scenarios: {
        shared_iter_scenario: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 100,
            startTime: '0s',
        },
        per_vu_scenario: {
            executor: 'per-vu-iterations',
            vus: 10,
            iterations: 10,
            startTime: '10s',
        },
    },
    thresholds: {
        // Assert that 99% of requests finish within 3000ms.
        http_req_duration: ["p(90) < 3000"]
    },
    // Key configurations for spike in this section
    stages: [
        { duration: '10s', target: 100 }, // fast ramp-up to a high point
        // No plateau
        { duration: '1m', target: 0 }, // quick ramp-down to 0 users
    ],
};


export default () => {
    const urlRes = http.get('https://syafiqhadzir.dev/');
    // Validate response status
    check(urlRes, { "status was 200": (r) => r.status == 200 });
    sleep(1);
};
