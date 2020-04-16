import { Vector } from "./util/vector";
// should be either

export const apis = {
  FAKE_FROM_2018: "FAKE_FROM_2018",
  REAL: "REAL",
};

export const api = apis.FAKE_FROM_2018;

// responsive card size
const cardWidth =
  window.innerWidth >= window.innerHeight
    ? 160 + window.innerWidth / 12
    : window.innerHeight / 4;
export const cardSize = new Vector([cardWidth, cardWidth * 1.6]);

export const DEBUG = false;
