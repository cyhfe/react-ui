import * as React from "react";
import type {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";
import {
  CompoundComponentContext,
  CompoundComponentContextValue,
  useCompoundParent,
} from "../useCompound";

// TabsContext

interface TabsContextValue {
  value: number | undefined;
  onSelect: (index: number) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);
TabsContext.displayName = "TabsContext";

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (context == null) {
    throw new Error("No TabsContext provided");
  }

  return context;
}

// TabsProvider
export type TabPanelMetadata = {
  id: string | undefined;
  ref: React.RefObject<HTMLElement>;
};

type TabsProviderValue = CompoundComponentContextValue<
  string,
  TabPanelMetadata
> &
  TabsContextValue;

interface TabsProviderProps {
  value: TabsProviderValue;
  children: React.ReactNode;
}

function TabsProvider(props: TabsProviderProps) {
  const { children, value: valueProp } = props;

  const {
    // compound
    registerItem,
    getItemIndex,
    totalSubitemCount,

    // tabs
    value,
    onSelect,
  } = valueProp;

  const compoundComponentContextValue: CompoundComponentContextValue<
    string,
    TabPanelMetadata
  > = React.useMemo(() => {
    return {
      registerItem,
      getItemIndex,
      totalSubitemCount,
    };
  }, [getItemIndex, registerItem, totalSubitemCount]);

  const tabsContextValue = React.useMemo(() => {
    return {
      value,
      onSelect,
    };
  }, [onSelect, value]);
  return (
    <CompoundComponentContext.Provider value={compoundComponentContextValue}>
      <TabsContext.Provider value={tabsContextValue}>
        {children}
      </TabsContext.Provider>
    </CompoundComponentContext.Provider>
  );
}

// useTabs
function useTabs() {
  const { subitems: tabPanels, contextValue: compoundComponentContextValue } =
    useCompoundParent<string, TabPanelMetadata>();
  const [value, setValue] = React.useState<number>();

  const onSelect = React.useCallback((index: number) => {
    setValue(index);
  }, []);

  React.useEffect(() => {
    console.log(tabPanels);
  }, [tabPanels]);
  return {
    contextValue: {
      value,
      onSelect,
      ...compoundComponentContextValue,
    },
  };
}
// Tabs

interface TabsBaseProps<C extends React.ElementType> {
  children: React.ReactNode;
}

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
    const { contextValue } = useTabs();
    return (
      <Comp {...rest} ref={ref}>
        <TabsProvider value={contextValue}>{children}</TabsProvider>
      </Comp>
    );
  }
) as TabsComponent;

export { Tabs, TabsProvider, TabsContext, useTabsContext };
