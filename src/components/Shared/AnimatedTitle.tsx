import React, { FC } from "react";
import { AnimatedComponent, SpringValue } from "react-spring";
import he from "he";

const ANIMATE_RANGE = 70;
const clampNameCode = (n: number): number => {
  if (n < 65) return n;
  return 65 + ((n - 65) % 26);
};
const mapCharcdoeAndSpring = (spring: number, charCode: number): number => {
  const change = (26 + Math.ceil(spring * ANIMATE_RANGE) - ANIMATE_RANGE) % 26;
  return clampNameCode(charCode + change);
};

export const mapSpringToString = (x: number, text: string): any => {
  console.log(text.length);
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
  spring: SpringValue<number>;
  title: string;
  classNames?: string;
  AnimatedTag: AnimatedComponent<"h1"> | AnimatedComponent<"h2">;
}
export const AnimatedTitle: FC<IAnimateTitleProps> = ({
  title,
  spring,
  AnimatedTag,
  classNames = "",
}) => {
  return (
    <AnimatedTag className={classNames}>
      {spring.to((x) => mapSpringToString(x, he.decode(title).toUpperCase()))}
    </AnimatedTag>
  );
};

export default AnimatedTitle;
