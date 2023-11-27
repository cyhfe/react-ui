import * as React from "react";

// interface TabsProps<T extends React.ElementType<any>>
//   extends React.ComponentPropsWithoutRef<T> {}

// const Tabs = React.forwardRef(function Tabs<
//   RootComponentType extends React.ElementType<any>
// >(
//   props: TabsProps<RootComponentType>,
//   forwardRef: React.ForwardedRef<Element>
// ) {
//   const { children, ...rest } = props;
//   return (
//     <div ref={forwardRef} {...rest}>
//       {children}
//     </div>
//   );
// });

type Rainbow =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "violet";

type TextProps<C extends React.ElementType> = {
  as?: C;
  color?: Rainbow | "black";
};

type Props<C extends React.ElementType> = React.PropsWithChildren<
  TextProps<C>
> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof TextProps<C>>;

export const Text = <C extends React.ElementType = "span">({
  as,
  children,
}: Props<C>) => {
  const Component = as || "span";
  return <Component> {children} </Component>;
};

function Demo() {
  return (
    <Text as={"a"} href="asd">
      123
    </Text>
  );
}
