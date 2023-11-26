import {
  Context,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

type Descendant = {
  element: HTMLElement | null;
  index: number;
};

interface DescendantContextValue<DescendantType extends Descendant> {
  descendants: DescendantType[];
  registerDescendant: (
    descendant: Omit<DescendantType, "index"> & { index: number | undefined }
  ) => void;
}

function createDescendantsContext<DescendantType extends Descendant>(
  name: string,
  initialValue = {}
) {
  type T = DescendantContextValue<DescendantType>;
  const descendants: DescendantType[] = [];
  const ctx = createContext<T>({
    descendants,
    registerDescendant: () => {},
    ...initialValue,
  });
  ctx.displayName = name;
  return ctx;
}

interface DescendantProviderProps<DescendantType extends Descendant> {
  context: Context<DescendantContextValue<DescendantType>>;
  children: ReactNode;
}

function DescendantProvider<DescendantType extends Descendant>({
  context: Ctx,
  children,
}: DescendantProviderProps<DescendantType>) {
  const [descendants, setDescendants] = useState<DescendantType[]>([]);

  useEffect(() => {
    console.log(descendants);
  });

  const registerDescendant = useCallback(
    ({
      element,
      index: explicitIndex,
      ...rest
    }: Omit<DescendantType, "index"> & { index: number | undefined }) => {
      console.log(element);
      if (!element) return () => {};

      setDescendants((prev) => {
        // explicitIndex 指定插入位置
        if (explicitIndex != null && explicitIndex !== -1) {
          return insertAt(
            prev,
            { element, index: explicitIndex, ...rest } as DescendantType,
            explicitIndex
          );
        }

        if (prev.length === 0) {
          return [{ ...rest, element, index: 0 } as DescendantType];
        }

        // 根据dom位置插入
        const index = findDOMIndex(prev, element);
        let next: DescendantType[] = [];
        if (index === -1) {
          next = [{ ...rest, element, index: 0 } as DescendantType, ...prev];
        } else {
          insertAt(
            prev,
            { ...rest, element, index: 0 } as DescendantType,
            index
          );
        }

        return next;
      });
      return () => {
        if (!element) return;
        setDescendants((prev) => prev.filter((el) => el.element !== element));
      };
    },
    []
  );
  const value = useMemo(() => {
    return {
      descendants,
      registerDescendant,
    };
  }, [descendants, registerDescendant]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useDescendant<DescendantType extends Descendant>(
  descendant: Omit<DescendantType, "index">,
  context: React.Context<DescendantContextValue<DescendantType>>,
  indexProp?: number
) {
  const { registerDescendant, descendants } = useContext(context);
  useLayoutEffect(() => {
    return registerDescendant({ ...descendant, index: indexProp });
  }, [descendant, indexProp, registerDescendant]);

  const index = descendants.find(
    (v) => v.element === descendant.element
  )?.index;
  return index;
}

function insertAt<T extends unknown[]>(
  items: T,
  item: T[number],
  index?: number
) {
  if (index == null || !(index in items)) {
    return [...items, item] as T;
  }
  return [...items.slice(0, index), item, ...items.slice(index)] as T;
}

function findDOMIndex<DescendantType extends Descendant>(
  items: DescendantType[],
  element: Element
) {
  let length = items.length;

  while (length--) {
    const currentElement = items[length].element;
    if (!currentElement) continue;
    // currentElement是否在element之前
    if (isElementPreceding(currentElement, element)) {
      return length + 1;
    }
  }
  return -1;
}

function isElementPreceding(a: Element, b: Element) {
  return Boolean(
    // a在b前面，返回true
    b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING
  );
}

export { createDescendantsContext, DescendantProvider, useDescendant };
