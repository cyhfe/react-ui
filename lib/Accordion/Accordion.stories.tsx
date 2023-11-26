import { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { createContext } from "..";
import { useControllableState } from "../useControllableState";

export default { title: "Components/Accordion" };

interface AccordionContextValue {
  active: string;
  setActive: (value: string) => void;
  collapsible: boolean;
}

const [AccordionProvider, useAccordion] =
  createContext<AccordionContextValue>("AccordionRoot");

interface AccordionRootProps extends ComponentPropsWithoutRef<"div"> {
  type: "single" | "multiple";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
}

const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot(props: AccordionRootProps, forwardRef) {
    const {
      children,
      value,
      defaultValue,
      onValueChange = () => {},
      collapsible = false,
      ...rest
    } = props;

    const [active = "", setActive] = useControllableState({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    return (
      <AccordionProvider
        active={active}
        setActive={setActive}
        collapsible={collapsible}
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
    // const { active } = useAccordion("AccordionItem");
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

interface AccordionHeaderProps extends ComponentPropsWithoutRef<"div"> {}
const AccordionHeader = forwardRef<HTMLDivElement, AccordionHeaderProps>(
  function AccordionHeader(props: AccordionHeaderProps, forwardRef) {
    const { children, ...rest } = props;
    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);

interface AccordionTriggerProps extends ComponentPropsWithoutRef<"div"> {}
const AccordionTrigger = forwardRef<HTMLDivElement, AccordionTriggerProps>(
  function AccordionTrigger(props: AccordionTriggerProps, forwardRef) {
    const { children, ...rest } = props;
    const { active, setActive, collapsible } = useAccordion("AccordionTrigger");
    const { value } = useAccordionItem("AccordionTrigger");
    return (
      <div
        ref={forwardRef}
        {...rest}
        onClick={() => {
          if (collapsible && active === value) {
            setActive("");
          } else {
            setActive(value);
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
    const { active } = useAccordion("AccordionContent");
    const { value } = useAccordionItem("AccordionContent");
    if (active !== value) return null;
    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);
export function Single() {
  return (
    <AccordionRoot type="single" collapsible>
      <AccordionItem value="one">
        <AccordionHeader>
          <AccordionTrigger>One</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionHeader>
          <AccordionTrigger>Two</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
