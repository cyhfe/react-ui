import * as React from "react";
import { PolymorphicComponentPropWithRef } from "../Polymorphic";
import { TabMetadata } from "./TabList";
import { useCompoundItem } from "../useCompound";
import { useTabsContext } from ".";

// Tab
interface TabBaseProps<C extends React.ElementType> {}
type TabProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  TabBaseProps<C>
>;
type TabComponent = <C extends React.ElementType = "div">(
  props: TabProps<C>
) => React.ReactElement | null;
const Tab = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabProps<C>,
    ref?: PolymorphicRef<C>
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
    return (
      <Comp
        {...rest}
        ref={TabRef}
        onClick={() => {
          console.log("click", index);
          onSelect(index);
        }}
      >
        {children}
      </Comp>
    );
  }
) as TabComponent;

export { Tab };
