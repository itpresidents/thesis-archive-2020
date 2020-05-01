import React, { useState, useMemo } from "react";
import { useDrag } from "react-use-gesture";
import { animated } from "react-spring";
import { Nav } from "react-bootstrap";
import ContainerDimensions from "react-container-dimensions";
// todo: automatically determine

const HorizontalDraggable = ({
  children,
  containerWidth,
}: {
  children: React.ReactNode;
  containerWidth: number;
}) => {
  const [x, setX] = useState<number>(0);

  const [wrapperWidth, setWrapperWidth] = useState<number | null>(null);

  const wrapperRef = (node: HTMLDivElement | null) => {
    if (!node) return;
    setWrapperWidth(node.getBoundingClientRect().width);
  };

  console.log("wrapper width", wrapperWidth);

  const maxLeft = useMemo(() => {
    if (!wrapperWidth) return 0;

    console.log("container, wrapper", containerWidth, wrapperWidth);

    return Math.min((containerWidth * 2) / 3 - wrapperWidth, 0);
  }, [containerWidth, wrapperWidth]);

  console.log("max left", maxLeft);

  const bind = useDrag(
    ({ offset: [x] }) => {
      setX(x);
    },
    {
      bounds: {
        left: maxLeft,
        bottom: 0,
        top: 0,
        right: 0,
      },
      axis: "x",
    }
  );

  return (
    <animated.div {...bind()} style={{ x }} className="inner" ref={wrapperRef}>
      {children}
    </animated.div>
  );
};

export const FooterLeft = ({ children }: { children: React.ReactNode }) => (
  <Nav className="left">{children}</Nav>
);

export const ScrollableFooterRight = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="right navbar-nav">
    <ContainerDimensions>
      {({ width }) => (
        <HorizontalDraggable containerWidth={width}>
          {children}
        </HorizontalDraggable>
      )}
    </ContainerDimensions>
  </div>
);
