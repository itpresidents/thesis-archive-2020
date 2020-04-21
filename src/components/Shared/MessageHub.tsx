import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTransition, animated } from "react-spring";
import { FiX } from "react-icons/fi";
import { DEBUG } from "../../config";

interface IMessage {
  key: number;
  msg: string;
  autoDisappear: boolean;
}

const MessageHub = () => {
  const config = { tension: 125, friction: 20, precision: 0.1 };
  const timeout = 3000;
  const [refMap] = useState<Map<IMessage, HTMLDivElement>>(() => new Map());
  const [cancelMap] = useState<Map<IMessage, Function>>(() => new Map());
  const [items, setItems] = useState<IMessage[]>([]);
  const [listenerAdded, setListenerAdded] = useState(false);
  const listenerRef = useRef<null | HTMLDivElement | any>(null);
  const transition = useTransition(items, {
    key: (item) => item.key,
    from: { opacity: 0, height: 0, life: "100%", dead: 1 },
    enter: (item) => async (next, stop) => {
      DEBUG && console.log(`  Entering:`, item.key);
      cancelMap.set(item, () => {
        DEBUG && console.log(`  Cancelled:`, item.key);
        stop();
        setItems((state) => state.filter((i) => i.key !== item.key));
      });
      await next({
        opacity: 1,
        height: refMap.get(item) ? refMap.get(item)!.offsetHeight : 48,
        config,
      });
      await next({ life: "0%", config: { duration: timeout } });
      item.autoDisappear && cancelMap.get(item)!();
    },
    leave: (item) => async (next) => {
      DEBUG && console.log(`  Leaving:`, item.key);
      await next({ opacity: 0, height: 0, config });
      await next({ dead: 0, config });
    },
  });

  const handleMessage = useCallback(
    (e: CustomEvent) => {
      const { message: msg, autoDisappear } = e.detail;
      setItems((state) => [
        ...state,
        {
          key: state.map((a) => a.key).reduce((a, c) => Math.max(a, c), 0) + 1,
          msg,
          autoDisappear,
        },
      ]);
    },
    [setItems]
  );

  const clearMessageHub = () => {
    document.querySelectorAll(".clear-message-btn").forEach((btn) => {
      const btnRef = btn as HTMLElement;
      btnRef.click();
    });
  };

  useEffect(() => {
    if (listenerAdded === false) {
      // ref or other elements don't work, it has to be the document itself, I don't know why.
      document.addEventListener("toMessageHub", ((e: CustomEvent) => {
        handleMessage(e);
      }) as EventListener);
      document.addEventListener("clearMessageHub", (() => {
        clearMessageHub();
      }) as EventListener);
      // console.log("added");
      setListenerAdded(true);
    }
  }, [listenerAdded, handleMessage]);

  return (
    <div id="message-hub-positioner" ref={listenerRef}>
      <div className="message-container">
        {transition(({ life, dead, ...style }, item) => {
          return dead.get() === 0 ? null : (
            <animated.div className="message" key={item.key} style={style}>
              <div
                className="message-content"
                ref={(ref) => ref && refMap.set(item, ref)}
              >
                {item.autoDisappear && (
                  <animated.div
                    className="messageLife"
                    style={{ right: life }}
                  />
                )}
                <p>{item.msg}</p>
                <button
                  className="clear-message-btn"
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

export const AddMessage = (message: string, autoDisappear: boolean = true) => {
  DEBUG && console.log("Adding message: ", message);
  document.dispatchEvent(
    new CustomEvent("toMessageHub", {
      detail: {
        message: message,
        autoDisappear: autoDisappear,
      },
    })
  );
};

export const clearMessageHub = () => {
  DEBUG && console.log("clearing message hub");
  document.dispatchEvent(
    new CustomEvent("clearMessageHub", {
      detail: {},
    })
  );
};

export default MessageHub;
