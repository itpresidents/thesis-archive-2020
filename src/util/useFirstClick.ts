import { useState, useCallback, useEffect } from "react";

const eventNames = ["wheel", "click", "touchmove"];

export const useFirstClick = (): boolean => {
  // if the use click, touch, or scrolled the page, the callback will get fired.
  const [clicked, setClicked] = useState(false);

  const clickedHandler = useCallback(() => {
    setClicked(true);
  }, []);

  useEffect(() => {
    if (!clicked) {
      for (let eventName of eventNames) {
        window.addEventListener(eventName, clickedHandler);
      }
    } else {
      for (let eventName of eventNames) {
        window.removeEventListener(eventName, clickedHandler);
      }
    }
    // cleanup
    return () => {
      for (let eventName of eventNames) {
        window.removeEventListener(eventName, clickedHandler);
      }
    };
  }, [clicked, clickedHandler]);

  return clicked;
};
