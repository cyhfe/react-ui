import * as React from "react";

import {
  CompoundComponentContext,
  useCompoundItem,
  useCompoundParent,
} from "../useCompound";
import { useComposeRefs } from "../useComposeRefs";
import { createContext } from "..";

/**
 * SelectRoot
 */

interface SelectRootContextValue {
  selectedValue: string | string[];
  handleSelectedValueChange: (value: string) => void;
  getLabelByValue: (value: string) => string;
  placeholder?: string;
}

const [SelectRootProvider, useSelectRoot] =
  createContext<SelectRootContextValue>("SelectRoot");

interface SelectRootProps extends React.ComponentPropsWithoutRef<"div"> {
  multiple?: boolean;
  onSelectedChange?: (selected: string | string[]) => void;
  defaultSelected?: string | string[];
  placeholder?: string;
}

interface Metadata {
  ref: React.RefObject<HTMLElement>;
}

const SelectRoot = React.forwardRef<HTMLDivElement, SelectRootProps>(
  function SelectRoot(props: SelectRootProps, forwardRef) {
    const {
      children,
      multiple = false,
      onSelectedChange,
      defaultSelected,
      placeholder,
      ...rest
    } = props;
    const defaultValue = defaultSelected ?? multiple ? [] : "";
    const [selectedValue, setSelectedValue] = React.useState<string | string[]>(
      defaultValue
    );
    const { subitems: options, contextValue } = useCompoundParent<
      string,
      Metadata
    >();

    React.useEffect(() => {
      console.log(options, selectedValue);
    }, [options, selectedValue]);

    const handleSelectedValueChange = React.useCallback(
      (value: string) => {
        if (multiple && Array.isArray(selectedValue)) {
          if (selectedValue.includes(value)) {
            setSelectedValue((prev) => {
              if (Array.isArray(prev)) {
                const next = prev.filter((v) => v !== value);
                onSelectedChange?.(next);
                return next;
              } else {
                return prev;
              }
            });
          } else {
            setSelectedValue((prev) => {
              const next = [...prev, value];
              onSelectedChange?.(next);
              return next;
            });
          }
        } else {
          setSelectedValue(value);
          onSelectedChange?.(value);
        }
      },
      [multiple, onSelectedChange, selectedValue]
    );

    const getLabelByValue = React.useCallback(
      (value: string) => {
        const label = options.get(value)?.ref.current?.textContent ?? "";
        return label;
      },
      [options]
    );

    return (
      <CompoundComponentContext.Provider value={contextValue}>
        <SelectRootProvider
          selectedValue={selectedValue}
          handleSelectedValueChange={handleSelectedValueChange}
          getLabelByValue={getLabelByValue}
          placeholder={placeholder}
        >
          <div ref={forwardRef} {...rest}>
            {children}
          </div>
        </SelectRootProvider>
      </CompoundComponentContext.Provider>
    );
  }
);

/**
 * SelectTrigger
 */

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<"button"> {}
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger(props: SelectTriggerProps, forwardRef) {
    const { children, ...rest } = props;
    const { selectedValue, getLabelByValue, placeholder } =
      useSelectRoot("SelectTriggerProps");

    function showPlaceholder() {
      if (Array.isArray(selectedValue)) {
        return selectedValue.length === 0;
      } else {
        return !selectedValue;
      }
    }

    function renderLabel() {
      let label: string;
      if (Array.isArray(selectedValue)) {
        label = selectedValue.map((v) => getLabelByValue(v)).join(", ");
      } else {
        label = getLabelByValue(selectedValue);
      }
      return label;
    }

    return (
      <button ref={forwardRef} {...rest}>
        {showPlaceholder() && placeholder}
        {renderLabel()}
        {children}
      </button>
    );
  }
);

/**
 * SelectOption
 */

interface SelectOptionProps extends React.ComponentPropsWithoutRef<"button"> {
  value: string;
}
const SelectOption = React.forwardRef<HTMLButtonElement, SelectOptionProps>(
  function SelectOption(props: SelectOptionProps, forwardRef) {
    const { children, value, ...rest } = props;
    const optionRef = React.useRef<HTMLButtonElement>(null);
    const composedRef = useComposeRefs(optionRef, forwardRef);
    const metadata = React.useMemo(() => {
      return {
        ref: optionRef,
      };
    }, []);
    const { id: registedValue } = useCompoundItem(value, metadata);
    const { handleSelectedValueChange, selectedValue } =
      useSelectRoot("SelectOption");
    const isSelected = Array.isArray(selectedValue)
      ? selectedValue.includes(registedValue)
      : registedValue === selectedValue;
    return (
      <button
        data-selected={isSelected ? "true" : "false"}
        ref={composedRef}
        {...rest}
        onClick={() => handleSelectedValueChange(registedValue)}
      >
        {children}
      </button>
    );
  }
);

export { SelectRoot, SelectOption, SelectTrigger };
