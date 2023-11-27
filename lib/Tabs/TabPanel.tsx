import * as React from "react";
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";
import { TabPanelMetadata, useTabsContext } from "./Tabs";
import { useCompoundItem } from "../useCompound";
import { useComposeRefs } from "..";

// TabPanel
interface TabPanelBaseProps {}

type TabPanelProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<C, TabPanelBaseProps>;

type TabPanelComponent = <C extends React.ElementType = "div">(
  props: TabPanelProps<C>
) => React.ReactElement | null;

const TabPanel = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabPanelProps<C>,
    forwardRef?: PolymorphicRef<C>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "div";
    const id = React.useId();
    const panelRef = React.useRef<HTMLElement>(null);
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
) as TabPanelComponent;

export { TabPanel };
