export function createStore<State, Action>(
  reducer: (state: State, action: Action) => State,
  defaultState: State
): {
  getState: () => State;
  subscribe: (listener: (state: State) => void) => () => void;
  dispatch: (action: Action) => void;
} {
  let currentState = defaultState;
  const listeners: ((state: State) => void)[] = [];

  function getState(): State {
    return currentState;
  }

  function subscribe(listener: (state: State) => void): () => void {
    listeners.push(listener);
    return function unsubscribe() {
      listeners.filter((l) => l !== listener);
    };
  }

  function dispatch(action: Action): void {
    currentState = reducer(currentState, action);
    listeners.forEach((l) => l(currentState));
  }

  const store = {
    getState,
    subscribe,
    dispatch,
  };

  return store;
}
