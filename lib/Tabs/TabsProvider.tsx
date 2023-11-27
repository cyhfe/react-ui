import * as React from "react";

import { TabsContext, useTabsContext } from "./TabsContext";

import {
  CompoundComponentContext,
  CompoundComponentContextValue,
} from "../useCompound";

interface TabsProviderProps {
  value: TabsProviderValue;
  children: React.ReactNode;
}

function TabsProvider(props: TabsProviderProps) {
  const { children } = props;
  const tabsContextValue = React.useMemo(() => {
    return {};
  }, []);
  return (
    <CompoundComponentContext.Provider>
      <TabsContext.Provider value={tabsContextValue}>
        {children}
      </TabsContext.Provider>
    </CompoundComponentContext.Provider>
  );
}

export { TabsProvider };
