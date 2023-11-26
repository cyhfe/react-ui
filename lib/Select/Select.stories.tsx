import React, {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Portal } from "../Portal";
import { createContext } from "..";
import { useControllableState } from "../useControllableState";

export default { title: "Components/Select" };

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
}
const [SelectProvider, useSelect] =
  createContext<SelectContextValue>("SelectRoot");

interface SelectRootProps extends ComponentPropsWithoutRef<"div"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
const SelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
  function SelectRoot(props: SelectRootProps, forwardRef) {
    const {
      children,
      value: propsValue,
      defaultValue = "",
      onValueChange = () => {},
      ...rest
    } = props;
    const [value = defaultValue, setValue] = useControllableState({
      value: propsValue,
      defaultValue,
      onChange: onValueChange,
    });

    const [textNode, setTextNode] = useState();

    return (
      <SelectProvider value={value} onValueChange={setValue}>
        <div ref={forwardRef} {...rest}>
          {children}
        </div>
      </SelectProvider>
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

interface SelectItemProps extends ComponentPropsWithoutRef<"div"> {
  value: string;
}
const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem(props: SelectItemProps, forwardRef) {
    const { children, ...rest } = props;
    return (
      <div ref={forwardRef} {...rest}>
        {children}
      </div>
    );
  }
);

// interface SelectValueProps extends ComponentPropsWithoutRef<"div"> {}
// const SelectValue = forwardRef<HTMLDivElement, SelectValueProps>(
//   function SelectValue(props: SelectValueProps, forwardRef) {
//     const { children, ...rest } = props;
//     const { value } = useSelect("SelectValue");
//     return (
//       <div ref={forwardRef} {...rest}>
//         {children}
//       </div>
//     );
//   }
// );

// export function Select() {
//   // const [value, setValue] = React.useState("1");

//   // const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
//   //   setValue(event.currentTarget.value);
//   // };
//   return (
//     <div>
//       {/* <label>
//         select {value}
//         <select value={value} onChange={handleChange}>
//           <option value="1">111</option>
//           <option value="2">2222</option>
//           <option value="3">333</option>
//         </select>
//       </label> */}
//       <Select>
//         <Option value="1">111</Option>
//         <Option value="2">2222</Option>
//         <Option value="3">333</Option>
//       </Select>
//     </div>
//   );
// }
import {
  createDescendantsContext,
  useDescendant,
  DescendantProvider,
} from "../Descendants";

interface DescendantType {
  element: HTMLDivElement | null;
  value: string;
  index: number;
}

const Ctx = createDescendantsContext<DescendantType>("Test");

function Root({ children }: { children: ReactNode }) {
  return <DescendantProvider context={Ctx}>{children}</DescendantProvider>;
}

function Item({ value, index: indexProp }: { value: string; index?: number }) {
  // const { descendants } = useContext(Ctx);
  const ref = useRef<HTMLDivElement | null>(null);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   console.log(element);
  // }, [element]);
  // const descendant = useMemo(() => {
  //   return {
  //     element,
  //     value,
  //   };
  // }, [element, value]);
  const index = useDescendant({ element: ref.current, value }, Ctx, indexProp);
  return <div ref={ref}>{value + "" + indexProp + " " + index}</div>;
}

export function Demo() {
  return (
    <Root>
      <Item value="1" />
      <Item value="2" />
      <Item value="3" />
      <Item value="4" />
    </Root>
  );
}
