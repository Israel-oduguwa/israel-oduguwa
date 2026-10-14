import { writeFileSync } from 'node:fs';
import { simulate } from './simulate.mjs';

const config = { count: 500, gapMs: 10, serviceMs: 80, slots: 4, deadlineMs: 250 };
const results = { model: 'deterministic identical-job queue; not a service benchmark',
  config, policies: ['queue', 'deadline'].map(policy => simulate({ ...config, policy })) };
writeFileSync(new URL('./results.json', import.meta.url), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
