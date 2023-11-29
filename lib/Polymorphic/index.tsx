// https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/
// https://github.com/reach/reach-ui/blob/dev/packages/polymorphic/src/reach-polymorphic.ts
// https://github.com/mui/material-ui/blob/master/packages/mui-base/src/utils/PolymorphicComponent.ts

import React from "react";

export type AsProp<RootComponent extends React.ElementType> = {
  as?: RootComponent;
};

export type PolymorphicProps<
  RootComponent extends React.ElementType,
  Props extends Record<string, any>
> = Props &
  Omit<React.PropsWithChildren<AsProp<RootComponent>>, keyof Props> &
  Omit<React.ComponentPropsWithRef<RootComponent>, keyof Props>;

export type PolymorphicRef<RootComponent extends React.ElementType> =
  React.ComponentPropsWithRef<RootComponent>["ref"];

export type PolymorphicComponent<
  Props extends Record<string, any>,
  DefaultRootComponent extends React.ElementType
> = {
  <RootComponent extends React.ElementType = DefaultRootComponent>(
    props: PolymorphicProps<RootComponent, Props>
  ): React.ReactElement | null;
};
