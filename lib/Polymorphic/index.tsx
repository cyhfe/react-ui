// https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/

export type AsProp<C extends React.ElementType> = {
  as?: C;
};

export type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = object
> = Omit<
  React.PropsWithChildren<AsProp<C>> & React.ComponentPropsWithoutRef<C>,
  keyof Props
> &
  Props;

export type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = object
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];
