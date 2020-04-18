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

export class SmoothVector {
  inputs: number[][];
  constructor() {
    this.inputs = [];
  }

  smooth(lastInput: number[], lookBack: number): number[] {
    this.inputs.push(lastInput);
    this.inputs = this.inputs.slice(
      Math.max(this.inputs.length - lookBack, 0),
      this.inputs.length
    );
    let r = this.inputs[0];
    for (let i = 1; i < this.inputs.length; i++) {
      r = scaleVector(addVector(r, this.inputs[i]), 0.5);
    }
    return r;
  }
}

interface IMyVector {
  x: number;
  y: number;
  z?: number;
}

export class Vector extends Array<number> implements IMyVector {
  constructor(vec: number[] | Vector) {
    super();
    for (let i = 0; i < Math.min(3, vec.length); i++) {
      this[i] = vec[i];
    }
  }
  get x(): number {
    return this[0];
  }
  get y(): number {
    return this[1];
  }
  get z(): number {
    return this[2];
  }

  isEqual(vec: Vector | number[]): boolean {
    if (vec.length !== this.length) return false;
    for (let i in this) {
      if (this[i] !== vec[i]) return false;
    }
    return true;
  }

  add(vec: Array<number>): number[];
  add(vec: Vector): number[] {
    return addVector(this, vec);
  }

  multiplyElementWise(vec: Array<number>): number[];
  multiplyElementWise(vec: Vector): number[] {
    return multiplyElementWise(this, vec);
  }

  scale(ratio: number): number[] {
    return scaleVector(this, ratio);
  }

  toArray(): number[] {
    return [...this];
  }
}

export interface IMatrixEdges {
  start: Vector;
  end: Vector;
}
