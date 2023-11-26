import { ComponentPropsWithoutRef, forwardRef, useCallback } from "react";
import { createContext } from "..";
import { useControllableState } from "../useControllableState";

export default { title: "Components/Accordion" };

interface AccordionContextValue {
  type: "single" | "multiple";
  active?: string;
  setActive?: (value: string) => void;
  collapsible: boolean;
  multiActive?: string[];
  handleMultiActiveChange?: (value: string) => void;
}

const [AccordionProvider, useAccordion] =
  createContext<AccordionContextValue>("AccordionRoot");

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

    const [active, setActive] = useControllableState({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    const [multiActive = [], setMultiActive] = useControllableState<string[]>({
      value: multiValue,
      defaultValue: defaultMultiValue,
      onChange: onMultiValueChange,
    });

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
        setActive={setActive}
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
    const { active, setActive, collapsible, handleMultiActiveChange, type } =
      useAccordion("AccordionTrigger");
    const { value } = useAccordionItem("AccordionTrigger");
    return (
      <div
        ref={forwardRef}
        {...rest}
        onClick={() => {
          if (type === "single") {
            if (collapsible && active === value) {
              setActive?.("");
            } else {
              setActive?.(value);
            }
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
export function Single() {
  return (
    <AccordionRoot type="single">
      <AccordionItem value="one">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Two</AccordionTrigger>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export function Multiple() {
  return (
    <AccordionRoot type="multiple">
      <AccordionItem value="one">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Two</AccordionTrigger>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
