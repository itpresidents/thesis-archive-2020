import { createContext } from "react";
import { Vector } from "./vector";

interface IPlatform {
  label: string;
  isMac: boolean;
  isIOS: boolean;
}

// I put this in context since we will probably optimize our app for mobile soon,
interface IContext {
  windowSize: Vector | number[];
  navigatorPlatform?: IPlatform;
}

export const Context = createContext<IContext>({
  windowSize: [window.innerWidth, window.innerHeight],
});
