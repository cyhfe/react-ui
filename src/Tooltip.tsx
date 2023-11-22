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

import type { AsChildPropsWithRef } from "../lib/types";
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

interface TooltipContentProps extends AsChildPropsWithRef<"div"> {}
const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(props: TooltipContentProps, forwardRef) {
    const { asChild, ...rest } = props;
    const Comp = asChild ? Slot : "div";
    return (
      <Portal>
        <Comp {...rest} ref={forwardRef} />
      </Portal>
    );
  }
);

function Tooltip() {
  const leavingTimer = useRef<number>();
  const enterTimer = useRef<number>();
  const arrowRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const ARROW_HEIGHT = 7;
  const GAP = 2;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(ARROW_HEIGHT + GAP),
      arrow({
        element: arrowRef,
      }),
    ],
  });
  return (
    <div className="">
      <div className="">
        <TooltipTrigger
          ref={refs.setReference}
          onFocus={() => {
            setIsOpen(true);
          }}
          onBlur={() => {
            setIsOpen(false);
          }}
          onMouseEnter={() => {
            if (enterTimer.current) {
              clearTimeout(enterTimer.current);
              enterTimer.current = window.setTimeout(() => {
                setIsOpen(true);
              }, 1000);
            } else {
              enterTimer.current = window.setTimeout(() => {
                setIsOpen(true);
              }, 1000);
            }
          }}
          onMouseLeave={() => {
            if (enterTimer.current) {
              clearTimeout(enterTimer.current);
              enterTimer.current = undefined;
            }
            if (leavingTimer.current) {
              clearTimeout(leavingTimer.current);
              leavingTimer.current = undefined;
            } else {
              leavingTimer.current = window.setTimeout(() => {
                setIsOpen(false);
                leavingTimer.current = undefined;
              }, 300);
            }
          }}
        >
          <button>trigger</button>
        </TooltipTrigger>
      </div>
      {true && (
        <TooltipContent ref={refs.setFloating} style={floatingStyles} asChild>
          <section className="bg-blue-500 text-white px-2 py-1 rounded">
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-blue-500"
            ></FloatingArrow>
            content
          </section>
        </TooltipContent>
      )}
    </div>
  );
}

function TooltipDemo() {
  return (
    <div>
      <Tooltip />
      <Tooltip />
      <Tooltip />
      <Tooltip />
    </div>
  );
}

export { TooltipDemo };
