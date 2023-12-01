import * as React from "react";
import { Portal } from "../Portal";
import { v4 as uuid } from "uuid";

import { ToastRoot, createStore } from ".";
import { MdClose } from "react-icons/md";

export default {
  title: "Components/Toast",
};

function Root({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}

export function App() {
  return (
    <Root>
      <div className="flex gap-x-2">
        <button
          className="border border-black rounded px-2 py-1"
          onClick={() => addToast({ content: "autoClose", autoClose: true })}
        >
          autoClose
        </button>
        <button
          className="border border-black rounded px-2 py-1"
          onClick={() =>
            addToast({ content: "autoClose false", autoClose: false })
          }
        >
          autoClose false
        </button>
      </div>
    </Root>
  );
}

interface Toast {
  content: string;
  autoClose?: boolean;
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

function addToast(toast: Toast) {
  const id = uuid();
  store.dispatch({
    type: "add",
    payload: {
      ...toast,
      id,
    },
  });
}

function removeToast(id: string) {
  store.dispatch({ type: "remove", payload: id });
}

const defaultState: State = [];
const store = createStore<State, Action>(reducer, defaultState);

function Toaster() {
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
        <div className="m-4 flex flex-col gap-y-2">
          {toasts.map((toast) => {
            return (
              <ToastRoot
                onRemove={() => removeToast(toast.id)}
                key={toast.id}
                autoClose={toast.autoClose}
              >
                <div className="px-4 py-3 shadow relative w-[180px] rounded border">
                  {toast.content}
                  <button
                    onClick={() => {
                      removeToast(toast.id);
                    }}
                    className="absolute top-0 right-0 p-1 hover:bg-slate-200 hover:fill-slate-600 fill-slate-400"
                  >
                    <MdClose className="fill-inherit" />
                  </button>
                </div>
              </ToastRoot>
            );
          })}
        </div>
      </div>
    </Portal>
  );
}
