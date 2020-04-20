import React, { useState, useCallback, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSpring, to, animated } from "react-spring";
import { Context } from "../util/contexts";
import { AddMessage } from "./MessageHub";
import { DEBUG } from "../config";
import { useFirstClick } from "../util/useFirstClick";

const headerHeightRatio = 0.7;
const bgScrollSpeed = 15;
const svgWhRatio = 1.17;
const bgLayerCount = 2;

const injectStyle = (style: string) => {
  const styleElement = document.createElement("style");
  document.head.appendChild(styleElement);
  const styleSheet = styleElement.sheet! as CSSStyleSheet;
  styleSheet.insertRule(style, styleSheet.cssRules.length);
};

const rollingBG = (reverse: boolean = false) => `
@keyframes move_background${reverse ? "_reverse" : ""} {
  from {
    background-position: 0 0;
  }
  to {
    background-position: ${
      (((reverse ? -1 : 1) * headerHeightRatio * svgWhRatio) / bgLayerCount) *
      100
    }vh 0;
  }
}
`;

injectStyle(rollingBG());
injectStyle(rollingBG(true));

const testHomePage = (location: any): boolean => {
  // it's at home page if the first match is not in ["students", "video", "about"]
  const notHomeRegex = /\b(students|videos|about)\b/;
  return !notHomeRegex.test(location.pathname);
};

const HeaderBG = () => {
  const { windowSize, navigatorPlatform } = useContext(Context);
  const windowHeight = windowSize[1];
  const [spring, setSpring] = useSpring(() => ({
    height: windowHeight * headerHeightRatio,
  }));

  const location = useLocation();
  const [isAtHomePage, setIsAtHome] = useState(testHomePage(location));

  const collapseHeaderAndShowMessage = useCallback(() => {
    setSpring({ height: 0 });
    isAtHomePage &&
      !navigatorPlatform?.isMobile &&
      AddMessage(
        `Drag ${
          navigatorPlatform?.isMac ? "or scroll " : ""
        }to explore, click to Read More.`,
        false
      );
  }, [setSpring, isAtHomePage, navigatorPlatform]);

  const didFirstClick = useFirstClick();
  DEBUG && console.log(didFirstClick);

  useEffect(collapseHeaderAndShowMessage, [didFirstClick]);

  useEffect(() => {
    if (isAtHomePage)
      document
        .getElementsByTagName("html")[0]
        .setAttribute("style", "overscroll-behavior-x:none");
    else
      document
        .getElementsByTagName("html")[0]
        .setAttribute("style", "overscroll-behavior-x:auto");
  }, [isAtHomePage]);

  useEffect(() => {
    setIsAtHome(testHomePage(location));
  }, [location]);

  useEffect(() => {
    setSpring({
      height: windowHeight * headerHeightRatio - document.body.scrollTop,
      immediate: true,
    });
  }, [windowHeight, setSpring]);

  return !isAtHomePage ? null : (
    <animated.div
      id="header2020-bg"
      style={{
        height: to(spring.height, (height) => `${height}px`),
      }}
    >
      {new Array(bgLayerCount).fill(0).map((item, i) => (
        <animated.div
          className="header2020-bg-animation"
          key={i}
          style={{
            top: to(
              spring.height,
              (height) => `${(i * height) / bgLayerCount}px`
            ),
            backgroundSize: to(
              spring.height,
              (height) =>
                `${(headerHeightRatio / bgLayerCount) * 100 * svgWhRatio}vh ${
                  height / bgLayerCount
                }px`
            ),
            height: to(spring.height, (height) => `${height / bgLayerCount}px`),
            animation: `move_background${
              i === 1 ? "_reverse" : ""
            } ${bgScrollSpeed}s infinite linear`,
          }}
        />
      ))}

      <animated.h1
        className="position-absolute"
        style={{
          height: to(spring.height, (height) => `${height}px`),
        }}
      >
        Thesis <br />
        Archive
      </animated.h1>
    </animated.div>
  );
};

export default HeaderBG;
