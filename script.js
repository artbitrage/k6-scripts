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
        spike_testing: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 50 }, // fast ramp-up to a high point
                // No plateau
                { duration: '1m', target: 0 }, // quick ramp-down to 0 users
            ],
            gracefulRampDown: '0s'
        },
        stress_testing: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '10s', target: 50 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
                { duration: '1m', target: 50 }, // stay at higher 200 users for 30 minutes
                { duration: '30s', target: 0 }, // ramp-down to 0 users
            ],
            gracefulRampDown: '0s'
        }
    },
    thresholds: {
        // Assert that 99% of requests finish within 3000ms.
        http_req_duration: ["p(90) < 3000"]
    }
};


export default () => {
    const urlRes = http.get('https://syafiqhadzir.dev/');
    // Validate response status
    check(urlRes, { "status was 200": (r) => r.status == 200 });
    sleep(1);
};
