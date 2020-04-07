import React, { useState, useCallback, useEffect } from "react";
import { AddMessage } from "./MessageHub";

const magicNumber = 0.22;

const HeaderBG = () => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [height, setHeight] = useState<number>(windowHeight * magicNumber);
  const [tipSent, setSent] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      console.log("resize");
      setWindowHeight(window.innerHeight);
      setHeight(window.innerHeight * magicNumber - document.body.scrollTop);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!tipSent && height < 10) {
      AddMessage("Drag to explore, click to Read More.");
      setSent(true);
    }
  }, [height]);

  const onScroll = useCallback(
    (e: any) => {
      setHeight(windowHeight * magicNumber - e.target.scrollTop);
    },
    [height]
  );
  document.body.addEventListener("scroll", onScroll);
  return (
    <div id="header2020-bg">
      <div
        id="header2020-bg-animation"
        style={{
          backgroundSize: `25vh ${height}px`,
          height: `${height + 4}px`,
        }}
      />
      <h1
        className=""
        style={{
          height: `${windowHeight * magicNumber}px`,
        }}
      >
        ITP Thesis Archive
      </h1>
    </div>
  );
};

export default HeaderBG;
