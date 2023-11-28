import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from "@floating-ui/react";
import * as React from "react";
import { Portal } from "../Portal";

function Popup(props: any) {
  const { children, open, anchor, withTransition } = props;
  const [exited, setExited] = React.useState(true);

  const { refs, floatingStyles, elements, update } = useFloating({
    elements: {
      reference: anchor,
    },
    open: open,
    placement: "bottom",
    middleware: [offset(20), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const handleExited = React.useCallback(() => {
    setExited(true);
  }, []);

  const handleEnter = React.useCallback(() => {
    console.log("enter");
    setExited(false);
  }, []);

  React.useLayoutEffect(() => {
    if (open && elements.reference && elements.floating) {
      const cleanup = autoUpdate(elements.reference, elements.floating, update);
      return cleanup;
    }
  }, [open, elements, update]);

  const shouldRender = open || (withTransition && !exited);

  if (!shouldRender) return null;

  return (
    <Portal>
      <div
        ref={refs.setFloating}
        style={{ position: "absolute", left: 0, top: 0, ...floatingStyles }}
      >
        {typeof children === "function"
          ? children({ open, handleExited, handleEnter })
          : children}
      </div>
    </Portal>
  );
}

export { Popup };
