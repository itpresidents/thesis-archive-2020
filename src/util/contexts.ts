import { createContext } from "react";
import { IContext } from "types";
import { getCardHeightByCardWidth } from "util/cardSizeBreakpoints";
export const Context = createContext<IContext>({
  windowSize: [window.innerWidth, window.innerHeight],
  centralStore: {
    messages: [],
    cardSize: getCardHeightByCardWidth(),
  },
});
