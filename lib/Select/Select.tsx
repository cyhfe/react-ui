import * as React from "react";

import {
  CompoundComponentContext,
  useCompoundItem,
  useCompoundParent,
} from "../useCompound";
import { Portal } from "../Portal";
export default { title: "Components/Select" };

type ItemValue = {
  value: string;
  label: string;
  ref: React.RefObject<HTMLSpanElement>;
};

function Select({ children }: { children: React.ReactNode }) {
  const { subitems, contextValue } = useCompoundParent<string, ItemValue>();
  const [selectedOptions, setSelectedOptions] = React.useState([]);

  React.useEffect(() => {
    console.log(Array.from(subitems.values()));
  }, [subitems]);

  return (
    <CompoundComponentContext.Provider value={contextValue}>
      {/* <button>{renderValue(selectedOptionsMetadata)}</button> */}
      <input />
      <Portal>{children}</Portal>
    </CompoundComponentContext.Provider>
  );
}

interface OptionProps extends React.ComponentPropsWithoutRef<"span"> {
  value: string;
}

function Option(props: OptionProps) {
  const { value, children } = props;
  const id = React.useId();
  const optionRef = React.useRef<HTMLSpanElement>(null);
  const computedLabel =
    typeof children === "string" ? children : optionRef.current?.innerText;

  useCompoundItem(
    id,
    React.useMemo(
      () => ({ value, label: computedLabel, ref: optionRef, selected }),
      [computedLabel, selected, value]
    )
  );

  return (
    <span ref={optionRef} onPointerUp={() => setSelected(true)}>
      {children}
    </span>
  );
}

export function Demo() {
  return (
    <Select>
      <Option value="1">one</Option>
      <Option value="2">two</Option>
      <Option value="3">three</Option>
      <Option value="4">four</Option>
      <Option value="5">five</Option>
    </Select>
  );
}
