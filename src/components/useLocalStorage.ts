import { useCallback, useMemo, useState } from "react";

export const useLocalStorageState = <T>(key: string, initialValue: T) => {
  const [value, setState] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  const setValue = useCallback(
    (value: T) => {
      window.localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    },
    [key]
  );

  return useMemo(
    () => [value, setValue],
    // setValue is stabke
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  );
};
