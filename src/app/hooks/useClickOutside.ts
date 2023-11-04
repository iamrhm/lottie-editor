import React from 'react';

const useClickOutside = (
  handler: (e: MouseEvent) => void = () => {}
): React.Ref<HTMLDivElement> => {
  const ref = React.useRef<HTMLDivElement>(null);

  const outsideClickHandler = React.useCallback(
    (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler(e);
      }
    },
    [handler]
  );

  React.useEffect(() => {
    document.addEventListener('click', outsideClickHandler);
    return (): void =>
      document.removeEventListener('click', outsideClickHandler);
  }, [outsideClickHandler]);

  return ref;
};

export default useClickOutside;
