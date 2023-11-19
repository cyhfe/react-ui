interface Handler<T extends unknown[]> {
  (...args: T): void;
}

function composeEventHandlers<T extends unknown[]>(...handlers: Handler<T>[]) {
  return function composedHandler(...args: T) {
    for (const handler of handlers) {
      handler(...args);
    }
  };
}

export { composeEventHandlers };
