import http from 'k6/http';
import { Counter } from 'k6/metrics';
import { endpoints } from './endpoints.js';
import { randomIntBetween } from '../utils.js';


const httpCodes = [200, 201, 202, 0, 400, 401, 403, 404, 405, 408, 418, 429, 500, 502, 503, 504, 507, 508, 99];
const httpCodesValidos = [200, 201, 202];

let checkMetrics = {};
for (let i = 0; i < httpCodes.length; i++) {
  checkMetrics[`status_${httpCodes[i]}`] = new Counter(`check_status_${httpCodes[i]}`);
}

for (let i = 0; i < endpoints.length; i++){
checkMetrics[`body_fail_${endpoints[i].name}`] = new Counter(`check_body_fail_${endpoints[i].name}`)
checkMetrics[`sla_fail_${endpoints[i].name}`] = new Counter(`check_sla_fail_${endpoints[i].name}`);
}

checkMetrics['status_total'] = new Counter('Count_status_total');
checkMetrics['Error_total'] = new Counter('Count_Error_total');
checkMetrics['Total_response_time_2s'] = new Counter('Count_Total_response_time_2s');

function buildArrayPonderado(endpoints) {
    let ponderados = [];
    endpoints.forEach(ep => {
        for (let i = 0; i < ep.peso; i++) {
            ponderados.push(ep);
        }
    });
    return ponderados;
}
const EndpointsPonderados = buildArrayPonderado(endpoints);

export const options = {
 insecureSkipTLSVerify: true,
  
    scenarios: {
        ramp_up_and_constant_rate: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 60,
            maxVUs: 600,
            gracefulStop: '60s', // damos margen extra para cierre limpio
            stages: [
                { duration: '10s', target: 2 },
                { duration: '10s', target: 5 },
                { duration: '10s', target: 10 },
                { duration: '10s', target: 14 },
                { duration: '10s', target: 18 },
                { duration: '15s', target: 25 },
                { duration: '15s', target: 35 },
                { duration: '15s', target: 40 },
                { duration: '15s', target: 45 },
                { duration: '15m', target: 50 },
                { duration: '13s', target: 40 },
                { duration: '10s', target: 30 },
                { duration: '10s', target: 20 },
                { duration: '10s', target: 10 },
                { duration: '10s', target: 2}
               ],
        },
    },
};

export default function () {

    const ep = EndpointsPonderados[randomIntBetween(0, EndpointsPonderados.length - 1)];

    const url = `${ep.urlbase}${ep.endpoint}`;
    const params = {
        headers: ep.headers,
        tags: { name: ep.name }
    };

    const res = http.post(url, ep.body, params);

    let matchedCode;
    if (httpCodes.includes(res.status)) {
        matchedCode = res.status;        
    } else {
        matchedCode = 99;
    }

    if (httpCodesValidos.includes(res.status)) {
        if (res.timings.duration >= 2000) {
            checkMetrics['Total_response_time_2s'].add(1);
        }

        if (res.timings.duration > ep.sla) {
            checkMetrics[`sla_fail_${ep.name}`].add(1,{ name: ep.name });
        }
} else {
    checkMetrics['Error_total'].add(1);
}

    checkMetrics[`status_${matchedCode}`].add(1, { name: ep.name });
    checkMetrics['status_total'].add(1, { name: ep.name });

    const body = res.body || '';
    const isVTError = body.includes(ep.check_body);
    if (!isVTError)  {
        checkMetrics[`body_fail_${ep.name}`].add(1, { name: ep.name });
    }

}
