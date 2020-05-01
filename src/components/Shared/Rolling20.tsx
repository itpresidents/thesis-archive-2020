import React, { useRef } from "react";
import { to, animated, SpringValue } from "react-spring";

const injectStyle = (style: string) => {
  const styleElement = document.createElement("style");
  document.head.appendChild(styleElement);
  const styleSheet = styleElement.sheet! as CSSStyleSheet;
  styleSheet.insertRule(style, styleSheet.cssRules.length);
};

const getUniqueKeyframeName = (uniqueId: string, reverse: boolean) =>
  `move_background_${uniqueId}${reverse ? "_reversed" : ""}`;

const getWidthOf20InVh = (rows: number, heightVhStatic: number) =>
  `${(heightVhStatic * SVG_20_WIDTH_HEIGHT_RATIO) / rows}vh`;

const rollingBgKeyframe = (
  uniqueId: string,
  rows: number,
  heightVhStatic: number,
  reverse: boolean = false
) => `
@keyframes ${getUniqueKeyframeName(uniqueId, reverse)} {
  from {
    background-position: 0 0;
  }
  to {
    background-position: ${reverse ? "-" : ""}${getWidthOf20InVh(
  rows,
  heightVhStatic
)} 0;
  }
}
`;
const injectRollingbgKeyframes = (
  uniqueId: string,
  rows: number,
  heightVhStatic: number
) => {
  injectStyle(rollingBgKeyframe(uniqueId, rows, heightVhStatic));
  injectStyle(rollingBgKeyframe(uniqueId, rows, heightVhStatic, true));
};

const getTop = (
  idx: number,
  height: number | SpringValue<number>,
  rows: number
) => {
  if (typeof height === "number") return `${(idx * height) / rows}vh`;
  return height.to((h) => `${(idx * h) / rows}vh`);
};

const getHeight = (height: number | SpringValue<number>, rows: number) => {
  return getTop(1, height, rows);
};

const getBgSize = (
  height: number | SpringValue<number>,
  heightVhStatic: number,
  rows: number
) => {
  if (typeof height === "number")
    return `${(height / rows) * SVG_20_WIDTH_HEIGHT_RATIO}vh`;
  return to(
    height,
    (h) =>
      `${(heightVhStatic / rows) * SVG_20_WIDTH_HEIGHT_RATIO}vh ${h / rows}vh`
  );
};

const getAnimation = (idx: number, speed: number, uniqueId: string): string =>
  `${getUniqueKeyframeName(uniqueId, idx % 2 === 1 ? true : false)} ${
    1 / speed
  }s infinite linear`;

export const SVG_20_WIDTH_HEIGHT_RATIO = 1.17;
export interface IRolling20Props {
  heightInVh: number | SpringValue<number>;
  targetVH?: number;
  rows: number;
  speed: number;
}

const Rolling20 = ({
  heightInVh: height,
  rows,
  speed,
  targetVH,
}: IRolling20Props) => {
  const uniqueId = useRef<string>(Math.random().toString(36).substring(2, 10));
  const heightVhRef = useRef<number>(
    targetVH !== undefined
      ? targetVH
      : typeof height === "number"
      ? height
      : height.get()
  );
  injectRollingbgKeyframes(uniqueId.current, rows, heightVhRef.current);

  return (
    <>
      <animated.div
        className="svg2020-animation-container"
        style={{
          height: getHeight(height, 1),
        }}
      >
        {new Array(rows).fill(0).map((item, i) => (
          <animated.div
            className="svg2020-animation-row"
            key={i}
            style={{
              top: getTop(i, height, rows),
              backgroundSize: getBgSize(height, heightVhRef.current, rows),
              height: getHeight(height, rows),
              animation: getAnimation(i, speed, uniqueId.current),
            }}
          />
        ))}
      </animated.div>
    </>
  );
};

export default Rolling20;
