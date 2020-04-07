// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useTransition, animated, config } from "react-spring";
import { FiX } from "react-icons/fi";
import "../scss/messageHub.scss";

let id = 0;

const DEBUG = true;

const MessageHub = () => {
  const config = { tension: 125, friction: 20, precision: 0.1 };
  const timeout = 3000;
  const [refMap] = useState(() => new WeakMap());
  const [cancelMap] = useState(() => new WeakMap());
  const [items, setItems] = useState([]);
  const [listenerAdded, setListenerAdded] = useState(false);
  const transition = useTransition(items, {
    key: (item) => item.key,
    from: { opacity: 0, height: 0, life: "100%", dead: 1 },
    enter: (item) => async (next, stop) => {
      if (DEBUG) console.log(`  Entering:`, item.key);
      cancelMap.set(item, () => {
        if (DEBUG) console.log(`  Cancelled:`, item.key);
        stop();
        setItems((state) => state.filter((i) => i.key !== item.key));
      });
      await next({
        opacity: 1,
        height: refMap.get(item).offsetHeight,
        config,
      });
      await next({ life: "0%", config: { duration: timeout } });
      cancelMap.get(item)();
    },
    leave: (item) => async (next) => {
      if (DEBUG) console.log(`  Leaving:`, item.key);
      await next({ opacity: 0, height: 0, config });
      await next({ dead: 0, config });
    },
  });

  const handleMessage = (e) => {
    setItems((state) => [...state, { key: id++, msg: e.detail.message }]);
    console.log("items:");
    console.log(items);
  };

  useEffect(() => {
    if (listenerAdded === false) {
      document.addEventListener("toMessageHub", (e) => {
        handleMessage(e);
      });
      console.log("added");
      setListenerAdded(true);
    }
  }, []);

  return (
    <div id="message-hub-positioner">
      <div id="Container">
        {transition(({ life, dead, ...style }, item) => {
          console.log(dead.get());
          return dead.get() === 0 ? null : (
            <animated.div id="Message" key={id} style={style}>
              <animated.div
                id="Content"
                ref={(ref) => ref && refMap.set(item, ref)}
              >
                <animated.div id="messageLife" style={{ right: life }} />
                <p>{item.msg}</p>
                <button
                  id="Button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelMap.has(item) && cancelMap.get(item)();
                  }}
                >
                  <FiX size={24} />
                </button>
              </animated.div>
            </animated.div>
          );
        })}
      </div>
    </div>
  );
};

export const AddMessage = (message) => {
  console.log("dispath");
  document.dispatchEvent(
    new CustomEvent("toMessageHub", {
      detail: {
        message: message,
      },
    })
  );
};

const CreateTestMessages = () => {
  const testMessage = () => {
    AddMessage(Math.random());
  };
  return (
    <>
      <MessageHub />
      <div
        className="w-100 fixed-top text-center"
        style={{ zIndex: 9999999 }}
        onClick={testMessage}
      >
        Click here to create test notifications
      </div>
    </>
  );
};

export default MessageHub;
