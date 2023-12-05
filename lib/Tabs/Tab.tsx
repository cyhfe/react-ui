import * as React from "react";

import { TabMetadata } from "./TabList";
import { useCompoundItem } from "../useCompound";
import { useTabsContext } from ".";
import { Slot, useComposeRefs } from "..";

// Tab
interface TabProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  (props, forwardRef) => {
    const { children, asChild, ...rest } = props;
    const Comp = asChild ? Slot : "button";
    const id = React.useId();
    const TabRef = React.useRef<HTMLButtonElement>(null);
    const metadata = React.useMemo(() => {
      return { ref: TabRef };
    }, []);
    const { index } = useCompoundItem<string, TabMetadata>(id, metadata);
    const { onSelect, value } = useTabsContext();
    const composedRef = useComposeRefs(forwardRef, TabRef);
    const isSelected = value === index;
    return (
      <Comp
        {...rest}
        ref={composedRef}
        data-state={isSelected ? "active" : "inactive"}
        onClick={() => {
          onSelect(index);
        }}
      >
        {children}
      </Comp>
    );
  }
);

export { Tab };

export type { TabProps };
