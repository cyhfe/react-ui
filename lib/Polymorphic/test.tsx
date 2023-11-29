import * as React from "react";
import { PolymorphicComponentPropWithRef, PolymorphicRef } from ".";

interface BoxBaseProps {}

interface BoxTypeMap<RootComponentType extends React.ElementType> {
  props: BoxBaseProps;
  defaultRootComponent: RootComponentType;
}

type BoxProps<RootComponentType extends React.ElementType> =
  PolymorphicComponentPropWithRef<BoxTypeMap<RootComponentType>>;

type BoxComponent = <RootComponentType extends React.ElementType>(
  props: BoxProps<RootComponentType>
) => React.ReactNode | null;

const Box = React.forwardRef(
  <RootComponentType extends React.ElementType = "div">(
    props: BoxProps<RootComponentType>,
    ref: PolymorphicRef<BoxTypeMap<RootComponentType>>
  ) => {
    const { as, children, ...rest } = props;
    const Comp = as ?? "div";
    return (
      <Comp ref={ref} {...rest}>
        {children}
      </Comp>
    );
  }
) as BoxComponent;

export { Box };

export function Test() {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div>
      <Box as="button" disabled ref={buttonRef}>
        asdasd
      </Box>
      {/* @ts-expect-error */}
      <Box as="div" disabled>
        afasf
      </Box>
      {/* @ts-expect-error */}
      <Box as="div" ref={buttonRef}>
        afasf
      </Box>
    </div>
  );
}
