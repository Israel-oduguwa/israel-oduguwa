export function simulate({ count = 500, gapMs = 10, serviceMs = 80,
  slots = 4, deadlineMs = 250, policy = 'queue' } = {}) {
  const available = Array(slots).fill(0);
  const outcomes = [];
  for (let id = 0; id < count; id++) {
    const arrival = id * gapMs;
    const slot = available.indexOf(Math.min(...available));
    const start = Math.max(arrival, available[slot]);
    const finish = start + serviceMs;
    if (policy === 'deadline' && finish - arrival > deadlineMs) {
      outcomes.push({ id, arrival, outcome: 'rejected', waitMs: 0 });
      continue;
    }
    available[slot] = finish;
    outcomes.push({ id, arrival, start, finish,
      waitMs: start - arrival, latencyMs: finish - arrival,
      outcome: finish - arrival <= deadlineMs ? 'timely' : 'late' });
  }
  const accepted = outcomes.filter(row => row.outcome !== 'rejected');
  return { policy, offered: count, admitted: accepted.length,
    timely: outcomes.filter(row => row.outcome === 'timely').length,
    late: outcomes.filter(row => row.outcome === 'late').length,
    rejected: outcomes.filter(row => row.outcome === 'rejected').length,
    maximumAcceptedLatencyMs: Math.max(0, ...accepted.map(row => row.latencyMs)),
    lastCompletionMs: Math.max(0, ...accepted.map(row => row.finish)) };
}
