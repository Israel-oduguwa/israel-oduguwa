export function transition(current, command, actor) {
  if (actor.tenant !== current.tenant) throw new Error('forbidden');
  if (command.expectedVersion !== current.version) throw new Error('version conflict');
  let next;
  let effects = [];
  switch (command.type) {
    case 'submit':
      if (current.status !== 'draft' || actor.id !== current.applicant) throw new Error('invalid transition');
      next = 'review';
      break;
    case 'approve':
      if (current.status !== 'review' || actor.role !== 'reviewer' || actor.id === current.applicant) {
        throw new Error('invalid transition');
      }
      next = 'payment_pending';
      effects = [{ type: 'request_payment', operationId: `${current.id}:payment:1` }];
      break;
    case 'payment_confirmed':
      if (current.status !== 'payment_pending' || actor.role !== 'payment_service') {
        throw new Error('invalid transition');
      }
      next = 'active';
      break;
    default:
      throw new Error('unknown command');
  }
  return { state: { ...current, status: next, version: current.version + 1 }, effects };
}
