// https://www.radix-ui.com/primitives/docs/components/dialog
// https://getbootstrap.com/docs/5.3/components/modal/

import React, {
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
} from "react";

import { createContext } from "../lib/createContext";
import { useControllableState } from "../lib/useControllableState";
import { Portal as PortalBase } from "../lib/Portal";
import { composeEventHandlers } from "../lib/composeEventHandlers";

interface ModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  clickOverlayToClose: boolean;
}

const [ModalProvider, useModal] = createContext<ModalContextValue>("Root");

interface RootProps extends ComponentPropsWithoutRef<"div"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  clickOverlayToClose?: boolean;
}

const Root = forwardRef<HTMLDivElement, RootProps>(function Root(
  props,
  forwardRef
) {
  const {
    children,
    open: value,
    onOpenChange: onChange,
    defaultOpen: defaultValue,
    clickOverlayToClose = false,
    ...rest
  } = props;
  const [open = false, setOpen] = useControllableState({
    value,
    onChange,
    defaultValue,
  });
  return (
    <ModalProvider
      open={open}
      setOpen={setOpen}
      clickOverlayToClose={clickOverlayToClose}
    >
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    </ModalProvider>
  );
});
interface PortalProps extends ComponentPropsWithoutRef<"div"> {}

const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  props: PortalProps
) {
  const { open, setOpen, clickOverlayToClose } = useModal("Portal");
  const { children, onClick, ...rest } = props;
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (clickOverlayToClose) {
        setOpen(false);
        e.stopPropagation();
      }
    },
    [clickOverlayToClose, setOpen]
  );
  const composedHandleClick = composeEventHandlers(handleClick, onClick);
  if (!open) return null;
  return (
    <PortalBase {...rest} onClick={composedHandleClick}>
      {children}
    </PortalBase>
  );
});

interface TriggerProps extends ComponentPropsWithoutRef<"div"> {}
const Trigger = forwardRef<HTMLDivElement, TriggerProps>(function Trigger(
  props,
  forwardRef
) {
  const { setOpen } = useModal("Trigger");
  const { children, onClick, ...rest } = props;
  const handleClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      setOpen(true);
    }, [setOpen]);
  const composedHandleClick = composeEventHandlers(handleClick, onClick);
  return (
    <div {...rest} onClick={composedHandleClick} ref={forwardRef}>
      {children}
    </div>
  );
});

interface ContentProps extends ComponentPropsWithoutRef<"div"> {}
const Content = forwardRef<HTMLDivElement, ContentProps>(function Content(
  props,
  forwardRef
) {
  const { clickOverlayToClose } = useModal("Content");
  const { children, onClick, ...rest } = props;
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (clickOverlayToClose) {
        e.stopPropagation();
      }
    },
    [clickOverlayToClose]
  );
  const composedHandleClick = composeEventHandlers(handleClick, onClick);
  return (
    <div {...rest} onClick={composedHandleClick} ref={forwardRef}>
      {children}
    </div>
  );
});

const Dialog = {
  Root,
  Portal,
  Trigger,
  Content,
  useModal,
};

export { Dialog };
