import { ICardSize } from "types";

//const bkp_lg = 992;
const bkp_sm = 576;

// those arbitrary numbers are from the design.
export const getCardSizeByCardWidth = (cardW: number = 212): ICardSize => ({
  width: cardW,
  height: cardW * 1.41,
  infoHeight: cardW * 0.45,
  widthWithMargin: cardW * 1.4,
  heightWithMargin: cardW * 2.1,
});

export const getCardSizeByWindowSize = (windowSize: number[]): ICardSize => {
  switch (true) {
    case windowSize[0] > bkp_sm:
      return getCardSizeByCardWidth();
    default:
      return getCardSizeByCardWidth(175);
  }
};
