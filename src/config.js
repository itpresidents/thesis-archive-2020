// should be either

export const apis = {
  FAKE_FROM_2018: "FAKE_FROM_2018",
  REAL: "REAL",
};

export const api = apis.FAKE_FROM_2018;

// responsive card size
const cardWidth =
  window.innerWidth >= window.innerHeight
    ? window.innerWidth / 6
    : window.innerHeight / 4;
export const cardSize = [cardWidth, cardWidth * 1.5];
