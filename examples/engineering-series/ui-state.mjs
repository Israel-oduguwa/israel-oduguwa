export const initialState = {
  draft: { name: '' }, revision: 0, validation: { status: 'idle' },
};

export function reducer(state, event) {
  switch (event.type) {
    case 'edit':
      return { draft: { ...state.draft, ...event.patch }, revision: state.revision + 1,
        validation: { status: 'idle' } };
    case 'validation_started':
      if (event.revision !== state.revision) return state;
      return { ...state, validation: { status: 'pending', token: event.token,
        revision: event.revision } };
    case 'validation_finished':
      if (state.validation.status !== 'pending' || event.token !== state.validation.token ||
          event.revision !== state.revision) return state;
      return { ...state, validation: { status: event.valid ? 'valid' : 'invalid',
        revision: event.revision } };
    default:
      return state;
  }
}

export const canAdvance = (state) => state.validation.status === 'valid' &&
  state.validation.revision === state.revision;
