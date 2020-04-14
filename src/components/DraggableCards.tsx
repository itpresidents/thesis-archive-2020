import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { CardToShow, IFilteredStudent } from "../types";
import {
  config as SpringConfig,
  useSpring,
  animated,
  useTransition,
  // to,
} from "react-spring";
import { useDrag } from "react-use-gesture";
import {
  addVector,
  SmoothVector,
  scaleVector,
  multiplyElementWise,
} from "util/vector";
import shuffle from "lodash.shuffle";
import { cardSize } from "config";
import StudentCard from "./StudentCard";
import { usePrevious } from "util/usePrevious";
import { Context } from "../util/contexts";
import { clearMessageHub } from "./MessageHub";

interface IDraggableCardsProps {
  filteredStudents: IFilteredStudent[];
}

const matrixShape: number[] = [800, 800];
const smoother = new SmoothVector();
interface IMatrixEdges {
  xStart: number;
  xEnd: number;
  yStart: number;
  yEnd: number;
}

const getMatrixEdges = (
  cardSize: number[],
  windowSize: number[],
  center: number[]
): IMatrixEdges => {
  const windowSizeInCards = [
    Math.ceil(windowSize[0] / cardSize[0]),
    Math.ceil(windowSize[1] / cardSize[1]),
  ];
  // console.log(windowSizeInCards);
  const xStart = center[0] - windowSizeInCards[0];
  const xEnd = center[0] + 2;
  const yStart = center[1] - windowSizeInCards[1];
  const yEnd = center[1] + 2;

  return { xStart, xEnd, yStart, yEnd };
};

class CardMatrix {
  data: Record<number, Record<number, number>>;
  dataArray: number[];

  constructor() {
    this.data = {};
    this.dataArray = [];
  }
  get(x: number, y: number) {
    if (this.data[x] && this.data[x][y]) return this.data[x][y];
  }
  set(x: number, y: number, student: number) {
    if (this.data[x] === undefined) this.data[x] = {};
    this.data[x][y] = student;
    this.dataArray.push(student);
  }
  getArrayOfCardToShow(): CardToShow[] {
    const result: CardToShow[] = [];
    // put cards to show into an array as result
    for (let x in this.data) {
      for (let y in this.data[x]) {
        result.push({
          studentIndex: this.get(parseInt(x), parseInt(y))!,
          matrixX: parseInt(x),
          matrixY: parseInt(y),
        });
      }
    }
    return result;
  }
  // deleteX(x: number) {
  //   delete this.data[x];
  //   return this.data;
  // }
  // deleteY(y: number) {
  //   for (let x in this.data) {
  //     delete this.data[x][y];
  //   }
  //   return this.data;
  // }
  // delete(x: number, y: number) {
  //   this.deleteX(x);
  //   this.deleteY(y);
  //   return this.data;
  // }
}

