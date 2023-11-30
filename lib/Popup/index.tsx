import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from "@floating-ui/react";
import * as React from "react";
import { Portal } from "../Portal";
import { Slot, createContext, useComposeRefs } from "..";
import { useControlled } from "../useControlled";

interface ChildrenProps {
  open: boolean;
  handleExited: () => void;
  handleEnter: () => void;
}

interface PopupProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  open: boolean;
  anchor: HTMLElement | null | undefined;
  withTransition?: boolean;
  children?: ((props: ChildrenProps) => React.ReactNode) | React.ReactNode;
  asChild?: boolean;
  keepMounted?: boolean;
}

const Popup = React.forwardRef<HTMLDivElement, PopupProps>(
  (props, forwardRef) => {
    const {
      asChild,
      children,
      open,
      anchor,
      withTransition,
      keepMounted = false,
      ...rest
    } = props;
    const [exited, setExited] = React.useState(true);

    const { refs, floatingStyles, elements, update } = useFloating({
      elements: {
        reference: anchor,
      },
      open: open,
      placement: "bottom",
      middleware: [offset(8), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const composedRef = useComposeRefs<HTMLDivElement>(
      forwardRef,
      refs.setFloating
    );

    const handleExited = React.useCallback(() => {
      setExited(true);
    }, []);

    const handleEnter = React.useCallback(() => {
      setExited(false);
    }, []);

    React.useLayoutEffect(() => {
      if (open && elements.reference && elements.floating) {
        const cleanup = autoUpdate(
          elements.reference,
          elements.floating,
          update
        );
        return cleanup;
      }
    }, [open, elements, update]);

    const shouldRender = open || keepMounted || (withTransition && !exited);

    if (!shouldRender) return null;

    const Comp = asChild ? Slot : "div";
    const notDisplay = !open && keepMounted ? { display: "none" } : undefined;

    return (
      <Portal>
        <Comp
          ref={composedRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            ...floatingStyles,
            ...notDisplay,
          }}
          {...rest}
        >
          {typeof children === "function"
            ? children({ open, handleExited, handleEnter })
            : children}
        </Comp>
      </Portal>
    );
  }
);

interface PopupContextValue {
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
}

const [PopupProvider, usePopup] = createContext<PopupContextValue>("PopupRoot");

interface PopupRootProps extends React.ComponentPropsWithoutRef<"div"> {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
}
const PopupRoot = React.forwardRef<HTMLDivElement, PopupRootProps>(
  function PopupRoot(props: PopupRootProps, forwardRef) {
    const {
      children,
      isOpen: isOpenProp,
      defaultIsOpen = false,
      onIsOpenChange,
      ...rest
    } = props;
    const triggerRef = React.useRef<HTMLElement | null>(null);

    const [isOpen = defaultIsOpen, setIsOpen] = useControlled({
      controlled: isOpenProp,
      defaultProp: defaultIsOpen,
    });

    const handleIsOpenChange = React.useCallback(
      (isOpen: boolean) => {
        setIsOpen(isOpen);
        onIsOpenChange?.(isOpen);
      },
      [onIsOpenChange, setIsOpen]
    );

    return (
      <div ref={forwardRef} {...rest}>
        <PopupProvider
          triggerRef={triggerRef}
          isOpen={isOpen}
          onIsOpenChange={handleIsOpenChange}
        >
          {children}
        </PopupProvider>
      </div>
    );
  }
);

interface PopupTriggerProps extends React.ComponentPropsWithoutRef<"div"> {}
const PopupTrigger = React.forwardRef<HTMLDivElement, PopupTriggerProps>(
  function PopupTrigger(props: PopupTriggerProps, forwardRef) {
    const { children, ...rest } = props;

    return (
      <div ref={composedRef} {...rest}>
        {children}
      </div>
    );
  }
);

export { Popup };
