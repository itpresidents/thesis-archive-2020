import React from "react";

const diameter = 39;
const width = 16.29;
const height = 19;
const centerX = diameter / 2 + 2;
const centerY = diameter / 2;
const left = centerX - width / 2;
const top = centerY + height / 2;
const middle = diameter / 2;
const right = centerX + width / 2;
const bottom = centerY - height / 2;

export const WatchPlay = () => (
  <svg
    width="39"
    height="39"
    viewBox="0 0 39 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="19.5" cy="19.5" r="19.5" fill="black" />
    <polygon
      points={`${left},${top} ${right},${middle}, ${left},${bottom}`}
      fill="white"
    />
    {/* <path d="M0.357178 0L16.6429 9.5L0.357178 19V0Z" fill="white"/> */}
  </svg>
);

export const Chevron = () => (
  <svg
    width="11"
    height="17"
    viewBox="0 0 11 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1.08545L9 8.37564L1 15.6106"
      stroke="#333333"
      stroke-width="1.38785"
      stroke-miterlimit="10"
    />
  </svg>
);
