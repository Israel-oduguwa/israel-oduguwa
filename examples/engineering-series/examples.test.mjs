import test from 'node:test';
import assert from 'node:assert/strict';
import { transition } from './workflow.mjs';
import { reducer, initialState, canAdvance } from './ui-state.mjs';
import { runMatrix } from './evaluator.mjs';
import { admission } from './admission.mjs';

test('approval requires another actor and emits stable payment intent', () => {
  const current = { id: 'application1', tenant: 't1', applicant: 'alice', status: 'review', version: 3 };
  const command = { type: 'approve', expectedVersion: 3 };
  assert.throws(() => transition(current, command, { id: 'alice', tenant: 't1', role: 'reviewer' }));
  assert.throws(() => transition(current, command, { id: 'bob', tenant: 't2', role: 'reviewer' }));
  const result = transition(current, command, { id: 'bob', tenant: 't1', role: 'reviewer' });
  assert.equal(result.state.status, 'payment_pending');
  assert.equal(result.state.version, 4);
  assert.equal(result.effects[0].operationId, 'application1:payment:1');
  assert.deepEqual(current, { id: 'application1', tenant: 't1', applicant: 'alice', status: 'review', version: 3 });
  assert.throws(() => transition(result.state, command, { id: 'bob', tenant: 't1', role: 'reviewer' }));
});

test('a validation result for an older draft cannot advance the current draft', () => {
  let state = reducer(initialState, { type: 'edit', patch: { name: 'Ada' } });
  state = reducer(state, { type: 'validation_started', token: 'v1', revision: 1 });
  state = reducer(state, { type: 'edit', patch: { name: '' } });
  const current = state;
  state = reducer(state, { type: 'validation_finished', token: 'v1', revision: 1, valid: true });
  assert.equal(state, current);
  assert.equal(canAdvance(state), false);
  state = reducer(state, { type: 'validation_started', token: 'v2', revision: 2 });
  state = reducer(state, { type: 'validation_finished', token: 'v2', revision: 2, valid: false });
  assert.equal(canAdvance(state), false);
});

test('all eight mutants fool response grading, none passes every behavioral probe', async () => {
  const matrix = await runMatrix();
  assert.ok(Object.values(matrix.reference).every((value) => value === 'PASS'));
  for (const [name, row] of Object.entries(matrix)) {
    assert.equal(row['public-response'], 'PASS');
    if (name !== 'reference') assert.ok(Object.values(row).includes('FAIL'));
  }
  assert.equal(matrix['hidden-corruption']['committed-effects'], 'PASS');
  assert.equal(matrix['hidden-corruption']['tenant-and-validation'], 'FAIL');
  assert.equal(matrix['lost-update-race']['committed-effects'], 'PASS');
  assert.equal(matrix['lost-update-race']['concurrent-spend'], 'FAIL');
});

test('admission stays bounded and release is idempotent across failures and shutdown', async () => {
  const gate = admission(2);
  const first = gate.acquire();
  const second = gate.acquire();
  assert.equal(gate.acquire(), null);
  assert.equal(gate.active, 2);
  first();
  first();
  assert.equal(gate.active, 1);
  const third = gate.acquire();
  try { throw new Error('dependency failure'); }
  catch { /* Exercise the caller's failure path. */ }
  finally { third(); }
  assert.equal(gate.active, 1);
  gate.stop();
  assert.equal(gate.acquire(), null);
  second();
  assert.equal(gate.active, 0);
});
