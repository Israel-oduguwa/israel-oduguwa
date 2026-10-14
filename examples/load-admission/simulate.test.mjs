import assert from 'node:assert/strict';
import { test } from 'node:test';
import { simulate } from './simulate.mjs';

test('every offered arrival has an outcome, including late work', () => {
  for (const policy of ['queue', 'deadline']) {
    const result = simulate({ policy });
    assert.equal(result.timely + result.late + result.rejected, result.offered);
    assert.equal(result.admitted + result.rejected, result.offered);
  }
});

test('deadline admission retains rejection evidence and avoids late modeled work', () => {
  const queue = simulate();
  const bounded = simulate({ policy: 'deadline' });
  assert.ok(queue.late > 0);
  assert.ok(bounded.rejected > 0);
  assert.equal(bounded.late, 0);
  assert.ok(bounded.maximumAcceptedLatencyMs <= 250);
  assert.ok(bounded.timely > queue.timely);
});

test('below capacity both policies admit the same work', () => {
  const config = { gapMs: 100 };
  const queue = simulate(config);
  const bounded = simulate({ ...config, policy: 'deadline' });
  assert.equal(queue.admitted, bounded.admitted);
  assert.equal(queue.timely, 500);
  assert.equal(bounded.rejected, 0);
});
