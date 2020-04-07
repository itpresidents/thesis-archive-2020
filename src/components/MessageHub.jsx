import React, { useRef, useState, useEffect } from "react";
import { useTransition, animated, config } from "react-spring";
import "../scss/messageHub.scss";

let id = 0;

const MessageHub = () => {
  const config = { tension: 125, friction: 20, precision: 0.1 };
  const timeout = 8000;
  const [refMap] = useState(() => new WeakMap());
  const [cancelMap] = useState(() => new WeakMap());
  const [items, setItems] = useState([]);

  const transitions = useTransition(items, (item) => item.key, {
    from: { opacity: 0, height: 0, lll: 0 },
    enter: (item) => async (next) => {
      await next({ opacity: 1, lll: 0, height: refMap.get(item).offsetHeight });
    },
    leave: (item) => async (next, cancel) => {
      cancelMap.set(item, cancel);
      // await next({ lll: 1 })
      await next({ opacity: 0, height: 0, lll: 1 });
      // await next({})
    },
    onRest: (item) =>
      setItems((state) => state.filter((i) => i.key !== item.key)),
    config: (item, state) =>
      state === "leave" ? [{ duration: timeout }, config, config] : config,
  });

  const handleMessage = (e) => {
    setItems((state) => [...state, { key: id++, msg: e.detail.message }]);
    console.log("items:");
    console.log(items);
  };

  useEffect(() => {
    if (window.hasMsgListener !== true) {
      document.addEventListener("toMessageHub", (e) => {
        handleMessage(e);
      });
      console.log("added");
      window.hasMsgListener = true;
    }
  }, []);

  return (
    <div id="Container">
      {transitions.map(({ key, item, props: { lll, ...style } }) => {
        console.log(lll.getValue());
        return (
          <animated.div id="Message" key={key} style={style}>
            <animated.div
              id="Content"
              style={{
                gridTemplateColumns:
                  style.canClose === false ? "1fr" : "1fr auto",
                marginTop: style.top ? "0" : "10px",
                marginBottom: style.top ? "10px" : "0",
              }}
              ref={(ref) => ref && refMap.set(item, ref)}
            >
              <animated.div
                id="lllife"
                style={{
                  position: "absolute",
                  right: `${100 - style.opacity.getValue() * 100}%`,
                }}
              />
              <p>{item.msg}</p>
              <button
                id="Button"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelMap.has(item) && cancelMap.get(item)();
                }}
              ></button>
            </animated.div>
          </animated.div>
        );
      })}
    </div>
  );
};

export default function HandleMessage() {
  const testMessage = () => {
    console.log("dispath");
    document.dispatchEvent(
      new CustomEvent("toMessageHub", {
        detail: {
          message: Math.random() * 10000,
        },
      })
    );
  };

  return (
    <>
      <div
        className="w-100 position-absolute text-center"
        style={{ zIndex: 9999999 }}
        onClick={testMessage}
      >
        Click here to create notifications
      </div>
      <div id="Main">
        <MessageHub />
      </div>
    </>
  );
}

export const AddMessage = (message) => {
  // console.log("dispath")
  // document.dispatchEvent(new CustomEvent('toMessageHub', {
  //     detail: {
  //         message: message,
  //     },
  // }))
};
