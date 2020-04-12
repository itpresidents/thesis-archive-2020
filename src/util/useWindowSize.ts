import { useState, useEffect } from "react";

function useWindowSize() {
  const [windowSize, set] = useState<number[]>([
    window.innerWidth,
    window.innerHeight,
  ]);
  useEffect(() => {
    const handler = () => {
      set([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return windowSize;
}

export default useWindowSize;
