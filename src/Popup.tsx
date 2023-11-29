import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from "@floating-ui/react";
import * as React from "react";
import { Portal } from "../lib/Portal";

function Popup(props: any) {
  const { children, open, anchor, withTransition } = props;
  const [exited, setExited] = React.useState(false);

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
    <Portal style={{ position: "absolute", left: 0, top: 0 }}>
      <div ref={refs.setFloating} style={floatingStyles}>
        {typeof children === "function"
          ? children({ open, handleExited })
          : children}
      </div>
    </Portal>
  );
}

export function PopupDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div>
      <button ref={triggerRef} onClick={() => setIsOpen((prev) => !prev)}>
        trigger
      </button>
      <Popup open={isOpen} anchor={triggerRef.current}>
        content
      </Popup>
    </div>
  );
}
