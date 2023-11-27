// TabListProvider

import * as React from "react";
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";
import {
  CompoundComponentContext,
  CompoundComponentContextValue,
  useCompoundParent,
} from "../useCompound";

export interface TabMetadata {
  ref: React.RefObject<HTMLElement>;
}

type TabListCompoundComponentContextValue = CompoundComponentContextValue<
  string,
  TabMetadata
>;
interface TabListProviderProps {
  value: TabListCompoundComponentContextValue;
  children: React.ReactNode;
}
function TabListProvider({ children, value }: TabListProviderProps) {
  return (
    <CompoundComponentContext.Provider value={value}>
      {children}
    </CompoundComponentContext.Provider>
  );
}

// useTabList

function useTabList() {
  const { subitems: tabList, contextValue } = useCompoundParent<
    string,
    TabMetadata
  >();

  React.useEffect(() => {
    console.log(tabList);
  }, [tabList]);

  return {
    contextValue,
  };
}

// TabList

interface TabListBaseProps<C extends React.ElementType> {}
type TabListProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<C, TabListBaseProps<C>>;
type TabListComponent = <C extends React.ElementType = "div">(
  props: TabListProps<C>
) => React.ReactElement | null;
const TabList = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabListProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "div";
    const { contextValue } = useTabList();
    return (
      <Comp {...rest} ref={ref}>
        <TabListProvider value={contextValue}>{children}</TabListProvider>
      </Comp>
    );
  }
) as TabListComponent;

export { TabList };