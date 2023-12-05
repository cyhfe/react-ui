import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import { Slot } from "..";

interface PortalProps {
  children: React.ReactNode;
  container?: Element | DocumentFragment;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  props: PortalProps,
  forwardRef
) {
  const { container = document.body, ...rest } = props;
  return createPortal(<Slot {...rest} ref={forwardRef} />, container);
});

export { Portal };

export type { PortalProps };
