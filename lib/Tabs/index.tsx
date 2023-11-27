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

type TextProps<C extends React.ElementType = "span"> = {
  as?: C;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

function Text<C extends React.ElementType>(props: TextProps<C>) {
  const { children, as, ...rest } = props;
  const Comp = as || "div";
  return <Comp {...rest}>{children}</Comp>;
}

function Demo() {
  return <Text as={"a"} href="asd" />;
}
