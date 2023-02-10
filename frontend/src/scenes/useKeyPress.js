import { useState, useEffect } from "react";

export const Arrows = {
  right: 'ArrowRight',
  left: 'ArrowLeft'
}

export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);
  function downHandler({ key }) {
    setKeyPressed(key === targetKey)
  }
  useEffect(() => {
    window.addEventListener("keyup", downHandler);
    return () => {
      window.removeEventListener("keyup", downHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
}
