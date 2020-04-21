import React, { useCallback, useEffect, useContext } from "react";
import { useSpring, to, animated } from "react-spring";
import { Context } from "../../util/contexts";
import { AddMessage } from "./MessageHub";
import Rolling20, { IRolling20Props } from "./Rolling20";

export const HEADER_HEIGHT_IN_VH = 70;
const BG_SCROLL_SPEED = 0.066;
const BG_ROWS = 2;

const pxToVh = (px: number, windowHeight: number): number =>
  (100 * px) / windowHeight;

const HeaderSpring = ({
  collapse,
  isAtHomePage,
}: {
  collapse: boolean;
  isAtHomePage: boolean;
}) => {
  const { windowSize, navigatorPlatform } = useContext(Context);
  const windowHeight = windowSize[1];
  const [spring, setSpring] = useSpring(() => ({
    height: HEADER_HEIGHT_IN_VH,
  }));

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

  useEffect(collapseHeaderAndShowMessage, [collapse]);

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
    setSpring({
      height: collapse
        ? 0
        : HEADER_HEIGHT_IN_VH - pxToVh(document.body.scrollTop, windowHeight),
    });
  }, [windowHeight, setSpring, collapse]);

  const Rolling20Props: IRolling20Props = {
    heightInVh: spring!.height,
    rows: BG_ROWS,
    speed: BG_SCROLL_SPEED,
  };

  return !isAtHomePage ? null : (
    <animated.div
      id="header2020-container"
      style={{
        height: to(spring.height, (height) => `${height}vh`),
      }}
    >
      <animated.h1
        className="position-absolute"
        style={{
          height: to(spring.height, (height) => `${height}vh`),
        }}
      >
        Thesis <br />
        Archive
      </animated.h1>
      <Rolling20 {...Rolling20Props} />
    </animated.div>
  );
};

export default HeaderSpring;

// {
//   new Array(bgLayerCount).fill(0).map((item, i) => (
//     <animated.div
//       className="header2020-bg-animation"
//       key={i}
//       style={{
//         top: to(spring.height, (height) => `${(i * height) / bgLayerCount}px`),
//         backgroundSize: to(
//           spring.height,
//           (height) =>
//             `${(headerHeightRatio / bgLayerCount) * 100 * svgWhRatio}vh ${
//               height / bgLayerCount
//             }px`
//         ),
//         height: to(spring.height, (height) => `${height / bgLayerCount}px`),
//         animation: `move_background${
//           i === 1 ? "_reverse" : ""
//         } ${bgScrollSpeed}s infinite linear`,
//       }}
//     />
//   ));
// }
