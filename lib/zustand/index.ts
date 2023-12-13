import { useRef, useReducer, useEffect } from "react";

const create = (initStore) => {
  let state = {};
  let listeners = new Set();

  /** Compare the previous state with the next state  */
  /** If the state has changed, we run our listeners and update our state 
    (refer to subscribe method to see why)  */

  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (nextState !== state) {
      state = replace ? nextState : { ...state, ...nextState };
      listeners.forEach((listener) => listener(state, nextState));
    }
  };

  /** return the entire state */

  const getState = () => state;

  /** Subscribe to a slice of state similar to redux */
  /** If the slice changes, then and only then */
  /** run the listener  */
  /** listenerToAdd is closing over the currentState, each time the listenerToAdd runs,  */
  /** It compares the new state slice with the previous slice and runs the listener*/
  /** We then update currentSlice to keep it in sync  */

  const subscribeWithListener = (
    listener,
    selector,
    equalityFn = Object.is
  ) => {
    let currentSlice = selector(state);
    function listenerToAdd() {
      const nextSlice = selector(state);
      if (!equalityFn(currentSlice, nextSlice)) {
        const previousSlice = currentSlice;
        listener((currentSlice = nextSlice), previousSlice);
      }
    }

    listeners.add(listenerToAdd);
    return () => listeners.delete(listenerToAdd);
  };

  /**  Subscribe without a listener */

  const subscribe = (listener, selector, equalityFn) => {
    if (selector || equalityFn) {
      return subscribeWithListener(listener, selector, equalityFn);
    }

    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const destroy = () => listeners.clear();

  const api = {
    setState,
    getState,
    subscribe,
    destroy,
  };

  /* Run our initialState with the following arguments to build our store */

  state = initStore(setState, getState, api);
  return api;
};

const createStore = (initState) => {
  // create a new store by passing the initial state
  // to the create function we created above
  const api = typeof initState === "function" ? create(initState) : initState;

  const useStore = (selector, equalityFn = Object.is) => {
    // useStore accepts a selector and an equality Fn
    // using ref to store to prevent unnecessary re-renders

    const state = api.getState();
    const stateRef = useRef(state);
    const selectorRef = useRef(selector);
    const errorRef = useRef(false);
    const equalityFnRef = useRef(equalityFn);

    // When the slice of state changes, the component
    // using the hook must re-render to reflect the latest state.
    // Using a force-render mechanism using useReducer is
    // one way to re-render the component

    const [, forceRender] = useReducer((c) => c + 1, 0);
    const currentStateSlice = useRef();

    if (!currentStateSlice.current) {
      currentStateSlice.current = selector(state);
    }

    // using local variables to avoid mutations
    // in the render phase

    let hasNewStateSlice;
    let newStateSlice;

    // If the state, the selector, the equality Fn changes
    // it means, the state *might* have changed

    if (
      selectorRef.current !== selector ||
      equalityFnRef.current !== equalityFnRef ||
      stateRef.current !== state ||
      errorRef.current
    ) {
      newStateSlice = selector(state);
      hasNewStateSlice = !equalityFn(newStateSlice, currentStateSlice.current);
    }

    // At *each* render, Updating everything to the latest version

    useEffect(() => {
      if (hasNewStateSlice) {
        currentStateSlice.current = newStateSlice;
      }
      stateRef.current = state;
      selectorRef.current = selectorRef;
      equalityFnRef.current = equalityFn;
      errorRef.current = false;
    });

    // recording the state just before our listener is initialized

    const stateBeforeListenerRef = useRef(state);

    // *the heart of the hook* //

    useEffect(() => {
      // When the hook is first called, (the first render),
      // a listener is initalized which checks if the state has changed
      // Compares the previous slice of state with the new slice of state
      // using the equality function

      // If anything changes, re-render the component to reflect the latest state
      // otherwise, if there is an error, store that error in a ref to retry
      // at the next render.

      // This listener is stored in the set defined with the
      // *create* API above
      function listener() {
        try {
          const nextState = api.getState();
          const nextStateSlice = selectorRef(nextState);
          if (
            !equalityFnRef.current(nextStateSlice, currentStateSlice.current)
          ) {
            // update the state
            stateRef.current = nextState;
            currentStateSlice.current = nextStateSlice;
            forceRender();
          }
        } catch (e) {
          errorRef.current = true;
          forceRender();
        }
      }

      // an unsubscribe function to be called
      // when the component unmounts, *see useEffect return value*
      const unsubscribe = api.subscribe(listener);
      // Call the listener immediately if the state changed before the
      // listener was initialised
      if (api.getState() !== stateBeforeListenerRef.current) {
        listener();
      }

      return unsubscribe;
    }, []);

    // return the new slice of state if the slice of state has changed
    return hasNewStateSlice ? newStateSlice : currentStateSlice.current;
  };

  Object.assign(useStore, api);
  return useStore;
};

export default createStore;
