import React, { useEffect } from "react";
import {
  CompoundComponentContext,
  useCompoundItem,
  useCompoundParent,
} from ".";
export default {
  title: "hooks/useCompound",
};

type ItemValue = { value: string; ref: React.RefObject<HTMLSpanElement> };

function Parent({ children }: { children: React.ReactNode }) {
  const { subitems, contextValue } = useCompoundParent<string, ItemValue>();

  useEffect(() => {
    console.log(subitems);
  }, [subitems]);

  return (
    <CompoundComponentContext.Provider value={contextValue}>
      {children}
    </CompoundComponentContext.Provider>
  );
}

function Child(props: React.PropsWithChildren<{ id: string; value: string }>) {
  const { id, value, children } = props;
  const ref = React.useRef<HTMLSpanElement>(null);
  useCompoundItem(
    id,
    React.useMemo(() => ({ value, ref }), [value])
  );

  return <span ref={ref}>{children}</span>;
}

export function Demo() {
  return (
    <Parent>
      <Child id="1" value="one" />
      <Child id="2" value="two">
        <Child id="2.1" value="two.one" />
        <Child id="2.2" value="two.two" />
      </Child>
      <Child id="3" value="three">
        <Child id="3.1" value="three.one">
          <Child id="3.1.1" value="three.one.one" />
        </Child>
      </Child>
    </Parent>
  );
}
