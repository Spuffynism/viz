import { useEffect, useRef } from 'react';

// adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback, { delay, executeImmediately = false }) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }

    if (!delay) {
      return
    }

    if (executeImmediately) {
      tick()
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, executeImmediately]);
}

export default useInterval;
