import * as React from "react";

interface ToastRootProps extends React.ComponentPropsWithoutRef<"div"> {
  autoClose?: boolean;
  delay?: number;
  onRemove?: () => void;
}

const ToastRoot = React.forwardRef<HTMLDivElement, ToastRootProps>(
  function ToastRoot(props: ToastRootProps, forwardRef) {
    const {
      children,
      autoClose = true,
      onRemove = () => {},
      delay = 3000,
      ...rest
    } = props;

    React.useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      if (autoClose) {
        timer = setTimeout(() => {
          onRemove();
        }, delay);
      }
      return () => timer && clearTimeout(timer);
    }, [autoClose, delay, onRemove]);

    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);

export { ToastRoot };
export type { ToastRootProps };
export { createStore } from "./createStore";
