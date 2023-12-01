import * as React from "react";

let memoryState = [];

function toast(value: string) {
  memoryState = [...memoryState, value];
  listener.forEach((cb) => {
    cb([...memoryState]);
  });
}

const listener = new Set();

function Toaster() {
  const [toasts, setToasts] = React.useState(memoryState);

  React.useEffect(() => {
    listener.add(setToasts);
    return () => {
      listener.delete(setToasts);
    };
  }, []);

  React.useEffect(() => {
    console.log(toasts);
  }, [toasts]);

  return (
    <div>
      {toasts.map((toast) => {
        return <span>{toast}</span>;
      })}
    </div>
  );
}
