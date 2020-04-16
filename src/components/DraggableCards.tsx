import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { CardToShow, IFilteredStudent } from "../types";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import {
  addVector,
  SmoothVector,
  scaleVector,
  multiplyElementWise,
  Vector,
} from "util/vector";
import shuffle from "lodash.shuffle";
import { cardSize, DEBUG } from "config";
import { StudentCardWithTransition } from "./StudentCard";
import { usePrevious } from "util/usePrevious";
import { Context } from "../util/contexts";
import { clearMessageHub } from "./MessageHub";

interface IDraggableCardsProps {
  filteredStudents: IFilteredStudent[];
}

const smoother = new SmoothVector();
interface IMatrixEdges {
  start: Vector;
  end: Vector;
}

const getMatrixEdges = (
  cardSize: Vector,
  windowSize: Vector | number[],
  center: Vector
): IMatrixEdges => {
  const windowSizeInCards = new Vector([
    Math.ceil(windowSize[0] / cardSize[0]),
    Math.ceil(windowSize[1] / cardSize[1]),
  ]);

  const bleed = new Vector([2, 2]);
  const start = new Vector(center);
  start.add(new Vector(windowSizeInCards).scale(-1));
  const end = new Vector(center);
  end.add(bleed);

  return { start, end };
};

class CardMatrix {
  [key: number]: Record<number, number>;
  cardIndices: Record<number, Vector>;
  constructor() {
    this.cardIndices = {};
  }
  get(x: number, y: number) {
    if (this[x] !== undefined && this[x][y] !== undefined) return this[x][y];
  }
  set(x: number, y: number, student: number) {
    if (this[x] === undefined) this[x] = {};
    this[x][y] = student;
    this.cardIndices[student] = new Vector([x, y]);
  }
  hasStudent(id: number) {
    if (this.cardIndices[id] !== undefined) return true;
    return false;
  }
  getArrayOfCardToShow(): CardToShow[] {
    const result: CardToShow[] = [];
    // put cards to show into an array as result
    for (let x in this) {
      for (let y in this[x]) {
        result.push({
          studentIndex: this.get(parseInt(x), parseInt(y))!,
          matrixX: parseInt(x),
          matrixY: parseInt(y),
        });
      }
    }
    return result;
  }
}

const getCardsInMatrixToShow = (
  matrixCenter: Vector,
  prevCards: CardToShow[],
  filteredStudents: IFilteredStudent[],
  windowSize: number[] | Vector,
  dropOldCards: boolean = false
): CardToShow[] => {
  const { start, end } = getMatrixEdges(cardSize, windowSize, matrixCenter);
  const cardsInNewView: CardMatrix = new CardMatrix();
  //for scrolling, we will keep most old cards
  if (!dropOldCards) {
    for (let card of prevCards) {
      // add card to new view if: card was in the overlapping area, and exist in the new filtered students list.
      // xStart <= card.matrixX <= xEnd
      // yStart <= card.matrixY <= yEnd
      // studentId is in the new student list
      const { matrixX: x, matrixY: y } = card;
      if (
        y >= start.y &&
        y <= end.y &&
        x >= start.x &&
        x <= end.x &&
        filteredStudents[card.studentIndex] &&
        filteredStudents[card.studentIndex].show
      ) {
        cardsInNewView.set(x, y, card.studentIndex);
      }
    }
  }

  // findout who is in the filtered student list but not added in the new viewport yet.
  const studentsShowAndIndeces = filteredStudents.map(({ show }, index) => ({
    show,
    index,
  }));

  const studentIndecesNotYetAdded = studentsShowAndIndeces
    .filter(({ show, index }) => show && !cardsInNewView.hasStudent(index))
    .map(({ index }) => index);

  let studentsToAdd: number[] = shuffle(studentIndecesNotYetAdded);

  // if there's an empty slot in the new viewport, get a student in studentsNotInNewView and add it to there.
  for (let x = start.x; x < end.x; x++) {
    for (let y = start.y; y < end.y; y++) {
      if (cardsInNewView.get(x, y) === undefined) {
        // if out of data - reset students to use all students
        if (studentsToAdd.length === 0) {
          const studentsToShow = studentsShowAndIndeces
            .filter(({ show }) => show)
            .map(({ index }) => index);
          studentsToAdd = shuffle(studentsToShow);
        }
        // else if (studentsToAdd.length < 5)
        //   // else - just shuffle them some more
        //   studentsToAdd = shuffle(studentsToAdd);
        cardsInNewView.set(x, y, studentsToAdd.shift()!);
      }
    }
  }

  return cardsInNewView.getArrayOfCardToShow();
};

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

interface ICardsProps {
  filteredStudents: IFilteredStudent[];
  matrixCenter: Vector;
  windowX: number;
  windowY: number;
}

const getOffset = (xy: number[], cardSize: number[]): number[] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

interface PrevValues {
  windowX: number;
  windowY: number;
  matrixCenter: Vector;
  filteredStudents: IFilteredStudent[];
  windowSizeChanged: boolean;
  matrixXyChanged: boolean;
  filteredStudentsChanged: boolean;
}

const CardsMatrix = React.memo(
  ({ filteredStudents, matrixCenter, windowX, windowY }: ICardsProps) => {
    DEBUG && console.log("re-render CardsMatrix");
    const [prevValues, setPrevValues] = useState<PrevValues>({
      windowX,
      windowY,
      matrixCenter,
      filteredStudents,
      windowSizeChanged: false,
      matrixXyChanged: false,
      filteredStudentsChanged: false,
    });

    useEffect(() => {
      DEBUG && console.log("computing");
      setPrevValues({
        windowX,
        windowY,
        matrixCenter,
        filteredStudents,
        windowSizeChanged:
          windowX !== prevValues.windowX || windowY !== prevValues.windowY,
        matrixXyChanged: !matrixCenter.isEqual(prevValues.matrixCenter),
        filteredStudentsChanged:
          prevValues.filteredStudents !== filteredStudents,
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredStudents, matrixCenter, windowX, windowY]);

    const [inViewPortList, setInViewportList] = useState<CardToShow[]>([]);
    const dropOldCards = prevValues.filteredStudentsChanged;

    useEffect(() => {
      DEBUG && console.log("calling getCardsInMatrixToShow");
      setInViewportList((prevState) =>
        getCardsInMatrixToShow(
          matrixCenter,
          prevState,
          filteredStudents,
          [windowX, windowY],
          dropOldCards
        )
      );
    }, [matrixCenter, filteredStudents, windowX, windowY, dropOldCards]);

    const skipAnimation =
      prevValues.matrixXyChanged || prevValues.windowSizeChanged;

    return (
      <>
        {inViewPortList.map((item) => {
          if (item.studentIndex === undefined) return null;
          if (filteredStudents[item.studentIndex] === undefined) return null;
          const offsets = getOffset([item.matrixX, item.matrixY], cardSize);
          return (
            <StudentCardWithTransition
              x={offsets[0]}
              y={offsets[1]}
              key={`${item.matrixX}_${item.matrixY}`}
              skipAnimation={skipAnimation}
              student={filteredStudents[item.studentIndex].student}
            />
          );
        })}
      </>
    );
  }
);

export default DraggableCards;
