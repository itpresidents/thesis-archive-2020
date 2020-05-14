import * as Comlink from "comlink";

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

const mapSpringToString = (x: number, text: string): string => {
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

Comlink.expose({ mapSpringToString });
