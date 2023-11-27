import * as React from "react";
import type {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../Polymorphic";
import {
  CompoundComponentContext,
  CompoundComponentContextValue,
  useCompoundItem,
  useCompoundParent,
} from "../useCompound";

// TabsContext

interface TabsContextValue {
  value: string | undefined;
  onSelect: (newValue: string) => void;
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
type TabPanelMetadata = {
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
  const [value, setValue] = React.useState<string>();

  const onSelect = React.useCallback((newValue: string) => {
    setValue(newValue);
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

// TabListProvider

interface TabMetadata {
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

// Tab
interface TabBaseProps<C extends React.ElementType> {}
type TabProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  TabBaseProps<C>
>;
type TabComponent = <C extends React.ElementType = "div">(
  props: TabProps<C>
) => React.ReactElement | null;
const Tab = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "div";
    const id = React.useId();
    const TabRef = React.useRef<HTMLElement>(null);
    const metadata = React.useMemo(() => {
      return { ref: TabRef };
    }, []);
    useCompoundItem<string, TabMetadata>(id, metadata);
    return (
      <Comp {...rest} ref={TabRef}>
        {children}
      </Comp>
    );
  }
) as TabComponent;

// TabPanel
interface TabPanelBaseProps<C extends React.ElementType> {}

type TabPanelProps<C extends React.ElementType> =
  PolymorphicComponentPropWithRef<C, TabPanelBaseProps<C>>;

type TabPanelComponent = <C extends React.ElementType = "div">(
  props: TabPanelProps<C>
) => React.ReactElement | null;

const TabPanel = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabPanelProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const { children, as, ...rest } = props;
    const Comp = as || "div";
    const id = React.useId();
    const panelRef = React.useRef<HTMLElement>(null);

    const metadata = React.useMemo(() => {
      return {
        id,
        ref: panelRef,
      };
    }, [id]);

    const { id: value } = useCompoundItem<string, TabPanelMetadata>(
      id,
      metadata
    );

    const context = useTabsContext();
    if (context === null) {
      throw new Error("No TabContext provided");
    }
    const { value: selectedValue } = context;
    const hidden = value !== selectedValue;

    return (
      <Comp {...rest} ref={panelRef}>
        {!hidden && children}
      </Comp>
    );
  }
) as TabPanelComponent;

export {
  Tabs,
  TabsProvider,
  TabsContext,
  useTabsContext,
  TabList,
  Tab,
  TabPanel,
};
