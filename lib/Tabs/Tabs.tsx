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
import { useControlled } from "../useControlled";

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
interface UseTabsParams {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

function useTabs(params: UseTabsParams) {
  const { subitems: tabPanels, contextValue: compoundComponentContextValue } =
    useCompoundParent<string, TabPanelMetadata>();

  const { value: valueProp, defaultValue, onChange } = params;
  const [value, setValue] = useControlled<number>({
    controlled: valueProp,
    defaultProp: defaultValue,
  });

  const onSelect = React.useCallback(
    (index: number) => {
      setValue(index);
      onChange?.(index);
    },
    [onChange, setValue]
  );

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

interface TabsBaseProps {
  children: React.ReactNode;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

type TabsProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  TabsBaseProps
>;

type TabsComponent = <C extends React.ElementType = "div">(
  props: TabsProps<C>
) => React.ReactElement | null;

const Tabs = React.forwardRef(
  <C extends React.ElementType = "div">(
    props: TabsProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const { children, as, value, defaultValue, onChange, ...rest } = props;
    const Comp = as || "div";
    const { contextValue } = useTabs({
      value,
      defaultValue,
      onChange,
    });
    return (
      <Comp {...rest} ref={ref}>
        <TabsProvider value={contextValue}>{children}</TabsProvider>
      </Comp>
    );
  }
) as TabsComponent;

export { Tabs, TabsProvider, TabsContext, useTabsContext };
