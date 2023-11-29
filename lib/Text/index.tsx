import React from "react";
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";

type Rainbow =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "violet";

type TextProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  { color?: Rainbow | "black" }
>;

type TextComponent = <C extends React.ElementType = "span">(
  props: TextProps<C>
) => React.ReactElement | null;

export const Text = React.forwardRef(
  <C extends React.ElementType = "span">(
    { as, color, children }: TextProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "span";

    const style = color ? { style: { color } } : {};

    return (
      <Component {...style} ref={ref}>
        {children}
      </Component>
    );
  }
) as TextComponent;

export function Demo() {
  const aRef = React.useRef<HTMLAnchorElement>(null);

  return (
    <>
      {/* @ts-expect-error */}
      <Text as="div" href="asd">
        asd
      </Text>
      <Text as="a" href="asd">
        asd
      </Text>

      {/* @ts-expect-error */}
      <Text as="div" ref={aRef}>
        asd
      </Text>
      <Text as="a" href="asd" ref={aRef}>
        asd
      </Text>
    </>
  );
}
