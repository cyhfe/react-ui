import { useCallback, useState } from "react";

function useForceUpdate() {
  const [, update] = useState();
  return useCallback(() => {
    update(Object.assign({}));
  }, []);
}

export { useForceUpdate };
