import React from 'react';

/* for next js hydration */
const useHydratedStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = React.useState<F>({} as F);

  React.useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useHydratedStore;
