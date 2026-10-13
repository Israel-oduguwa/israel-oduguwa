import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// These hand-written candidates probe the grader. They are not model outputs.
const candidates = ["unguarded", "query-key", "abort-only", "success-only", "epoch"];

function controller(kind, search, commit) {
  let epoch = 0;
  let latestQuery;
  let alive = true;
  let abort;
  const start = (query) => {
    const id = ++epoch;
    latestQuery = query;
    abort?.abort();
    abort = new AbortController();
    commit({ status: "loading", query });
    const owns = (isError) => {
      if (kind === "unguarded") return true;
      if (!alive) return false;
      if (kind === "abort-only") return true;
      if (kind === "query-key") return query === latestQuery;
      if (kind === "success-only" && isError) return true;
      return id === epoch;
    };
    search(query, { signal: abort.signal }).then(
      (value) => {
        if (owns(false)) commit({ status: "success", query, value });
      },
      (error) => {
        if (owns(true)) commit({ status: "error", query, error: error.message });
      },
    );
  };
  return {
    start,
    dispose() {
      alive = false;
      epoch += 1;
      abort?.abort();
    },
  };
}

function fixture(kind) {
  const pending = [];
  const events = [];
  // Cancellation is best effort: this transport can finish after abort.
  const search = (query, { signal }) => new Promise((resolve, reject) => {
    pending.push({ query, signal, resolve, reject });
  });
  return {
    ...controller(kind, search, (event) => events.push(event)),
    pending,
    events,
    last: () => events.at(-1),
  };
}

const flush = async () => { await Promise.resolve(); };
const success = (query, value) => ({ status: "success", query, value });
const failure = (query, error) => ({ status: "error", query, error });

const cases = [
  { id: "one-success", suite: "ordinary", run: async (f) => {
    f.start("A"); f.pending[0].resolve("A1"); await flush();
    assert.deepEqual(f.last(), success("A", "A1"));
  } },
  { id: "current-error", suite: "ordinary", run: async (f) => {
    f.start("A"); f.pending[0].reject(new Error("offline")); await flush();
    assert.deepEqual(f.last(), failure("A", "offline"));
  } },
  { id: "sequential-success", suite: "ordinary", run: async (f) => {
    f.start("A"); f.pending[0].resolve("A1"); await flush();
    f.start("B"); f.pending[1].resolve("B1"); await flush();
    assert.deepEqual(f.last(), success("B", "B1"));
  } },
  { id: "overlap-in-order", suite: "ordinary", run: async (f) => {
    f.start("A"); f.start("B");
    f.pending[0].resolve("A1"); await flush();
    f.pending[1].resolve("B1"); await flush();
    assert.deepEqual(f.last(), success("B", "B1"));
  } },
  { id: "late-success", suite: "diagnostic", run: async (f) => {
    f.start("A"); f.start("B");
    assert.equal(f.pending[0].signal.aborted, true);
    f.pending[1].resolve("B1"); await flush();
    const count = f.events.length;
    f.pending[0].resolve("A1"); await flush();
    assert.deepEqual(f.last(), success("B", "B1"));
    assert.equal(f.events.length, count);
  } },
  { id: "ABA-request-identity", suite: "diagnostic", run: async (f) => {
    f.start("A"); f.start("B"); f.start("A");
    f.pending[2].resolve("A-new"); await flush();
    const count = f.events.length;
    f.pending[0].resolve("A-old"); await flush();
    assert.deepEqual(f.last(), success("A", "A-new"));
    assert.equal(f.events.length, count);
    f.pending[1].resolve("B-old"); await flush();
    assert.equal(f.events.length, count);
  } },
  { id: "late-error", suite: "diagnostic", run: async (f) => {
    f.start("A"); f.start("B");
    f.pending[1].resolve("B1"); await flush();
    const count = f.events.length;
    f.pending[0].reject(new Error("old failure")); await flush();
    assert.deepEqual(f.last(), success("B", "B1"));
    assert.equal(f.events.length, count);
  } },
  { id: "after-disposal", suite: "diagnostic", run: async (f) => {
    f.start("A"); f.dispose();
    const count = f.events.length;
    f.pending[0].resolve("A1"); await flush();
    assert.equal(f.events.length, count);
  } },
];

const results = [];
for (const candidate of candidates) {
  for (const task of cases) {
    try {
      await task.run(fixture(candidate));
      results.push({ candidate, case: task.id, suite: task.suite, pass: true });
    } catch (error) {
      if (!(error instanceof assert.AssertionError)) throw error;
      results.push({ candidate, case: task.id, suite: task.suite, pass: false,
        reason: error.message });
    }
  }
}

const count = (candidate, suite) => results.filter((r) =>
  r.candidate === candidate && r.suite === suite && r.pass).length;
const summary = candidates.map((candidate) => ({
  candidate, ordinary: count(candidate, "ordinary"),
  diagnostic: count(candidate, "diagnostic"),
}));

// Catch a broken fixture or accidental repair of an intentional mutation.
assert.deepEqual(summary, [
  { candidate: "unguarded", ordinary: 4, diagnostic: 0 },
  { candidate: "query-key", ordinary: 4, diagnostic: 3 },
  { candidate: "abort-only", ordinary: 4, diagnostic: 1 },
  { candidate: "success-only", ordinary: 4, diagnostic: 3 },
  { candidate: "epoch", ordinary: 4, diagnostic: 4 },
]);
const directory = fileURLToPath(new URL("./", import.meta.url));
mkdirSync(directory, { recursive: true });
writeFileSync(`${directory}/results.json`, `${JSON.stringify({
  provenance: "Hand-written candidates; deterministic controlled completions; no LLM calls",
  summary, results,
}, null, 2)}\n`);
console.table(summary);
