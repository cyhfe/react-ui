import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from "@floating-ui/react";
import * as React from "react";
import { Portal } from "../Portal";
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";
import { useComposeRefs } from "..";

interface ChildrenProps {
  open: boolean;
  handleExited: () => void;
  handleEnter: () => void;
}

interface PopupBaseProps {
  open: boolean;
  anchor: HTMLElement | null | undefined;
  withTransition?: boolean;
  children?: ((props: ChildrenProps) => React.ReactNode) | React.ReactNode;
}

interface PopupTypeMap<RootElementType extends React.ElementType> {
  props: PopupBaseProps;
  defaultRootComponent: RootElementType;
}

type PopupProps<RootComponentType extends React.ElementType> =
  PolymorphicComponentPropWithRef<PopupTypeMap<RootComponentType>>;

type PopupComponent = <RootComponentType extends React.ElementType = "div">(
  props: PopupProps<RootComponentType>
) => React.ReactNode | null;

const Popup = React.forwardRef(
  <RootComponentType extends React.ElementType = "div">(
    props: PopupProps<RootComponentType>,
    forwardRef?: PolymorphicRef<PopupTypeMap<RootComponentType>>
  ) => {
    const { as, children, open, anchor, withTransition, ...rest } = props;
    const [exited, setExited] = React.useState(true);

    const { refs, floatingStyles, elements, update } = useFloating({
      elements: {
        reference: anchor,
      },
      open: open,
      placement: "bottom",
      middleware: [offset(), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });

    const composedRef = useComposeRefs(refs.setFloating, forwardRef);

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

    const shouldRender = open || (withTransition && !exited);

    if (!shouldRender) return null;

    const Comp = as ?? "div";

    return (
      <Portal>
        <Comp
          ref={composedRef}
          style={{ position: "absolute", left: 0, top: 0, ...floatingStyles }}
          {...rest}
        >
          {typeof children === "function"
            ? children({ open, handleExited, handleEnter })
            : children}
        </Comp>
      </Portal>
    );
  }
) as PopupComponent;

export { Popup };
