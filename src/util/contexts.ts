import { createContext } from "react";

interface IContext {
  windowSize: number[];
}

export const Context = createContext<IContext>({
  windowSize: [window.innerWidth, window.innerHeight],
});
