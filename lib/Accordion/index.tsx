import { ComponentPropsWithoutRef, forwardRef, useCallback } from "react";
import { createContext } from "..";
import { useControllableState } from "../useControllableState";

interface AccordionRootProps extends ComponentPropsWithoutRef<"div"> {
  type: "single" | "multiple";
  // single
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;

  // multiple
  multiValue?: string[];
  defaultMultiValue?: string[];
  onMultiValueChange?: (value: string[]) => void;
}

interface AccordionContextValue {
  type: "single" | "multiple";
  active?: string;
  handleSingleActiveChange?: (value: string) => void;
  collapsible: boolean;
  multiActive?: string[];
  handleMultiActiveChange?: (value: string) => void;
}

const [AccordionProvider, useAccordion] =
  createContext<AccordionContextValue>("AccordionRoot");

const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot(props: AccordionRootProps, forwardRef) {
    const {
      children,
      value,
      defaultValue = "",
      onValueChange = () => {},
      collapsible = false,
      multiValue,
      defaultMultiValue = [],
      onMultiValueChange = () => {},
      type,
      ...rest
    } = props;

    const [active = defaultValue, setActive] = useControllableState({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    const [multiActive = defaultMultiValue, setMultiActive] =
      useControllableState<string[]>({
        value: multiValue,
        defaultValue: defaultMultiValue,
        onChange: onMultiValueChange,
      });

    const handleSingleActiveChange = useCallback(
      (value: string) => {
        if (collapsible && active === value) {
          setActive?.("");
        } else {
          setActive?.(value);
        }
      },
      [active, collapsible, setActive]
    );

    const handleMultiActiveChange = useCallback(
      (value: string) => {
        const isOpen = multiActive.includes(value);
        if (isOpen) {
          setMultiActive((prev) => {
            if (!prev) return [];
            return prev.filter((v) => v !== value);
          });
        } else {
          setMultiActive((prev) => {
            if (!prev) return [];
            return [...prev, value];
          });
        }
      },
      [multiActive, setMultiActive]
    );

    return (
      <AccordionProvider
        type={type}
        active={active}
        handleSingleActiveChange={handleSingleActiveChange}
        collapsible={collapsible}
        multiActive={multiActive}
        handleMultiActiveChange={handleMultiActiveChange}
      >
        <div ref={forwardRef} {...rest}>
          {children}
        </div>
      </AccordionProvider>
    );
  }
);

interface AccordionItemContextValue {
  value: string;
}
const [AccordionItemProvider, useAccordionItem] =
  createContext<AccordionItemContextValue>("AccordionItemRoot");

interface AccordionItemProps extends ComponentPropsWithoutRef<"div"> {
  value: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(props: AccordionItemProps, forwardRef) {
    const { children, value, ...rest } = props;
    return (
      <AccordionItemProvider value={value}>
        <div ref={forwardRef} {...rest}>
          {children}
        </div>
      </AccordionItemProvider>
    );
  }
);

interface AccordionTriggerProps extends ComponentPropsWithoutRef<"div"> {}
const AccordionTrigger = forwardRef<HTMLDivElement, AccordionTriggerProps>(
  function AccordionTrigger(props: AccordionTriggerProps, forwardRef) {
    const { children, ...rest } = props;
    const { handleSingleActiveChange, handleMultiActiveChange, type } =
      useAccordion("AccordionTrigger");
    const { value } = useAccordionItem("AccordionTrigger");
    return (
      <div
        ref={forwardRef}
        {...rest}
        onClick={() => {
          if (type === "single") {
            handleSingleActiveChange?.(value);
          } else {
            handleMultiActiveChange?.(value);
          }
        }}
      >
        {children}
      </div>
    );
  }
);

interface AccordionContentProps extends ComponentPropsWithoutRef<"div"> {}
const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent(props: AccordionContentProps, forwardRef) {
    const { children, ...rest } = props;
    const { active, type, multiActive } = useAccordion("AccordionContent");
    const { value } = useAccordionItem("AccordionContent");

    if (type === "single" && active !== value) return null;
    if (type === "multiple" && (!multiActive || !multiActive.includes(value)))
      return null;
    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);

export {
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useAccordion,
  useAccordionItem,
};
