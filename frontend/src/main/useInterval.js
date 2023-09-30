import { useEffect, useRef } from 'react'

// adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback, { delay, executeImmediately = false, active = true }) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }

    if (!delay || !active) {
      return
    }

    if (executeImmediately) {
      tick()
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, executeImmediately, active]);
}

export default useInterval;
