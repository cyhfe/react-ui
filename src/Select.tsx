import * as React from "react";

import {
  CompoundComponentContext,
  useCompoundItem,
  useCompoundParent,
} from "../lib/useCompound";

import { useComposeRefs } from "../lib/useComposeRefs";
export default { title: "Components/Select" };

interface UseSelectParams {
  multiple: boolean;
}

// useSelect
function useSelect(params: UseSelectParams) {
  const { multiple } = params;
  const { subitems: options, contextValue } = useCompoundParent();

  const defaultValue = multiple ? [] : undefined;
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);

  const handleSelectedChange = React.useCallback(
    (value) => {
      if (multiple) {
        if (selectedValue.includes(value)) {
          setSelectedValue((prev) => prev.filter((v) => v !== value));
        } else {
          setSelectedValue((prev) => [...prev, value]);
        }
      } else {
        setSelectedValue(value);
      }
    },
    [multiple, selectedValue]
  );

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

interface SelectProps extends React.ComponentPropsWithoutRef<"div"> {
  multiple?: boolean;
}
const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select(
  props: SelectProps,
  forwardRef
) {
  const { children, multiple = false, ...rest } = props;
  const value = useSelect({ multiple });

  const { getLabelByValue, selectedValue } = value.selectContextValue;

  let label;
  if (multiple && Array.isArray(selectedValue)) {
    label = selectedValue.map((v) => getLabelByValue(v)).join(",");
  } else {
    label = getLabelByValue(selectedValue);
  }

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
    <Select multiple>
      <Option value="1">one</Option>
      <Option value="2">two</Option>
      <Option value="3">three</Option>
      <Option value="4">four</Option>
      <Option value="5">five</Option>
    </Select>
  );
}
