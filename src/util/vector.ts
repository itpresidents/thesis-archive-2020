export const addVector = (a: Array<number>, b: Array<number>): any => {
  return a.map((e, i) => e + b[i]);
};

export const scaleVector = (a: Array<number>, b: number): any => {
  return [a[0] * b, a[1] * b];
};

export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};

export const clampVector = (
  a: Array<number>,
  min: Array<number>,
  max: Array<number>
) => {
  return a.map((e, i) => clamp(e, min[i], max[i]));
};
