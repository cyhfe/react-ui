import { ComponentPropsWithoutRef, forwardRef } from "react";
import { createPortal } from "react-dom";

interface PortalProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  container?: Element | DocumentFragment;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  props: PortalProps,
  forwardRef
) {
  const { container = document.body, ...rest } = props;
  return createPortal(<div {...rest} ref={forwardRef} />, container);
});

export { Portal };
