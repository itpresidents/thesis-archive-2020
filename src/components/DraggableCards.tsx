import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { IFilteredStudent } from "../types";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import { addVector, SmoothVector, scaleVector, Vector } from "util/vector";
import { cardSize } from "config";
import { usePrevious } from "util/usePrevious";
import { Context } from "../util/contexts";
import { clearMessageHub } from "./MessageHub";
import CardsMatrix from "./CardsMatrix";

interface IDraggableCardsProps {
  filteredStudents: IFilteredStudent[];
}

const smoother = new SmoothVector();

interface Position {
  x: number;
  y: number;
}

const toPositionInMatrix = ([centerX, centerY]: [number, number]): Vector => {
  const [cardWidth, cardHeight] = cardSize;
  return new Vector([
    Math.ceil(centerX / cardWidth),
    Math.ceil(centerY / cardHeight),
  ]);
};

const DraggableCards = ({ filteredStudents }: IDraggableCardsProps) => {
  const { windowSize, navigatorPlatform } = useContext(Context);
  const [width, height] = windowSize;
  const [position, setSpring] = useSpring<Position>(() => ({
    x: 0,
    y: 0,
  }));

  const [matrixCenter, setMatrixCenterXy] = useState<Vector>(
    toPositionInMatrix([0, 0])
  );

  const prevWidth = usePrevious(width);
  const prevHeight = usePrevious(height);

  const [clearedDraggingTip, setClearedDraggingTip] = useState<number>(0);
  const clearDraggineTipTwice = () => {
    if (clearedDraggingTip <= 2) {
      clearMessageHub();
      setClearedDraggingTip((prev) => (prev += 1));
    }
  };

  const setSpringAndMatrixCenterXY = useCallback(
    (xy?: number[], immediate: boolean = false) => {
      if (xy === undefined)
        xy = [
          position.x.get() + (width - prevWidth!) / 2,
          position.y.get() + (height - prevHeight!) / 2,
        ];
      setSpring({
        x: xy[0],
        y: xy[1],
        immediate,
        onChange: (xy) => {
          setMatrixCenterXy(toPositionInMatrix([xy.x!, xy.y!]));
        },
      });
    },
    [
      width,
      height,
      position,
      setSpring,
      setMatrixCenterXy,
      prevWidth,
      prevHeight,
    ]
  );

  useEffect(setSpringAndMatrixCenterXY, [windowSize]);

  const scrollDivRef = useRef<HTMLDivElement>(null);
  const onWheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (navigatorPlatform?.isMac) {
      setSpringAndMatrixCenterXY(
        [position.x.get() - e.deltaX, position.y.get() - e.deltaY],
        true
      );
    }
  };

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

  if (!filteredStudents) return null;

  return (
    <>
      <div
        {...bindDrag()}
        ref={scrollDivRef}
        onWheel={onWheelHandler}
        id="projects-canvas"
      >
        <animated.div style={{ ...position }}>
          <CardsMatrix
            {...{
              filteredStudents,
              matrixCenter: matrixCenter,
              windowX: windowSize[0],
              windowY: windowSize[1],
            }}
          />
        </animated.div>
      </div>
    </>
  );
};

export default DraggableCards;
