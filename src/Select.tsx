import * as React from "react";

import {
  CompoundComponentContext,
  useCompoundItem,
  useCompoundParent,
} from "../lib/useCompound";

import { useComposeRefs } from "../lib/useComposeRefs";
export default { title: "Components/Select" };

// useSelect
function useSelect() {
  const { subitems: options, contextValue } = useCompoundParent();
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleSelectedChange = React.useCallback((value) => {
    setSelectedValue(value);
  }, []);

  const getLabelByValue = React.useCallback(
    (value) => {
      const label = options.get(value)?.ref.current?.textContent ?? "";
      return label;
    },
    [options]
  );

  React.useEffect(() => {
    console.log(options, selectedValue);
  }, [options, selectedValue]);

  const selectContextValue = React.useMemo(() => {
    return {
      options,
      selectedValue,
      handleSelectedChange,
      getLabelByValue,
    };
  }, [getLabelByValue, handleSelectedChange, options, selectedValue]);

  return {
    contextValue,
    selectContextValue,
  };
}

/**
 * context
 */
interface SelectContextValue {}
const SelectContext = React.createContext<SelectContextValue>({});

function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw Error("must have SelectProvider");
  return ctx;
}

/**
 * Provider
 */

type SelectProviderValue = any;

interface SelectProviderProps {
  value: SelectProviderValue;
  children: React.ReactNode;
}
function SelectProvider(props: SelectProviderProps) {
  const { value: valueProps, children } = props;

  const { contextValue, selectContextValue } = valueProps;

  return (
    <SelectContext.Provider value={selectContextValue}>
      <CompoundComponentContext.Provider value={contextValue}>
        {children}
      </CompoundComponentContext.Provider>
    </SelectContext.Provider>
  );
}

interface SelectProps extends React.ComponentPropsWithoutRef<"div"> {}
const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select(
  props: SelectProps,
  forwardRef
) {
  const { children, ...rest } = props;
  const value = useSelect();

  const { getLabelByValue, selectedValue } = value.selectContextValue;

  const label = getLabelByValue(selectedValue);

  return (
    <div ref={forwardRef} {...rest}>
      <button>selected {label}</button>
      <SelectProvider value={value}>{children}</SelectProvider>
    </div>
  );
});

interface OptionProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
}

const Option = React.forwardRef<HTMLSpanElement, OptionProps>(function Option(
  props: OptionProps,
  forwardRef
) {
  const { children, value, ...rest } = props;
  const id = React.useId();
  const ref = React.useRef<HTMLSpanElement>(null);
  const composedRef = useComposeRefs(ref, forwardRef);
  const metadata = React.useMemo(() => {
    return {
      value,
      ref: ref,
    };
  }, [value]);
  const { id: returnedId } = useCompoundItem(value, metadata);
  const { handleSelectedChange } = useSelectContext();
  return (
    <span
      ref={composedRef}
      {...rest}
      onClick={() => {
        handleSelectedChange(returnedId);
      }}
    >
      {children}
    </span>
  );
});

export function SelectDemo() {
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
