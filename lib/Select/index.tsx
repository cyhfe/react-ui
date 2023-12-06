import * as React from "react";

import {
  CompoundComponentContext,
  useCompoundItem,
  useCompoundParent,
} from "../useCompound";
import { useComposeRefs } from "../useComposeRefs";
import { Slot, createContext } from "..";
import {
  PopupContent,
  PopupRoot,
  PopupTrigger,
  PopupContentProps,
} from "../Popup";
import { useControlled } from "../useControlled";

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
  selectedValue?: string | string[];
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
      selectedValue: selectedValueProp,
      placeholder,
      ...rest
    } = props;
    const [open, setOpen] = React.useState(false);
    const defaultValue =
      defaultSelected ?? multiple ? new Array<string>(0) : "";
    const [selectedValue, setSelectedValue] = useControlled<string | string[]>({
      controlled: selectedValueProp,
      defaultProp: defaultValue,
    });
    const { subitems: options, contextValue } = useCompoundParent<
      string,
      Metadata
    >();

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
          setOpen(false);
        }
      },
      [multiple, onSelectedChange, selectedValue, setSelectedValue]
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
          <PopupRoot isOpen={open} onIsOpenChange={setOpen} closeOnClickoutside>
            <div ref={forwardRef} {...rest}>
              {children}
            </div>
          </PopupRoot>
        </SelectRootProvider>
      </CompoundComponentContext.Provider>
    );
  }
);

/**
 * SelectLabel
 */

interface SelectLabelProps extends React.ComponentPropsWithoutRef<"div"> {}
const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  function SelectLabel(props: SelectLabelProps, forwardRef) {
    const { selectedValue, getLabelByValue } = useSelectRoot("SelectLabel");
    function renderLabel() {
      let label: string;
      if (Array.isArray(selectedValue)) {
        label = selectedValue.map((v) => getLabelByValue(v)).join(", ");
      } else {
        label = getLabelByValue(selectedValue);
      }
      return label;
    }
    const { children, ...rest } = props;
    return (
      <div ref={forwardRef} {...rest}>
        {children ?? renderLabel()}
      </div>
    );
  }
);

/**
 * SelectPlaceholder
 */

interface SelectPlaceholderProps
  extends React.ComponentPropsWithoutRef<"span"> {
  asChild?: boolean;
}
const SelectPlaceholder = React.forwardRef<
  HTMLDivElement,
  SelectPlaceholderProps
>(function SelectPlaceholder(props: SelectPlaceholderProps, forwardRef) {
  const { children, asChild = false, ...rest } = props;
  const { selectedValue, placeholder } = useSelectRoot("SelectTriggerProps");

  function showPlaceholder() {
    if (Array.isArray(selectedValue)) {
      return selectedValue.length === 0;
    } else {
      return !selectedValue;
    }
  }

  if (!showPlaceholder()) return null;

  const Comp = asChild ? Slot : "span";

  return (
    <Comp ref={forwardRef} {...rest}>
      {children ?? placeholder}
    </Comp>
  );
});

/**
 * SelectTrigger
 */

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<"button"> {}
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger(props: SelectTriggerProps, forwardRef) {
    const { children, ...rest } = props;

    return (
      <PopupTrigger asChild>
        <button ref={forwardRef} {...rest}>
          {children}
        </button>
      </PopupTrigger>
    );
  }
);

/**
 * SelectPopup
 */

// const SelectPopup = PopupContent;

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

export {
  SelectRoot,
  SelectOption,
  SelectTrigger,
  SelectLabel,
  SelectPlaceholder,
};

export { PopupContent as SelectPopup };

export type {
  SelectRootProps,
  SelectOptionProps,
  SelectTriggerProps,
  SelectLabelProps,
  SelectPlaceholderProps,
};

export type { PopupContentProps as SelectPopupProps };
