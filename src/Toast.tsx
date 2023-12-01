import * as React from "react";
import { Portal } from "../lib/Portal";
import { v4 as uuid } from "uuid";

import { createStore } from "./createStore";

interface Toast {
  content: string;
}

type ToastWithId = Toast & {
  id: string;
};

type State = ToastWithId[];
interface AddAction {
  type: "add";
  payload: ToastWithId;
}

interface RemoveAction {
  type: "remove";
  payload: string;
}

type Action = AddAction | RemoveAction;

function reducer(prev: State, action: Action) {
  switch (action.type) {
    case "add":
      return [...prev, action.payload];

    case "remove":
      return prev.filter((toast) => toast.id !== action.payload);

    default:
      return prev;
  }
}

export function addToast(toast: Toast) {
  const id = uuid();
  store.dispatch({
    type: "add",
    payload: {
      ...toast,
      id,
    },
  });
}

export function removeToast(id: string) {
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
            <ToastRoot toast={toast} key={toast.id}>
              {toast.content}
              <button
                onClick={() => {
                  removeToast(toast.id);
                }}
              >
                x
              </button>
            </ToastRoot>
          );
        })}
      </div>
    </Portal>
  );
}

interface ToastRootProps extends React.ComponentPropsWithoutRef<"div"> {
  autoClose?: boolean;
  toast: ToastWithId;
  delay?: number;
}

const ToastRoot = React.forwardRef<HTMLDivElement, ToastRootProps>(
  function ToastRoot(props: ToastRootProps, forwardRef) {
    const { children, autoClose = true, delay = 3000, toast, ...rest } = props;

    React.useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      if (autoClose) {
        timer = setTimeout(() => {
          removeToast(toast.id);
        }, delay);
      }
      return () => timer && clearTimeout(timer);
    }, [autoClose, delay, toast.id]);

    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);
