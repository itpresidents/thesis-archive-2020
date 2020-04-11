import React, { useState, useCallback, useEffect } from "react";

const magicNumber = 0.22;

const HeaderBG = () => {
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [height, setHeight] = useState<number>(windowHeight * magicNumber);

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

  const onScroll = useCallback((e: any) => {
    setHeight(windowHeight * magicNumber - e.target.scrollTop);
  }, []);
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
        Thesis Archive
      </h1>
    </div>
  );
};

export default HeaderBG;
