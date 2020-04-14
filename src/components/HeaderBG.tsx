import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from "react";
import { useLocation } from "react-router-dom";
import { useSpring, to, animated } from "react-spring";
import { Context } from "../util/contexts";
import { AddMessage } from "./MessageHub";

const headerHeightRatio = 0.22;

const testHomePage = (location: any): boolean => {
  // it's at home page if the first match is not in ["students", "video", "about"]
  const notHomeRegex = /\b(students|videos|about|)\b/;
  return !notHomeRegex.test(location.pathname);
};

const HeaderBG = () => {
  const { windowSize } = useContext(Context);
  const windowHeight = windowSize[1];
  const [spring, setSpring] = useSpring(() => ({
    height: windowHeight * headerHeightRatio,
    // immediate: true,
  }));
  const [listenersAdded, setListenersAdded] = useState(false);
  const [didFistClick, setdidFistClick] = useState(false);
  const listenToFistClick = useRef(() => {
    !didFistClick && setdidFistClick(true);
    window.removeEventListener("wheel", listenToFistClick.current);
    window.removeEventListener("click", listenToFistClick.current);
    console.log("tried removing");
  });

  const location = useLocation();
  const [isAtHomePage, setIsAtHome] = useState(testHomePage(location));

  const collapseHeaderAndShowMessage = useCallback(() => {
    setSpring({ height: 0 });
    isAtHomePage && AddMessage("Drag to explore, click to Read More.", false);
  }, [setSpring, isAtHomePage]);

  useEffect(() => {
    collapseHeaderAndShowMessage();
  }, [didFistClick, collapseHeaderAndShowMessage]);

  if (!listenersAdded) {
    window.addEventListener("click", listenToFistClick.current);
    window.addEventListener("wheel", listenToFistClick.current);
    setListenersAdded(true);
  }

  useEffect(() => {
    setIsAtHome(testHomePage(location));
  }, [location]);

  useEffect(() => {
    setSpring({
      height: windowHeight * headerHeightRatio - document.body.scrollTop,
      immediate: true,
    });
  }, [windowHeight, setSpring]);

  return (
    <animated.div
      id="header2020-bg"
      style={{
        height: to(spring.height, (height) => `${height}px`),
      }}
    >
      <animated.div
        id="header2020-bg-animation"
        style={{
          backgroundSize: to(spring.height, (height) => `25vh ${height}px`),
          height: to(spring.height, (height) => `${height}px`),
        }}
      />
      <animated.h1
        className="position-absolute"
        style={{
          height: to(spring.height, (height) => `${height}px`),
        }}
      >
        Thesis Archive
      </animated.h1>
    </animated.div>
  );
};

export default HeaderBG;
