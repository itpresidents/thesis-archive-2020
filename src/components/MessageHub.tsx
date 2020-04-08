import React, { useRef, useState, useEffect } from "react";
import { useTransition, animated } from "react-spring";
import { FiX } from "react-icons/fi";
import "../scss/messageHub.scss";

const DEBUG = false;

interface IMessage {
  key: number;
  msg: string;
}

const MessageHub = () => {
  const config = { tension: 125, friction: 20, precision: 0.1 };
  const timeout = 3000;
  const [refMap] = useState<WeakMap<IMessage, HTMLDivElement>>(
    () => new WeakMap()
  );
  const [cancelMap] = useState<WeakMap<IMessage, Function>>(
    () => new WeakMap()
  );
  const [items, setItems] = useState<IMessage[]>([]);
  const [listenerAdded, setListenerAdded] = useState(false);
  const [key, setKey] = useState<number>(0);
  const listenerRef = useRef<null | HTMLDivElement | any>(null);
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
        height: refMap.get(item) ? refMap.get(item)!.offsetHeight : 48,
        config,
      });
      await next({ life: "0%", config: { duration: timeout } });
      cancelMap.get(item)!();
    },
    leave: (item) => async (next) => {
      if (DEBUG) console.log(`  Leaving:`, item.key);
      await next({ opacity: 0, height: 0, config });
      await next({ dead: 0, config });
    },
  });

  const handleMessage = (e: CustomEvent) => {
    setKey((key) => key++);
    setItems((state) => [...state, { key, msg: e.detail.message }]);
  };

  useEffect(() => {
    if (listenerAdded === false) {
      // ref or other elements don't work, it has to be the document itself, I don't know why.
      document.addEventListener("toMessageHub", ((e: CustomEvent) => {
        handleMessage(e);
      }) as EventListener);
      console.log("added");
      setListenerAdded(true);
    }
  }, []);

  return (
    <div id="message-hub-positioner" ref={listenerRef}>
      <div id="Container">
        {transition(({ life, dead, ...style }, item) => {
          return dead.get() === 0 ? null : (
            <animated.div id="Message" key={item.key} style={style}>
              <div id="Content" ref={(ref) => ref && refMap.set(item, ref)}>
                <animated.div id="messageLife" style={{ right: life }} />
                <p>{item.msg}</p>
                <button
                  id="Button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelMap.has(item) && cancelMap.get(item)!();
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>
            </animated.div>
          );
        })}
      </div>
    </div>
  );
};

export const AddMessage = (message: string) => {
  console.log("Adding message: ", message);
  document.dispatchEvent(
    new CustomEvent("toMessageHub", {
      detail: {
        message: message,
      },
    })
  );
};

// const CreateTestMessages = () => {
//   const testMessage = () => {
//     AddMessage(Math.random().toString());
//   };
//   return (
//     <>
//       <MessageHub />
//       <div
//         className="w-100 fixed-top text-center"
//         style={{ zIndex: 9999999 }}
//         onClick={testMessage}
//       >
//         Click here to create test notifications
//       </div>
//     </>
//   );
// };

export default MessageHub;
