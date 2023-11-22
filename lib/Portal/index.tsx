import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import type { AsChildPropsWithRef } from "../types";
import { Slot } from "..";

interface PortalProps extends AsChildPropsWithRef<"div"> {
  children: React.ReactNode;
  container?: Element | DocumentFragment;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  props: PortalProps,
  forwardRef
) {
  const { container = document.body, asChild, ...rest } = props;
  const Comp = asChild ? Slot : "div";
  return createPortal(<Comp {...rest} ref={forwardRef} />, container);
});

export { Portal };
