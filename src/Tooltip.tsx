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

// interface TooltipContentProps {
//   children: ReactNode;
// }
// function TooltipContent(props: TooltipContentProps) {
//   const { children, ...rest } = props;
//   return <div {...rest}>{children}</div>;
// }

function TooltipDemo() {
  const arrowRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,

    middleware: [
      arrow({
        element: arrowRef,
      }),
    ],
  });
  return (
    <div className="">
      {/* <div className="min-h-[600px]"></div> */}
      <div className="flex items-center justify-center">
        <TooltipTrigger
          ref={refs.setReference}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {/* <textarea defaultValue={""} className="resize"></textarea> */}
          <button>trigger</button>
        </TooltipTrigger>
      </div>
      {isOpen && (
        <TooltipContent ref={refs.setFloating} style={floatingStyles}>
          <div className="bg-black/50 text-white px-2 py-1 rounded">
            <FloatingArrow ref={arrowRef} context={context}></FloatingArrow>
            content
          </div>
        </TooltipContent>
      )}
      {/* <div className="min-h-[600px]"></div> */}
    </div>
  );
}

export { TooltipDemo };
