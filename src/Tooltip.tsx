import React, {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useRef,
  useState,
} from "react";

import { Slot } from "../lib/Slot";
import { Portal } from "../lib/Portal";
import {
  useFloating,
  autoUpdate,
  FloatingArrow,
  arrow,
  offset,
} from "@floating-ui/react";
interface TooltipTriggerProps {
  children: ReactNode;
}

interface TooltipTriggerProps extends HTMLAttributes<HTMLElement> {}

const TooltipTrigger = forwardRef<HTMLDivElement, TooltipTriggerProps>(
  function TooltipTrigger(props: TooltipTriggerProps, forwardRef) {
    const { children, ...rest } = props;
    return (
      <Slot ref={forwardRef} {...rest}>
        {children}
      </Slot>
    );
  }
);

interface TooltipContentProps extends HTMLAttributes<HTMLElement> {}
const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(props: TooltipContentProps, forwardRef) {
    const { children, ...rest } = props;

    return (
      <Portal ref={forwardRef} {...rest}>
        {children}
      </Portal>
    );
  }
);

function TooltipDemo() {
  const arrowRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const ARROW_HEIGHT = 7;
  const GAP = 2;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",

    middleware: [
      offset(ARROW_HEIGHT + GAP),
      arrow({
        element: arrowRef,
      }),
    ],
  });
  return (
    <div className="h-screen">
      <div className="flex items-center justify-center h-full">
        <TooltipTrigger
          ref={refs.setReference}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <button>trigger</button>
        </TooltipTrigger>
      </div>
      {isOpen && (
        <TooltipContent ref={refs.setFloating} style={floatingStyles}>
          <div className="bg-blue-500 text-white px-2 py-1 rounded">
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-blue-500"
            ></FloatingArrow>
            content
          </div>
        </TooltipContent>
      )}
    </div>
  );
}

export { TooltipDemo };
