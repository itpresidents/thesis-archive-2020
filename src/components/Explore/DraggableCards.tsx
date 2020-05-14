/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { IStudentSummary, ICardSize } from "../../types";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import {
  addVector,
  SmoothVector,
  scaleVector,
  Vector,
  IMatrixEdges,
} from "util/vector";
import { usePrevious } from "util/usePrevious";
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

const toPositionInMatrix = (
  [centerX, centerY]: [number, number],
  cardSize: ICardSize
): Vector => {
  return new Vector([
    Math.ceil(centerX / cardSize.widthWithMargin),
    Math.ceil(centerY / cardSize.heightWithMargin),
  ]);
};

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
  const [position, setSpring] = useSpring<Position>(() => ({
    x: 0,
    y: 0,
  }));

  const [matrixCenterXy, setMatrixCenterXy] = useState<Vector>(
    toPositionInMatrix([0, 0], cardSize)
  );

  const prevWidth = usePrevious(windowWidth);
  const prevHeight = usePrevious(windowHeight);

  const [clearedDraggingTip, setClearedDraggingTip] = useState<number>(0);
  const clearDraggineTipTwice = useCallback(() => {
    if (clearedDraggingTip <= 2) {
      dispatch!(clearAllMessagesAction());
      setClearedDraggingTip((prev) => (prev += 1));
    }
  }, [clearedDraggingTip]);

  const setSpringAndMatrixCenterXY = useCallback(
    (xy?: number[], immediate: boolean = false) => {
      if (xy === undefined)
        xy = [
          position.x.get() + (windowWidth - prevWidth!) / 2,
          position.y.get() + (windowHeight - prevHeight!) / 2,
        ];
      setSpring({
        x: xy[0],
        y: xy[1],
        immediate,
        onChange: (xy) => {
          const matrixCenterXy = toPositionInMatrix([xy.x!, xy.y!], cardSize);
          setMatrixCenterXy(matrixCenterXy);
        },
      });
    },
    [
      windowWidth,
      windowHeight,
      position,
      setSpring,
      setMatrixCenterXy,
      prevWidth,
      prevHeight,
    ]
  );

  useEffect(setSpringAndMatrixCenterXY, [windowSize]);

  const onWheelHandler = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (navigatorPlatform?.isMac) {
        setSpringAndMatrixCenterXY(
          [position.x.get() - e.deltaX, position.y.get() - e.deltaY],
          true
        );
      }
    },
    [navigatorPlatform]
  );

  const bindDrag = useDrag(
    ({ down, movement: xy, velocity, direction }) => {
      if (!down) clearDraggineTipTwice();
      direction = smoother.smooth(direction, 8) as typeof direction;
      // if mouse is up, use the momentum and direction of last several frame to send the destination further away.
      xy = down ? xy : addVector(xy, scaleVector(direction, velocity * 200));
      setSpringAndMatrixCenterXY(xy, down);
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
