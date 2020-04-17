import { useState, useRef } from "react";

const DEBUG = false;

export const useFirstClick = (): boolean => {
  // if the use click, touch, or scrolled the page, the callback will get fired.
  const eventNames = ["wheel", "click", "touchmove"];
  const [listenersAdded, setListenersAdded] = useState(false);
  const [did, setDid] = useState(false);

  const listenToFistClick = useRef(() => {
    !did && setDid(true);
    for (let eventName of eventNames) {
      window.removeEventListener(eventName, listenToFistClick.current);
    }
    DEBUG &&
      console.log(
        `tried  window.removeEventListener("click", listenToFistClick.current);`
      );
  });

  if (!listenersAdded) {
    for (let eventName of eventNames) {
      window.addEventListener(eventName, listenToFistClick.current);
    }
    setListenersAdded(true);
  }

  return did;
};
