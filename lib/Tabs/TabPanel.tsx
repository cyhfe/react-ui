import * as React from "react";

import { TabPanelMetadata, useTabsContext } from "./Tabs";
import { useCompoundItem } from "../useCompound";
import { Slot, useComposeRefs } from "..";

// TabPanel
interface TabPanelBaseProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelBaseProps>(
  (props, forwardRef) => {
    const { children, asChild = false, ...rest } = props;
    const Comp = asChild ? Slot : "div";
    const id = React.useId();
    const panelRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposeRefs(forwardRef, panelRef);

    const metadata = React.useMemo(() => {
      return {
        id,
        ref: panelRef,
      };
    }, [id]);

    const { index } = useCompoundItem<string, TabPanelMetadata>(id, metadata);

    const context = useTabsContext();
    if (context === null) {
      throw new Error("No TabContext provided");
    }
    const { value: selectedValue } = context;
    const hidden = index !== selectedValue;

    return (
      <Comp {...rest} ref={composedRef}>
        {!hidden && children}
      </Comp>
    );
  }
);

export { TabPanel };
