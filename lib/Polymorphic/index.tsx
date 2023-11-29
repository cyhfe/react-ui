// https://blog.logrocket.com/build-strongly-typed-polymorphic-components-react-typescript/

import React from "react";

export interface TypeMapBase {
  props: object;
  defaultRootComponent: React.ElementType;
}

export type AsProp<TypeMap extends TypeMapBase> = {
  as?: TypeMap["defaultRootComponent"];
};

export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type PolymorphicComponentProp<TypeMap extends TypeMapBase> =
  TypeMap["props"] &
    Omit<React.PropsWithChildren<AsProp<TypeMap>>, keyof TypeMap["props"]> &
    Omit<
      React.ComponentPropsWithoutRef<TypeMap["defaultRootComponent"]>,
      keyof TypeMap["props"]
    >;

export type PolymorphicComponentPropWithRef<TypeMap extends TypeMapBase> =
  PolymorphicComponentProp<TypeMap> & {
    ref?: PolymorphicRef<TypeMap>;
  };

export type PolymorphicRef<TypeMap extends TypeMapBase> =
  React.ComponentPropsWithRef<TypeMap["defaultRootComponent"]>["ref"];

export type PolymorphicComponent = <TypeMap extends TypeMapBase>(
  props: TypeMap["props"]
) => React.ReactNode | null;
