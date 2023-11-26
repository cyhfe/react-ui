import * as React from "react";
import {
  CompoundComponentContext,
  CompoundComponentContextValue,
} from "./useCompoundParent";

function useCompoundItem<Key, Subitem>(id: Key, itemMetadata: Subitem) {
  const context = React.useContext(
    CompoundComponentContext
  ) as CompoundComponentContextValue<Key, Subitem>;

  if (context === null) {
    throw new Error("useCompoundItem must be used within a useCompoundParent");
  }
  const { registerItem } = context;
  const [registeredId, setRegisteredId] = React.useState(id);

  React.useLayoutEffect(() => {
    const { id: returnedId, deregister } = registerItem(id, itemMetadata);
    setRegisteredId(returnedId);
    return () => deregister(id);
  }, [id, itemMetadata, registerItem]);

  return {
    id: registeredId,
    index: registeredId !== undefined ? context.getItemIndex(registeredId) : -1,
    totalItemCount: context.totalSubitemCount,
  };
}

export { useCompoundItem };
