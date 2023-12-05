import * as React from "react";

import {
  CompoundComponentContext,
  CompoundComponentContextValue,
  useCompoundParent,
} from "../useCompound";
import { useControlled } from "../useControlled";
import { Slot } from "..";

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

interface TabsProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  asChild?: boolean;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const {
    children,
    value,
    asChild = false,
    defaultValue,
    onValueChange: onChange,
    ...rest
  } = props;
  const Comp = asChild ? Slot : "div";
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
});

export { Tabs, TabsProvider, TabsContext, useTabsContext };
export type { TabsProps };
