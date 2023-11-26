import {
  Context,
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

type Descendant = {
  element: HTMLElement | null;
  index: number;
};

interface DescendantContextValue<DescendantType extends Descendant> {
  descendants: DescendantType[];
  registerDescendant: (descendant: DescendantType) => void;
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
  items: DescendantType[];
  set: React.Dispatch<React.SetStateAction<DescendantType[]>>;
}

function DescendantProvider<DescendantType extends Descendant>({
  context: Ctx,
  children,
}: DescendantProviderProps<DescendantType>) {
  const [descendants, setDescendants] = useState<DescendantType[]>([]);

  const registerDescendant = useCallback((descendant: DescendantType) => {
    setDescendants((prev) => [...prev, descendant]);
  }, []);
  const value = useMemo(() => {
    return {
      descendants,
      registerDescendant,
    };
  }, [descendants, registerDescendant]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { createDescendantsContext, DescendantProvider };
