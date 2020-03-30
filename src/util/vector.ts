export const addVector = (a: Array<number>, b: Array<number>): any => {
  return a.map((e, i) => e + b[i]);
};

export const scaleVector = (a: Array<number>, b: number): any => {
  return [a[0] * b, a[1] * b];
};
