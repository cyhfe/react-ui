import * as React from "react";
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";
import { TabMetadata } from "./TabList";
import { useCompoundItem } from "../useCompound";
import { useTabsContext } from ".";
import { useComposeRefs } from "..";

// Tab
interface TabBaseProps {}
type TabProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  TabBaseProps
>;
type TabComponent = <C extends React.ElementType = "div">(
  props: TabProps<C>
) => React.ReactElement | null;
const Tab = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabProps<C>,
    forwardRef?: PolymorphicRef<C>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "div";
    const id = React.useId();
    const TabRef = React.useRef<HTMLElement>(null);
    const metadata = React.useMemo(() => {
      return { ref: TabRef };
    }, []);
    const { index } = useCompoundItem<string, TabMetadata>(id, metadata);
    const { onSelect } = useTabsContext();
    const composedRef = useComposeRefs(forwardRef, TabRef);
    return (
      <Comp
        {...rest}
        ref={composedRef}
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
