import React, { useState, useCallback, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSpring, to, animated } from "react-spring";
import { Context } from "../util/contexts";
const magicNumber = 0.22;

const testHomePage = (location: any): boolean => {
  // it's at home page if the first match is not in ["students", "video", "about"]
  const notHomeRegex = /\b(students|videos|about|)\b/;
  return !notHomeRegex.test(location.pathname);
};

const HeaderBG = () => {
  const { windowSize } = useContext(Context);
  const windowHeight = windowSize[1];
  const [spring, setSpring] = useSpring(() => ({
    height: windowHeight * magicNumber,
    immediate: true,
  }));
  const location = useLocation();

  const [isAtHomePage, setIsAtHome] = useState(testHomePage(location));

  const onScroll = useCallback(
    (e: any) => {
      setSpring({
        height: windowHeight * magicNumber - document.body.scrollTop,
        immediate: true,
      });
    },
    [isAtHomePage]
  );

  useEffect(() => {
    document.body.addEventListener("scroll", onScroll);
    console.log("scrolling listenner added");
  }, []);

  useEffect(() => {
    setIsAtHome(testHomePage(location));
  }, [location]);

  useEffect(() => {
    setSpring({
      height: windowHeight * magicNumber - document.body.scrollTop,
      immediate: true,
    });
  }, [windowHeight]);

  return !isAtHomePage ? null : (
    <div id="header2020-bg" style={{}}>
      <animated.div
        id="header2020-bg-animation"
        style={{
          backgroundSize: to(spring.height, (height) => `25vh ${height}px`),
          height: to(spring.height, (height) => `${height + 4}px`),
        }}
      />
      <h1
        className=""
        style={{
          height: `${windowHeight * magicNumber + 4}px`,
        }}
      >
        Thesis Archive
      </h1>
    </div>
  );
};

export default HeaderBG;
