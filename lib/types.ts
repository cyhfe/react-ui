// https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/

export type AsChildPropsWithRef<E extends React.ElementType> =
  React.ComponentPropsWithRef<E> & {
    asChild?: boolean;
  };
