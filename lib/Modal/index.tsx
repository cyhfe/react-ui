// https://www.radix-ui.com/primitives/docs/components/dialog
// https://getbootstrap.com/docs/5.3/components/modal/

import React, {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useCallback,
} from "react";

import { createContext } from "../createContext";
import { useControllableState } from "../useControllableState";
import { Portal as PortalBase } from "../Portal";
import { composeEventHandlers } from "../composeEventHandlers";
import { Slot } from "../Slot";

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
    clickOverlayToClose = true,
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
interface PortalProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(
  props: PortalProps,
  forwardRef
) {
  const { open } = useModal("Portal");

  if (!open) return null;
  return <PortalBase {...props} ref={forwardRef} />;
});

interface OverlayProps extends ComponentPropsWithoutRef<"div"> {
  render?: (props: {
    clickToClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    open: boolean;
  }) => ReactNode;
}

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(function Overlay(
  props: OverlayProps,
  forwardRef
) {
  const { open, setOpen, clickOverlayToClose } = useModal("Overlay");
  const { children, onClick, render, ...rest } = props;
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
  if (render) {
    return render({ clickToClose: handleClick, open });
  }
  if (!open) return null;
  return (
    <div {...rest} onClick={composedHandleClick} ref={forwardRef}>
      {children}
    </div>
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

const Close = forwardRef<HTMLDivElement, TriggerProps>(function Trigger(
  props,
  forwardRef
) {
  const { setOpen } = useModal("Close");
  const { children, onClick, ...rest } = props;
  const handleClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      setOpen(false);
    }, [setOpen]);
  const composedHandleClick = composeEventHandlers(handleClick, onClick);
  return (
    <Slot {...rest} onClick={composedHandleClick} ref={forwardRef}>
      {children}
    </Slot>
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

const Modal = Root;
const ModalPortal = Portal;
const ModalTrigger = Trigger;
const ModalContent = Content;
const ModalClose = Close;
const ModalOverlay = Overlay;

export {
  Modal,
  ModalPortal,
  ModalTrigger,
  ModalContent,
  useModal,
  ModalClose,
  ModalOverlay,
};
