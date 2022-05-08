import { useEffect, useRef } from "react";

export const useEffectOnce = (run: () => void) => {
  const once = useRef(false);

  useEffect(
    () => {
      if (!once.current) {
        run();
        once.current = true;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};
