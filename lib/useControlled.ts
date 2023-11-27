import * as React from "react";

export function useControlled<T>({
  controlled,
  defaultProp,
}: {
  controlled: T | undefined;
  defaultProp: T;
}) {
  const { current: isControlled } = React.useRef(controlled !== undefined);
  const [valueState, setValue] = React.useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  const setValueIfUncontrolled = React.useCallback((newValue: T) => {
    if (!isControlled) {
      setValue(newValue);
    }
    // isControlled 不可变
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValueIfUncontrolled];
}
