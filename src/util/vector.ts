export const addVector = (a: Array<number>, b: Array<number>): any => {
  return a.map((e, i) => e + b[i]);
};

export const scaleVector = (a: Array<number>, b: number): any => {
  return a.map((e, i) => e * b);
};

export const multiplyElementWise = (
  a: Array<number>,
  b: Array<number>
): any => {
  return a.map((e, i) => e * b[i]);
};

export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

export const compareVector = (a: Array<number>, b: Array<number>): any => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const clampVector = (
  a: Array<number>,
  min: Array<number>,
  max: Array<number>
) => {
  return a.map((e, i) => clamp(e, min[i], max[i]));
};

export interface IVector2Object {
  x: number;
  y: number;
}

export const searchForArray = (
  haystack: Array<any>,
  needle: Array<any>
): number => {
  var i, j, current;
  for (i = 0; i < haystack.length; ++i) {
    if (needle.length === haystack[i].length) {
      current = haystack[i];
      for (j = 0; j < needle.length && needle[j] === current[j]; ++j);
      if (j === needle.length) return i;
    }
  }
  return -1;
};
