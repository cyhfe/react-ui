import React, { ComponentPropsWithoutRef, forwardRef } from "react";

export default { title: "Components/Select" };

interface SelectRootProps extends ComponentPropsWithoutRef<"div"> {}
const SelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
  function SelectRoot(props: SelectRootProps, forwardRef) {
    const { children, ...rest } = props;
    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);

interface SelectTriggerProps extends ComponentPropsWithoutRef<"div"> {}
const SelectTrigger = forwardRef<HTMLDivElement, SelectTriggerProps>(
  function SelectTrigger(props: SelectTriggerProps, forwardRef) {
    const { children, ...rest } = props;
    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);

interface SelectContentProps extends ComponentPropsWithoutRef<"div"> {}
const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(props: SelectContentProps, forwardRef) {
    const { children, ...rest } = props;
    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);

export function Select() {
  const [value, setValue] = React.useState("1");

  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setValue(event.currentTarget.value);
  };
  return (
    <div>
      <label>
        select {value}
        <select value={value} onChange={handleChange}>
          <option value="1">111</option>
          <option value="2">2222</option>
          <option value="3">333</option>
        </select>
      </label>
    </div>
  );
}
