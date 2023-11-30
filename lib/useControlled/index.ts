import * as React from "react";

export function useControlled<T = unknown>({
  controlled,
  defaultProp,
}: {
  controlled: T | undefined;
  defaultProp: T | undefined;
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

  return [value, setValueIfUncontrolled] as [
    T,
    (newValue: T | ((prevValue: T) => T)) => void
  ];
}
