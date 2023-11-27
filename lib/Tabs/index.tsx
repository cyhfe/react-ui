import * as React from "react";
import type {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";
import {
  CompoundComponentContext,
  CompoundComponentContextValue,
} from "../useCompound";

// TabsContext

interface TabsContextValue {}

const TabsContext = React.createContext<TabsContextValue | null>(null);
TabsContext.displayName = "TabsContext";

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (context == null) {
    throw new Error("No TabsContext provided");
  }

  return context;
}
export { TabsContext, useTabsContext };

// TabsProvider
type TabPanelMetadata = {
  id: string | undefined;
  ref: React.RefObject<HTMLElement>;
};

type TabsProviderValue = CompoundComponentContextValue<
  string | number,
  TabPanelMetadata
> &
  TabsContextValue;

interface TabsProviderProps {
  value: TabsProviderValue;
  children: React.ReactNode;
}

function TabsProvider(props: TabsProviderProps) {
  const { children } = props;
  const compoundComponentContextValue: CompoundComponentContextValue<
    string,
    TabPanelMetadata
  > = React.useMemo(() => {}, []);
  const tabsContextValue = React.useMemo(() => {
    return {};
  }, []);
  return (
    <CompoundComponentContext.Provider value={compoundComponentContextValue}>
      <TabsContext.Provider value={tabsContextValue}>
        {children}
      </TabsContext.Provider>
    </CompoundComponentContext.Provider>
  );
}

// Tabs

interface TabsBaseProps<C extends React.ElementType> {}

type TabsProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  TabsBaseProps<C>
>;

type TabsComponent = <C extends React.ElementType = "div">(
  props: TabsProps<C>
) => React.ReactElement | null;

const Tabs = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabsProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "div";
    return (
      <Comp {...rest} ref={ref}>
        {children}
      </Comp>
    );
  }
) as TabsComponent;

export { Tabs, TabsProvider };
