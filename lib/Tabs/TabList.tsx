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

// context
interface TabListContextValue {}

const TabListContext = React.createContext<TabListContextValue | null>(null);
TabListContext.displayName = "TabListContext";

function useTabListContext() {
  const context = React.useContext(TabListContext);
  if (context == null) {
    throw new Error("No TabListContext provided");
  }

  return context;
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
      <TabListContext.Provider value={{}}>{children}</TabListContext.Provider>
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

export { TabList, useTabListContext };
