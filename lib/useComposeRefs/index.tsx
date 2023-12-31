import { MutableRefObject, Ref, useCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

function useComposeRefs<T>(...refs: PossibleRef<T>[]) {
  return useCallback(
    function composedRef(node: T | null) {
      for (const ref of refs) {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref !== null && ref !== undefined) {
          (ref as MutableRefObject<T | null>).current = node;
        }
      }
    },
    [refs]
  );
}

export { useComposeRefs };
