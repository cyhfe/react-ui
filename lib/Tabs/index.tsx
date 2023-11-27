import * as React from "react";
import type { PolymorphicComponentProp, PolymorphicRef } from "../Polymorphic";
interface TabsProps {}

const Tabs = React.forwardRef(function Tabs<
  C extends React.ElementType = "div"
>(props: PolymorphicComponentProp<C, TabsProps>, ref: PolymorphicRef<C>) {
  const { as, children, ...rest } = props;
  const Comp = as ?? "div";
  return (
    <Comp ref={ref} {...rest}>
      {children}
    </Comp>
  );
});

export { Tabs };
