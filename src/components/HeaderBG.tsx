import React from "react";
import svg20 from "../images/20.svg";

const HeaderBG = () => (
  <div id="header2020-bg">
    <div id="header2020-bg-animation" />
    <h1 className="position-absolute">ITP Thesis Archive</h1>
    <img
      id="header-invisible-height"
      src={svg20}
      alt="invisible to give background correct height"
    />
  </div>
);

export default HeaderBG;
