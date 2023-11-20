interface Handler<T extends unknown[]> {
  (...args: T): void;
}

function composeEventHandlers<T extends unknown[]>(
  ...handlers: (Handler<T> | undefined)[]
) {
  return function composedHandler(...args: T) {
    for (const handler of handlers) {
      if (typeof handler === "function") {
        handler(...args);
      }
    }
  };
}

export { composeEventHandlers };
