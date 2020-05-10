import React, { FC, useMemo } from "react";
import {
  AnimatedComponent,
  SpringValue,
  useSpring,
  config as springConfig,
  animated,
} from "react-spring";
import he from "he";

const ANIMATE_RANGE = 70;
const clampNameCode = (n: number): number => {
  if (n < 65) return n;
  return 65 + ((n - 65) % 26);
};
const mapCharcdoeAndSpring = (spring: number, charCode: number): number => {
  const change = Math.ceil(spring * ANIMATE_RANGE) - ANIMATE_RANGE;
  const mod = ((change % 26) + 26) % 26;
  return clampNameCode(charCode + mod);
};

export const mapSpringToString = (x: number, text: string): any => {
  let r: string = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === 10) {
      r = r.concat(text[i]);
      continue;
    }
    const newChar: string = String.fromCharCode(
      mapCharcdoeAndSpring(x, text.charCodeAt(i))
    );
    r = r.concat(newChar);
  }
  return r;
};

interface IAnimateTitleProps {
  title: string;
}
export const AnimatedTitle: FC<IAnimateTitleProps> = ({ title }) => {
  const spring = useSpring({
    config: { mass: 1, tension: 200, friction: 60 },
    from: { completion: 0 },
    to: { completion: 1 },
  });

  const decodedText = useMemo(() => he.decode(title).toUpperCase(), [title]);

  return (
    <animated.div>
      {spring.completion.to((x) => mapSpringToString(x, decodedText))}
    </animated.div>
  );
};

export default AnimatedTitle;