const getCardsInMatrixToShow = (
  matrixCenter: number[],
  prevCards: CardToShow[],
  filteredStudents: IFilteredStudent[],
  windowSize: number[],
  dropOldCards: boolean = false
): CardToShow[] => {
  const { xStart, xEnd, yStart, yEnd } = getMatrixEdges(
    cardSize,
    windowSize,
    matrixCenter
  );

  // following arrays are created because array.include() is so handy.
  // Use array to rememer ids of those cards added in studentsInNewView;
  const studentsIndecesInNewView: number[] = [];
  // // Use array to store ids of the student pool.
  // const filteredStudentsIds: string[] = filteredStudents.map(
  //   (student) => student.student_id
  // );

  const cardsInNewView: CardMatrix = new CardMatrix();
  //for scrolling, we will keep most old cards
  // if not adding back cards {
  if (!dropOldCards) {
    for (let card of prevCards) {
      // add card to new view if: card was in the overlapping area, and exist in the new filtered students list.
      // xStart <= card.matrixX <= xEnd
      // yStart <= card.matrixY <= yEnd
      // studentId is in the new student list
      const { matrixX: x, matrixY: y } = card;
      if (

        y >= yStart &&
        y <= yEnd &&
        x >= xStart &&
        x <= xEnd &&
        filteredStudents[card.studentIndex] &&
        filteredStudents[card.studentIndex].show
      ) {
        cardsInNewView.set(x, y, card.studentIndex);
        // keep tracking who has been added to the new viewport.
        studentsIndecesInNewView.push(card.studentIndex);
      }

    }
  }

  // findout who is in the filtered student list but not added in the new viewport yet.
  const studentsShowAndIndeces = filteredStudents.map(({ show }, index) => ({
    show,
    index,
  }));

  const studentIndecesNotYetAdded = studentsShowAndIndeces
    .filter(
      ({ show, index }) => show && !studentsIndecesInNewView.includes(index)
    )
    .map(({ index }) => index);

  let studentsToAdd: number[] = shuffle(studentIndecesNotYetAdded);

  // if there's an empty slot in the new viewport, get a student in studentsNotInNewView and add it to there.
  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      if (cardsInNewView.get(x, y) === undefined) {
        // if out of data - reset students to use all students
        if (studentsToAdd.length === 0) {
          const studentsToShow = studentsShowAndIndeces
            .filter(({ show }) => show)
            .map(({ index }) => index);
          studentsToAdd = shuffle(studentsToShow);
        }
        // if there's not enough data, reshuffle all students.
        else if (studentsToAdd.length < 5)
          // else - just shuffle them some more
          studentsToAdd = shuffle(studentsToAdd);
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

const toPositionInMatrix = ([centerX, centerY]: [number, number]): [
  number,
  number
] => {
  const [cardWidth, cardHeight] = cardSize;
  return [Math.ceil(centerX / cardWidth), Math.ceil(centerY / cardHeight)];
};

const DraggableCards = ({ filteredStudents }: IDraggableCardsProps) => {
  const { windowSize } = useContext(Context);
  const [width, height] = windowSize;

  const canvasSize = multiplyElementWise(matrixShape, cardSize) as number[];
  const [startX, startY] = scaleVector(canvasSize, 0.5);
  const [position, setSpring] = useSpring<Position>(() => ({
    x: startX,
    y: startY,
  }));

  const [matrixXy, setMatrixCenterXy] = useState<[number, number]>(
    toPositionInMatrix([startX, startY])
  );

  const prevWidth = usePrevious(width);
  const prevHeight = usePrevious(height);

  const scrollDivRef = useRef<HTMLDivElement>(null);
  const [clearedDraggingTip, setClearedDraggingTip] = useState<number>(0);
  const clearDraggineTipTwice = () => {
    if (clearedDraggingTip <= 2) {
      clearMessageHub();
      setClearedDraggingTip((prev) => (prev += 1));
    }
  };

  const setSpringAndMatrixCenterXY = useCallback(
    (xy: number[] | undefined = undefined, immediate: boolean = false) => {
      if (!xy)
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

  const bind = useDrag(
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
      <div {...bind()} ref={scrollDivRef} id="projects-canvas">
        <animated.div style={{ ...position }}>
          <CardsMatrix
            {...{
              filteredStudents,
              matrixX: matrixXy[0],
              matrixY: matrixXy[1],
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
  matrixX: number;
  matrixY: number;
  windowX: number;
  windowY: number;
}

const DEBUG = false;

const getOffset = (xy: number[], cardSize: number[]): number[] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

interface PrevValues {
  windowX: number;
  windowY: number;
  matrixX: number;
  matrixY: number;
  filteredStudents: IFilteredStudent[];
  windowSizeChanged: boolean;
  matrixXyChanged: boolean;
  filteredStudentsChanged: boolean;
}

const CardsMatrix = React.memo(
  ({ filteredStudents, matrixX, matrixY, windowX, windowY }: ICardsProps) => {
    const [prevValues, setPrevValues] = useState<PrevValues>({
      windowX,
      windowY,
      matrixX,
      matrixY,
      filteredStudents,
      windowSizeChanged: false,
      matrixXyChanged: false,
      filteredStudentsChanged: false,
    });

    useEffect(() => {
      console.log("computing");
      setPrevValues({
        windowX,
        windowY,
        matrixX,
        matrixY,
        filteredStudents,
        windowSizeChanged:
          windowX !== prevValues.windowX || windowY !== prevValues.windowY,
        matrixXyChanged:
          matrixX !== prevValues.matrixX || matrixY !== prevValues.matrixY,
        filteredStudentsChanged:
          prevValues.filteredStudents !== filteredStudents,
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredStudents, matrixX, matrixY, windowX, windowY]);

    const [inViewPortList, setInViewportList] = useState<CardToShow[]>([]);
    const dropOldCards = prevValues.filteredStudentsChanged;

    useEffect(() => {
      setInViewportList((prevState) =>
        getCardsInMatrixToShow(
          [matrixX, matrixY],
          prevState,
          filteredStudents,
          [windowX, windowY],
          dropOldCards
        )
      );
    }, [matrixX, matrixY, filteredStudents, windowX, windowY, dropOldCards]);

    const skipAnimation =
      prevValues.matrixXyChanged || prevValues.windowSizeChanged;

    return (
      <Cards
        cards={inViewPortList}
        skipAnimation={skipAnimation}
        filteredStudents={filteredStudents}
      />
    );
  }
);

const Cards = React.memo(
  ({
    cards,
    filteredStudents,
    skipAnimation,
  }: {
    cards: CardToShow[];
    filteredStudents: IFilteredStudent[];
    skipAnimation: boolean;
  }) => {
    const config = SpringConfig.default;
    const cardKey = (card: CardToShow): string =>
      `${card.studentIndex}_${card.matrixX}_${card.matrixY}`;

    // if set to true, the transition will not play.
    // const [skilAnimation, setSkipAnimation] = useState<boolean>(false);

    const transition = useTransition(cards, {
      key: (card) => cardKey(card),
      from: { opacity: 0.5, rotateY: 90, dead: 1 },
      enter: (card) => async (next, stop) => {
        if (DEBUG) console.log(`  Entering:`, cardKey(card));
        await next({ opacity: 1, rotateY: 0, config });
      },
      leave: (card) => async (next) => {
        if (DEBUG) console.log(`  Leaving:`, cardKey(card));
        await next({ opacity: 0, rotateY: -90, config });
        await next({ dead: 0, config });
      },
      trail: 10,
    });

    return (
      <>
        {transition(({ dead, rotateY, ...style }, item, transition) => {
          if (dead.get() === 0) return null;
          if (typeof item.studentIndex === "undefined") return null;
          const offsets = getOffset([item.matrixX, item.matrixY], cardSize);
          // if springImmediate == true, remove transition.
          const anim = skipAnimation
            ? {}
            : {
              // transform: to(rotateY, (a) => `rotate3d(0.6, 1, 0, ${a}deg)`),
              ...style,
            };
          return (
            <animated.div
              style={{
                position: "absolute",
                width: `${cardSize[0] * 0.75}px`,
                left: `${offsets[0]}px`,
                top: `${offsets[1]}px`,
                ...anim,
              }}
              key={cardKey(item)}
            >
              <StudentCard
                student={filteredStudents[item.studentIndex].student}
              />
            </animated.div>
          );
        })}
      </>
    );
  }
);

export default DraggableCards;
