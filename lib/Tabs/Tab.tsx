import * as React from "react";
import {
  PolymorphicComponent,
  PolymorphicProps,
  PolymorphicRef,
} from "../Polymorphic";
import { TabMetadata } from "./TabList";
import { useCompoundItem } from "../useCompound";
import { useTabsContext } from ".";
import { useComposeRefs } from "..";

// Tab
interface TabBaseProps {}
type TabProps<RootElement extends React.ElementType> = PolymorphicProps<
  RootElement,
  TabBaseProps
>;
type TabComponent = PolymorphicComponent<TabBaseProps, "button">;

const Tab = React.forwardRef(
  <RootElement extends React.ElementType = "button">(
    props: TabProps<RootElement>,
    forwardRef: PolymorphicRef<RootElement>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "button";
    const id = React.useId();
    const TabRef = React.useRef<HTMLElement>(null);
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
) as TabComponent;

export { Tab };
