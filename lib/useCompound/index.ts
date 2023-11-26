import * as React from "react";

function useCompoundParent<
  Key,
  Subitem extends { ref: React.RefObject<Node> }
>() {
  const [subitems, setSubitems] = React.useState(new Map<Key, Subitem>());
  const subitemKeys = React.useRef(new Set<Key>());

  const deregisterItem = React.useCallback((id: Key) => {
    subitemKeys.current.delete(id);
    setSubitems((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const registerItem = React.useCallback(
    (id: Key, item: Subitem) => {
      subitemKeys.current.add(id);
      setSubitems((prev) => {
        const next = new Map(prev);
        next.set(id, item);
        return next;
      });
      return {
        id: id,
        deregister: () => deregisterItem(id),
      };
    },
    [deregisterItem]
  );

  const sortedSubitems = React.useMemo(
    () => sortSubitems(subitems),
    [subitems]
  );

  const getItemIndex = React.useCallback(
    function getItemIndex(id: Key) {
      return Array.from(sortedSubitems.keys()).indexOf(id);
    },
    [sortedSubitems]
  );

  const contextValue = React.useMemo(
    () => ({
      getItemIndex,
      registerItem,
      totalSubitemCount: subitems.size,
    }),
    [getItemIndex, registerItem, subitems.size]
  );
  return {
    contextValue,
    subitems: sortedSubitems,
  };
}

function sortSubitems<Key, Subitem extends { ref: React.RefObject<Node> }>(
  subitems: Map<Key, Subitem>
) {
  const subitemsArray = Array.from(subitems.keys()).map((key) => {
    const subitem = subitems.get(key)!;
    return { key, subitem };
  });

  subitemsArray.sort((a, b) => {
    const aNode = a.subitem.ref.current;
    const bNode = b.subitem.ref.current;

    if (aNode === null || bNode === null || aNode === bNode) {
      return 0;
    }

    return aNode.compareDocumentPosition(bNode) &
      Node.DOCUMENT_POSITION_PRECEDING
      ? 1
      : -1;
  });

  return new Map(subitemsArray.map((item) => [item.key, item.subitem]));
}

export { useCompoundParent };
