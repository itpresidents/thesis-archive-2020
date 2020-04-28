import { createContext } from "react";
import { IContext } from "types";
import { getCardSizeByCardWidth } from "util/cardSizeBreakpoints";
export const Context = createContext<IContext>({
  windowSize: [window.innerWidth, window.innerHeight],
  centralStore: {
    messages: [],
  },
  cardSize: getCardSizeByCardWidth(),
});
