export function createStore(reducer, defaultState) {
  let currentState = defaultState;
  const listeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      listeners.filter((l) => l !== listener);
    };
  }

  function dispatch(action) {
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

function reducer(state = 0, action) {
  switch (action.type) {
    case "add": {
      return ++state;
    }
    default: {
      return state;
    }
  }
}

// const store = createStore(reducer, 0);

// store.subscribe(() => {
//   console.log(store.getState());
// });

// store.dispatch({ type: "add" });
// store.dispatch({ type: "add" });
// store.dispatch({ type: "add" });
