// TabListProvider

import * as React from "react";

import {
  CompoundComponentContext,
  CompoundComponentContextValue,
  useCompoundParent,
} from "../useCompound";
import { Slot } from "..";

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

interface TabListBaseProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

const TabList = React.forwardRef<HTMLDivElement, TabListBaseProps>(
  (props, forwardRef) => {
    const { children, asChild, ...rest } = props;
    const Comp = asChild ? Slot : "div";
    const { contextValue } = useTabList();
    return (
      <Comp {...rest} ref={forwardRef}>
        <TabListProvider value={contextValue}>{children}</TabListProvider>
      </Comp>
    );
  }
);

export { TabList, useTabListContext };
