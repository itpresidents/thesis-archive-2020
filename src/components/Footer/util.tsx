import React, { useState } from "react";
import { useDrag } from "react-use-gesture";
import { animated } from "react-spring";
import { Nav } from "react-bootstrap";
// todo: automatically determine

const HorizontalDraggable = ({
  children,
  maxWidth,
}: {
  children: React.ReactNode;
  maxWidth: number;
}) => {
  const [x, setX] = useState<number>(0);

  const bind = useDrag(
    ({ offset: [x] }) => {
      setX(x);
    },
    {
      bounds: {
        left: -maxWidth,
        bottom: 0,
        top: 0,
        right: 0,
      },
      axis: "x",
    }
  );

  return (
    <animated.div {...bind()} style={{ x }} className="inner">
      {children}
    </animated.div>
  );
};

export const FooterLeft = ({ children }: { children: React.ReactNode }) => (
  <Nav className="left">{children}</Nav>
);

export const ScrollableFooterRight = ({
  children,
  scrollableWidth,
}: {
  children: React.ReactNode;
  scrollableWidth: number;
}) => (
  <div className="right navbar-nav">
    <HorizontalDraggable maxWidth={scrollableWidth}>
      {children}
    </HorizontalDraggable>
  </div>
);
