/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useCallback, useMemo } from "react";
import { IStudentSummary, ICardSize } from "../../types";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import {
  SmoothVector,
  Vector,
  IMatrixEdges,
  addVector,
  scaleVector,
} from "util/vector";
import { Context } from "../../util/contexts";
import CardsMatrix from "./CardsMatrix";
import { clearAllMessagesAction } from "util/homemadeRedux/actions";

interface IDraggableCardsProps {
  studentsToShow: IStudentSummary[] | undefined;
}

const smoother = new SmoothVector();

interface Position {
  x: number;
  y: number;
}

const getMatrixEdges = (
  windowSizeInCards: Vector,
  center: Vector
): IMatrixEdges => {
  const bleed = [2, 2];
  const start = new Vector(center).add(new Vector(windowSizeInCards).scale(-1));
  const end = new Vector(center).add(bleed);

  return { start: new Vector(start), end: new Vector(end) };
};

const getWindowSizeInCards = (
  windowSize: [number, number],
  cardSize: ICardSize
) =>
  new Vector([
    Math.ceil(windowSize[0] / cardSize.widthWithMargin),
    Math.ceil(windowSize[1] / cardSize.heightWithMargin),
  ]);

const DraggableCards = ({ studentsToShow }: IDraggableCardsProps) => {
  const { windowSize, navigatorPlatform, dispatch, cardSize } = useContext(
    Context
  );
  const [windowWidth, windowHeight] = windowSize;
  const [position, setPosition] = useSpring<Position>(() => ({
    x: 0,
    y: 0,
  }));

  const [matrixCenterXy, setMatrixCenterXy] = useState<Vector>(
    new Vector([0, 0])
  );

  const updateCenterXyIfChanged = useCallback(
    (x: number, y: number) => {
      const matrixCenterX = Math.ceil(x / cardSize.widthWithMargin);
      const matrixCenterY = Math.ceil(y / cardSize.heightWithMargin);

      if (
        matrixCenterX !== matrixCenterXy[0] ||
        matrixCenterY !== matrixCenterXy[1]
      ) {
        setMatrixCenterXy(new Vector([matrixCenterX, matrixCenterY]));
      }
    },
    [cardSize]
  );

  const [clearedDraggingTip, setClearedDraggingTip] = useState<number>(0);
  const clearDraggineTipTwice = useCallback(() => {
    if (clearedDraggingTip <= 2) {
      dispatch!(clearAllMessagesAction());
      setClearedDraggingTip((prev) => (prev += 1));
    }
  }, [clearedDraggingTip]);

  const onWheelHandler = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (navigatorPlatform?.isMac) {
        const x = position.x.get() - e.deltaX;
        const y = position.y.get() - e.deltaY;

        setPosition({ x, y, immediate: true });

        updateCenterXyIfChanged(x, y);
      }
    },
    [navigatorPlatform]
  );

  const bindDrag = useDrag(
    ({ down, movement: xy, velocity, direction }) => {
      if (!down) clearDraggineTipTwice();
      direction = smoother.smooth(direction, 16) as typeof direction;
      // if mouse is up, use the momentum and direction of last several frame to send the destination further away.	      setPosition({ x: xy[0], y: xy[1] });
      xy = down ? xy : addVector(xy, scaleVector(direction, velocity * 200));
      setPosition({ x: xy[0], y: xy[1] });
      updateCenterXyIfChanged(xy[0], xy[1]);
    },
    { initial: () => [position.x.get(), position.y.get()] }
  );

  const windowSizeInCards = useMemo(
    () => getWindowSizeInCards([windowWidth, windowHeight], cardSize),
    [windowWidth, windowHeight]
  );

  const matrixEdges = useMemo(
    () => getMatrixEdges(windowSizeInCards, matrixCenterXy),
    [...matrixCenterXy, windowSizeInCards]
  );

  return (
    <>
      <div {...bindDrag()} onWheel={onWheelHandler} id="projects-canvas">
        <animated.div style={{ ...position }}>
          <CardsMatrix
            {...{
              studentsToShow,
              matrixEdges,
              cardSize,
            }}
          />
        </animated.div>
      </div>
    </>
  );
};

export default DraggableCards;
