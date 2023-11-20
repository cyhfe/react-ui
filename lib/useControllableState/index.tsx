import * as React from "react";
import { useStableCallback } from "../useStableCallback";

type UseControllableStateParams<T> = {
  value?: T | undefined;
  defaultValue?: T | undefined;
  onChange?: (state: T) => void;
};

type SetStateFn<T> = (prevState?: T) => T;
// prop + onChange 受控，外部控制
// defaultProp + onChange 非受控，内部控制.value变化调用外部onChange
function useControllableState<T>({
  value,
  defaultValue,
  onChange = () => {},
}: UseControllableStateParams<T>) {
  const [uncontrolledState, setUncontrolledState] = useUncontrolledState({
    defaultValue,
    onChange,
  });
  const isControlled = value !== undefined;
  const state = isControlled ? value : uncontrolledState;
  const handleChange = useStableCallback(onChange);

  const setState: React.Dispatch<React.SetStateAction<T | undefined>> =
    React.useCallback(
      (nextValue) => {
        if (isControlled) {
          const setter = nextValue as SetStateFn<T>;
          const value =
            typeof nextValue === "function" ? setter(state) : nextValue;
          if (value !== state) handleChange(value as T);
        } else {
          setUncontrolledState(nextValue);
        }
      },
      [isControlled, state, handleChange, setUncontrolledState]
    );

  return [state, setState] as const;
}

// 组件自身控制状态，value变化调用外部onChange
function useUncontrolledState<T>({
  defaultValue,
  onChange,
}: Omit<UseControllableStateParams<T>, "prop">) {
  const uncontrolledState = React.useState<T | undefined>(defaultValue);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  const handleChange = useStableCallback(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
}

export { useControllableState };
