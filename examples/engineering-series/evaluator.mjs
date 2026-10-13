import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

export function fixture() {
  return {
    accounts: {
      a: { tenant: 't1', balance: 100 },
      b: { tenant: 't1', balance: 0 },
      c: { tenant: 't2', balance: 70 },
    },
    entries: [],
    operations: {},
  };
}

const operation = (overrides = {}) => ({
  tenant: 't1', from: 'a', to: 'b', amount: 20, key: 'op1', ...overrides,
});
const fingerprint = (op) => JSON.stringify([op.tenant, op.from, op.to, op.amount]);

function validate(state, op) {
  const from = state.accounts[op.from];
  const to = state.accounts[op.to];
  if (!from || !to || from.tenant !== op.tenant || to.tenant !== op.tenant) {
    throw new Error('forbidden');
  }
  if (op.from === op.to || !Number.isSafeInteger(op.amount) || op.amount <= 0) {
    throw new Error('invalid amount');
  }
  if (from.balance < op.amount) throw new Error('insufficient funds');
}

function commit(state, op) {
  state.accounts[op.from].balance -= op.amount;
  state.accounts[op.to].balance += op.amount;
  state.entries.push({ ...op });
  state.operations[op.key] = fingerprint(op);
  return { status: 'ok' };
}

export async function reference(state, op) {
  const previous = state.operations[op.key];
  if (previous !== undefined) {
    if (previous !== fingerprint(op)) throw new Error('idempotency conflict');
    return { status: 'ok' };
  }
  validate(state, op);
  if (op.failBeforeCommit) throw new Error('storage unavailable');
  return commit(state, op);
}

export const candidates = {
  reference,
  'response-only': async () => ({ status: 'ok' }),
  'hidden-corruption': async (state, op) => {
    const result = await reference(state, op);
    state.accounts.c.balance = 0;
    return result;
  },
  'hard-coded-fixture': async (state, op) => {
    if (op.failBeforeCommit) throw new Error('storage unavailable');
    state.accounts.a.balance = 80;
    state.accounts.b.balance = 20;
    state.entries.push({ ...op });
    return { status: 'ok' };
  },
  'validation-disabled': async (state, op) => {
    if (op.failBeforeCommit) throw new Error('storage unavailable');
    return commit(state, op);
  },
  'swallowed-exception': async (state, op) => {
    try { return await reference(state, op); }
    catch { return { status: 'ok' }; }
  },
  'lost-update-race': async (state, op) => {
    validate(state, op);
    const startingBalance = state.accounts[op.from].balance;
    if (op.failBeforeCommit) throw new Error('storage unavailable');
    await Promise.resolve();
    state.accounts[op.from].balance = startingBalance - op.amount;
    state.accounts[op.to].balance += op.amount;
    state.entries.push({ ...op });
    return { status: 'ok' };
  },
  'duplicate-effects': async (state, op) => {
    validate(state, op);
    if (op.failBeforeCommit) throw new Error('storage unavailable');
    return commit(state, op);
  },
  'self-reported-pass': async () => ({ status: 'ok', testsPassed: true, score: 1 }),
};

const unchanged = (state, before) => assert.deepEqual(state, before);
export const graders = {
  'public-response': async (candidate) => {
    assert.equal((await candidate(fixture(), operation())).status, 'ok');
  },
  'committed-effects': async (candidate) => {
    const state = fixture();
    await candidate(state, operation());
    assert.equal(state.accounts.a.balance, 80);
    assert.equal(state.accounts.b.balance, 20);
    assert.equal(state.entries.length, 1);
  },
  'varied-input': async (candidate) => {
    const state = fixture();
    state.accounts.x = state.accounts.a;
    state.accounts.y = state.accounts.b;
    delete state.accounts.a;
    delete state.accounts.b;
    await candidate(state, operation({ from: 'x', to: 'y', amount: 35 }));
    assert.equal(state.accounts.x.balance, 65);
    assert.equal(state.accounts.y.balance, 35);
  },
  'tenant-and-validation': async (candidate) => {
    const validState = fixture();
    await candidate(validState, operation());
    assert.equal(validState.accounts.c.balance, 70);
    for (const changes of [{ to: 'c' }, { amount: -20 }, { amount: 120 }]) {
      const state = fixture();
      const before = structuredClone(state);
      await assert.rejects(() => candidate(state, operation(changes)));
      unchanged(state, before);
    }
  },
  'storage-failure': async (candidate) => {
    const state = fixture();
    const before = structuredClone(state);
    await assert.rejects(() => candidate(state, operation({ failBeforeCommit: true })));
    unchanged(state, before);
  },
  'concurrent-spend': async (candidate) => {
    const state = fixture();
    const outcomes = await Promise.allSettled([
      candidate(state, operation({ amount: 80, key: 'large' })),
      candidate(state, operation({ amount: 30, key: 'small' })),
    ]);
    assert.equal(outcomes.filter((item) => item.status === 'fulfilled').length, 1);
    assert.equal(state.accounts.a.balance + state.accounts.b.balance, 100);
    assert.equal(state.entries.length, 1);
    assert.ok(state.accounts.a.balance >= 0);
  },
  'replay-and-conflict': async (candidate) => {
    const state = fixture();
    await candidate(state, operation());
    const before = structuredClone(state);
    await candidate(state, operation());
    unchanged(state, before);
    await assert.rejects(() => candidate(state, operation({ amount: 21 })));
    unchanged(state, before);
  },
};

export async function runMatrix() {
  const matrix = {};
  for (const [name, candidate] of Object.entries(candidates)) {
    matrix[name] = {};
    for (const [grader, grade] of Object.entries(graders)) {
      try { await grade(candidate); matrix[name][grader] = 'PASS'; }
      catch { matrix[name][grader] = 'FAIL'; }
    }
  }
  return matrix;
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href) {
  const matrix = await runMatrix();
  assert.ok(Object.values(matrix.reference).every((verdict) => verdict === 'PASS'));
  for (const [name, row] of Object.entries(matrix)) {
    if (name !== 'reference') assert.ok(Object.values(row).includes('FAIL'));
  }
  await writeFile(new URL('evaluator-results.json', import.meta.url),
    JSON.stringify({ kind: 'hand-authored mutation experiment', matrix }, null, 2) + '\n');
  console.table(matrix);
}
