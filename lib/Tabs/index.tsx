import * as React from "react";
import type {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";

interface TabsBaseProps<C extends React.ElementType> {}

type TabsProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  TabsBaseProps<C>
>;

type TabsComponent = <C extends React.ElementType = "div">(
  props: TabsProps<C>
) => React.ReactElement | null;

const Tabs = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabsProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "div";
    return (
      <Comp {...rest} ref={ref}>
        {children}
      </Comp>
    );
  }
) as TabsComponent;

export { Tabs };
