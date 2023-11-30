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
import { useStableCallback } from "../useStableCallback";

interface ChildrenProps {
  isOpen: boolean;
  handleExited: () => void;
  handleEnter: () => void;
}

interface PopupProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  withTransition?: boolean;
  children?: ((props: ChildrenProps) => React.ReactNode) | React.ReactNode;
  asChild?: boolean;
  keepMounted?: boolean;
}

const PopupContent = React.forwardRef<HTMLDivElement, PopupProps>(
  (props, forwardRef) => {
    const {
      asChild,
      children,
      withTransition,
      keepMounted = false,
      ...rest
    } = props;
    const [exited, setExited] = React.useState(true);
    const { isOpen, triggerRef, handleClose, closeOnClickoutside } =
      usePopup("PopupContent");

    const anchor = triggerRef.current;

    const { refs, floatingStyles, elements, update } = useFloating({
      elements: {
        reference: anchor,
      },
      open: isOpen,
      placement: "bottom",
      middleware: [offset(8), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const contentRef = React.useRef<HTMLDivElement>(null);

    const composedRef = useComposeRefs<HTMLDivElement>(
      forwardRef,
      refs.setFloating,
      contentRef
    );

    const handleExited = React.useCallback(() => {
      setExited(true);
    }, []);

    const handleEnter = React.useCallback(() => {
      setExited(false);
    }, []);

    React.useLayoutEffect(() => {
      if (isOpen && elements.reference && elements.floating) {
        const cleanup = autoUpdate(
          elements.reference,
          elements.floating,
          update
        );
        return cleanup;
      }
    }, [elements, update, isOpen]);

    React.useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (!isOpen || !closeOnClickoutside) return;
        if (!contentRef.current?.contains(e.target as Node)) {
          handleClose();
        }
      };
      window.addEventListener("click", handleClick);
      return () => window.removeEventListener("click", handleClick);
    }, [closeOnClickoutside, handleClose, isOpen]);

    const shouldRender = isOpen || (withTransition && !exited) || keepMounted;
    if (!shouldRender) return null;

    const Comp = asChild ? Slot : "div";
    const notDisplay = !isOpen && keepMounted ? { display: "none" } : undefined;

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
            ? children({ isOpen, handleExited, handleEnter })
            : children}
        </Comp>
      </Portal>
    );
  }
);

interface PopupContextValue {
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  isOpen: boolean;
  handleToggle: () => void;
  handleClose: () => void;
  closeOnClickoutside: boolean;
}

const [PopupProvider, usePopup] = createContext<PopupContextValue>("PopupRoot");

interface PopupRootProps extends React.ComponentPropsWithoutRef<"div"> {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
  closeOnClickoutside?: boolean;
}
const PopupRoot = React.forwardRef<HTMLDivElement, PopupRootProps>(
  function PopupRoot(props: PopupRootProps, forwardRef) {
    const {
      children,
      isOpen: isOpenProp,
      defaultIsOpen = false,
      onIsOpenChange = () => {},
      closeOnClickoutside = false,
      ...rest
    } = props;
    const triggerRef = React.useRef<HTMLElement | null>(null);

    const [isOpen = defaultIsOpen, setIsOpen] = useControlled({
      controlled: isOpenProp,
      defaultProp: defaultIsOpen,
    });

    const onChange = useStableCallback(onIsOpenChange);

    const handleClose = React.useCallback(() => {
      setIsOpen(false);
      onChange?.(false);
    }, [onChange, setIsOpen]);

    const handleToggle = React.useCallback(() => {
      setIsOpen(!isOpen);
      onChange?.(!isOpen);
    }, [isOpen, onChange, setIsOpen]);

    return (
      <div ref={forwardRef} {...rest}>
        <PopupProvider
          triggerRef={triggerRef}
          isOpen={isOpen}
          handleToggle={handleToggle}
          handleClose={handleClose}
          closeOnClickoutside={closeOnClickoutside}
        >
          {children}
        </PopupProvider>
      </div>
    );
  }
);

interface PopupTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}
const PopupTrigger = React.forwardRef<Element, PopupTriggerProps>(
  function PopupTrigger(props: PopupTriggerProps, forwardRef) {
    const { children, asChild = false, ...rest } = props;
    const { triggerRef, handleToggle, closeOnClickoutside } =
      usePopup("PopupTrigger");
    const composedRef = useComposeRefs(triggerRef, forwardRef);
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={composedRef}
        {...rest}
        onClick={(e) => {
          handleToggle();
          closeOnClickoutside && e.stopPropagation();
        }}
      >
        {children}
      </Comp>
    );
  }
);

export { PopupContent, PopupTrigger, PopupRoot };
