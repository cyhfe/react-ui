import * as React from "react";

import {
  CompoundComponentContext,
  useCompoundItem,
  useCompoundParent,
} from "../lib/useCompound";

export default { title: "Components/Select" };

interface SelectProps extends React.ComponentPropsWithoutRef<"div"> {}
const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select(
  props: SelectProps,
  forwardRef
) {
  const { children, ...rest } = props;

  return (
    <div ref={forwardRef} {...rest}>
      <button>selected value</button>
      {children}
    </div>
  );
});

interface OptionProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
}

const Option = React.forwardRef<HTMLDivElement, OptionProps>(function Option(
  props: OptionProps,
  forwardRef
) {
  const { children, ...rest } = props;
  return (
    <div ref={forwardRef} {...rest}>
      {children}
    </div>
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
