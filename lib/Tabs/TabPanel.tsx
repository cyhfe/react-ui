import * as React from "react";
import { PolymorphicComponentPropWithRef } from "../Polymorphic";
import { TabPanelMetadata, useTabsContext } from "./Tabs";
import { useCompoundItem } from "../useCompound";

// TabPanel
interface TabPanelBaseProps<C extends React.ElementType> {}

type TabPanelProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<C, TabPanelBaseProps<C>>;

type TabPanelComponent = <C extends React.ElementType = "div">(
  props: TabPanelProps<C>
) => React.ReactElement | null;

const TabPanel = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabPanelProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "div";
    const id = React.useId();
    const panelRef = React.useRef<HTMLElement>(null);

    const metadata = React.useMemo(() => {
      return {
        id,
        ref: panelRef,
      };
    }, [id]);

    const { id: value } = useCompoundItem<string, TabPanelMetadata>(
      id,
      metadata
    );

    const context = useTabsContext();
    if (context === null) {
      throw new Error("No TabContext provided");
    }
    const { value: selectedValue } = context;
    const hidden = value !== selectedValue;

    return (
      <Comp {...rest} ref={panelRef}>
        {!hidden && children}
      </Comp>
    );
  }
) as TabPanelComponent;

export { TabPanel };
