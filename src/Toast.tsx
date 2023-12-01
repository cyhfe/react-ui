import * as React from "react";
import { Portal } from "../lib/Portal";
import { v4 as uuid } from "uuid";

import { createStore } from "./createStore";

function reducer(prev, action) {
  switch (action.type) {
    case "add":
      return [...prev, action.payload];

    case "remove":
      return prev.filter((toast) => toast.id !== action.payload);

    default:
      return prev;
  }
}

export function addToast(toast) {
  const id = uuid();
  store.dispatch({
    type: "add",
    payload: {
      ...toast,
      id,
    },
  });
}

export function removeToast(id) {
  store.dispatch({ type: "remove", payload: id });
}

const defaultState = [];
const store = createStore(reducer, defaultState);

export function Toaster() {
  const [toasts, setToasts] = React.useState(() => store.getState());

  React.useEffect(() => {
    const unsubscribe = store.subscribe(setToasts);
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    console.log(toasts);
  }, [toasts]);

  return (
    <Portal>
      <div className="fixed top-0 right-0 flex flex-col">
        {toasts.map((toast) => {
          return (
            <span>
              {toast.content}
              <button
                onClick={() => {
                  removeToast(toast.id);
                }}
              >
                x
              </button>
            </span>
          );
        })}
      </div>
    </Portal>
  );
}
