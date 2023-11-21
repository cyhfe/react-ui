import { HTMLAttributes, forwardRef } from "react";
import { createPortal } from "react-dom";
import { Slot } from "..";
// import { Slot } from "..";
interface PortalProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  container?: Element | DocumentFragment;
}

const Portal = forwardRef<HTMLElement, PortalProps>(function Portal(
  props: PortalProps,
  forwardRef
) {
  const { container = document.body, children, ...rest } = props;
  const child = (
    <Slot ref={forwardRef} {...rest}>
      {children}
    </Slot>
  );
  return createPortal(child, container);
});

export { Portal };
