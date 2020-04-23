import { createContext } from "react";
import { IContext } from "types";

export const Context = createContext<IContext>({
  windowSize: [window.innerWidth, window.innerHeight],
  centralStore: {
    messages: [],
  },
});
