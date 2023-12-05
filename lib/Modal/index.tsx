// https://www.radix-ui.com/primitives/docs/components/dialog
// https://getbootstrap.com/docs/5.3/components/modal/

import React, {
  ComponentPropsWithoutRef,
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

const [ModalProvider, useModal] = createContext<ModalContextValue>("ModalRoot");

interface ModalRootProps extends ComponentPropsWithoutRef<"div"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  clickOverlayToClose?: boolean;
}

const ModalRoot = forwardRef<HTMLDivElement, ModalRootProps>(function ModalRoot(
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
interface ModalPortalProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

const ModalPortal = forwardRef<HTMLDivElement, ModalPortalProps>(
  function ModalPortal(props: ModalPortalProps, forwardRef) {
    const { open } = useModal("ModalPortal");

    if (!open) return null;
    return <PortalBase {...props} ref={forwardRef} />;
  }
);

interface ModalOverlayProps extends ComponentPropsWithoutRef<"div"> {
  render?: (props: {
    clickToClose: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    open: boolean;
  }) => ReactNode;
}

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  function ModalOverlay(props: ModalOverlayProps, forwardRef) {
    const { open, setOpen, clickOverlayToClose } = useModal("ModalOverlay");
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
  }
);

interface ModalTriggerProps extends ComponentPropsWithoutRef<"div"> {}
const ModalTrigger = forwardRef<HTMLDivElement, ModalTriggerProps>(
  function ModalTrigger(props, forwardRef) {
    const { setOpen } = useModal("ModalTrigger");
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
  }
);

type ModalCloseProps = ModalTriggerProps;

const ModalClose = forwardRef<HTMLDivElement, ModalCloseProps>(function Trigger(
  props,
  forwardRef
) {
  const { setOpen } = useModal("ModalClose");
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

interface ModalContentProps extends ComponentPropsWithoutRef<"div"> {}
const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  function ModalContent(props, forwardRef) {
    const { clickOverlayToClose } = useModal("ModalContent");
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
  }
);

// const Modal = ModalRoot;
// const ModalPortal = Portal;
// const ModalTrigger = Trigger;
// const ModalContent = Content;
// const ModalClose = Close;
// const ModalOverlay = Overlay;

export {
  ModalRoot,
  ModalPortal,
  ModalTrigger,
  ModalContent,
  ModalClose,
  ModalOverlay,
  useModal,
};

export type {
  ModalRootProps,
  ModalPortalProps,
  ModalTriggerProps,
  ModalContentProps,
  ModalCloseProps,
  ModalOverlayProps,
};
