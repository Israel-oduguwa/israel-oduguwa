export function admission(limit) {
  if (!Number.isSafeInteger(limit) || limit < 1) throw new Error('invalid limit');
  let active = 0;
  let accepting = true;
  return {
    acquire() {
      if (!accepting || active >= limit) return null;
      active += 1;
      let released = false;
      return () => {
        if (!released) { released = true; active -= 1; }
      };
    },
    stop() { accepting = false; },
    get active() { return active; },
  };
}
