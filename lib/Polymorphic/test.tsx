import React from "react";
import { PolymorphicComponent, PolymorphicProps, PolymorphicRef } from ".";

type TextProps<RootComponent extends React.ElementType> = PolymorphicProps<
  RootComponent,
  TextPropsBase
>;

type TextComponent = PolymorphicComponent<TextPropsBase, "span">;

interface TextPropsBase {
  color?: "blue" | "black";
}
const Text = React.forwardRef(
  <RootComponent extends React.ElementType = "span">(
    props: TextProps<RootComponent>,
    ref: PolymorphicRef<RootComponent>
  ) => {
    const { as, color, children } = props;
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
      <Text as="a" ref={aRef}>
        asd
      </Text>
      {/* @ts-expect-error */}
      <Text href="asd">asd</Text>
      {/* @ts-expect-error */}
      <Text as="div" href="asd">
        asd
      </Text>
      {/* @ts-expect-error */}
      <Text as="div" ref={aRef}>
        asd
      </Text>
    </>
  );
}
