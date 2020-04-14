import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import { IStudentSummary, CardToShow } from "../types";
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
  students?: IStudentSummary[];
}

const matrixShape: number[] = [800, 800];
const smoother = new SmoothVector();

const getCardsInMatrixToShow = (
  matrixX: number,
  matrixY: number,
  prevCards: CardToShow[],
  filteredStudents: IStudentSummary[],
  width: number,
  height: number,
  dropOldCards: boolean = false
): CardToShow[] => {
  // responsive matrix
  const windowSizeInCards = [
    Math.ceil(width / cardSize[0]),
    Math.ceil(height / cardSize[1]),
  ];
  // console.log(windowSizeInCards);
  const startX = matrixX - windowSizeInCards[0];
  const endX = matrixX + 2;
  const startY = matrixY - windowSizeInCards[1];
  const endY = matrixY + 2;

  // Create a map to remember students that're in previous viewport.
  const studentsInPrevView: Record<
    number,
    Record<number, IStudentSummary>
  > = {};
  // Create a map to store updated students that will appear in new viewport.
  const studentsInNewView: Record<number, Record<number, IStudentSummary>> = {};
  // following arrays are created becars array.include() is so handy.
  // Use array to rememer ids of those cards added in studentsInNewView;
  const studentsIdsInNewView: string[] = [];

  // Use array to track studens that's not in the map studentsInNewView yet,
  let studentsNotInNewView: IStudentSummary[] = [];

  // Use array to store ids of the student pool.
  const filteredStudentsIds: string[] = filteredStudents.map(
    (student) => student.student_id
  );

  // The array to be returned
  const result: CardToShow[] = [];

  if (!dropOldCards) {
    // prepare a matrix, studentsInPrevView, to remember previous cards;
    // using their matrix XY as key to store data.
    for (let card of prevCards) {
      if (studentsInPrevView[card.matrixX] === undefined)
        studentsInPrevView[card.matrixX] = {};
      studentsInPrevView[card.matrixX][card.matrixY] = card.student;
    }

    // if a card was in the overlapping area of previous viewport and new viewport,
    // and exist in the new filtered students list.
    // add it to the new viewport.
    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        if (
          studentsInPrevView[x] !== undefined &&
          studentsInPrevView[x][y] !== undefined &&
          filteredStudentsIds.includes(studentsInPrevView[x][y].student_id)
        ) {
          if (studentsInNewView[x] === undefined) studentsInNewView[x] = {};
          studentsInNewView[x][y] = studentsInPrevView[x][y];
          // keep tracking who has been added to the new viewport.
          studentsIdsInNewView.push(studentsInPrevView[x][y].student_id);
        }
      }
    }
  }

  // findout who is in the filtered student list but not added in the new viewport yet.
  studentsNotInNewView = shuffle(
    filteredStudents.filter(
      (student) => !studentsIdsInNewView.includes(student.student_id)
    )
  );

  // if there's an empty slot in the new viewport, get a student in studentsNotInNewView and put it there.
  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      if (studentsInNewView[x] === undefined) studentsInNewView[x] = {};
      if (studentsInNewView[x][y] === undefined) {
        // if there's not enough data, just use students.
        if (studentsNotInNewView.length < 1)
          studentsNotInNewView = shuffle(filteredStudents);
        studentsInNewView[x][
          y
        ] = studentsNotInNewView.shift() as IStudentSummary;
      }
    }
  }

  // put cards to show into an array as result
  for (let x in studentsInNewView) {
    for (let y in studentsInNewView[x]) {
      result.push({
        student: studentsInNewView[x][y],
        matrixX: parseInt(x),
        matrixY: parseInt(y),
      });
    }
  }

  return result;
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

const DraggableCards = ({ students }: IDraggableCardsProps) => {
  const { windowSize } = useContext(Context);
  const [width, height] = windowSize;

  const canvasSize = multiplyElementWise(matrixShape, cardSize) as [
    number,
    number
  ];
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

  // const onBodyScroll = useCallback(() => {
  //   if (!scrollDivRef.current) return;
  //   if (
  //     scrollDivRef.current?.getBoundingClientRect().top < 180 &&
  //     !sentDraggingTip
  //   ) {
  //     setSentDraggingTip(true);
  //   }
  // }, [sentDraggingTip]);

  // document.body.addEventListener("scroll", onBodyScroll);

  // useEffect(() => {
  //   if (sentDraggingTip)
  // }, [sentDraggingTip]);

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

  useEffect(() => {
    setSpringAndMatrixCenterXY();
  }, [width, height, setSpringAndMatrixCenterXY]);

  const bind = useDrag(
    ({ down, movement: xy, velocity, direction }) => {
      if (!down) clearDraggineTipTwice();
      direction = smoother.smooth(direction, 8) as typeof direction;
      // if mouse is up, use the momentum and direction of last several frame to send the destination further away.
      xy = down ? xy : addVector(xy, scaleVector(direction, velocity * 200));
      setSpringAndMatrixCenterXY(xy, down);
    },
    {
      initial: () => [position.x.get(), position.y.get()],
    }
  );

  if (!students) return null;

  return (
    <>
      <div {...bind()} ref={scrollDivRef} id="projects-canvas">
        <animated.div style={{ ...position }}>
          {/* Since Cards are wrapped in React.memo - they will only be re-rendered when matrixXy values change */}
          <Cards
            matrixX={matrixXy[0]}
            matrixY={matrixXy[1]}
            students={students}
            width={width}
            height={height}
          />
        </animated.div>
      </div>
    </>
  );
};

interface ICardsProps {
  students: IStudentSummary[];
  matrixX: number;
  matrixY: number;
  width: number;
  height: number;
}

const DEBUG = false;

const getOffset = (xy: number[], cardSize: number[]): number[] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

const Cards = React.memo(
  ({ students, matrixX, matrixY, width, height }: ICardsProps) => {
    const [inViewPortList, setInViewportList] = useState<CardToShow[]>([]);

    const config = SpringConfig.default;
    const cardKey = (card: CardToShow): string =>
      `${card.student.student_id}_${card.matrixX}_${card.matrixY}`;

    // if set to true, the transition will not play.
    const [skilAnimation, setSkipAnimation] = useState<boolean>(false);

    const transition = useTransition(inViewPortList, {
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

    const setInViewportListCallBack = useCallback(
      (dropOldCards: boolean = false) => {
        if (!students) return;
        setInViewportList((prevState) =>
          getCardsInMatrixToShow(
            matrixX,
            matrixY,
            prevState,
            students,
            width,
            height,
            dropOldCards
          )
        );
      },
      [matrixX, matrixY, students, width, height]
    );

    useEffect(() => {
      setSkipAnimation(true);
      const dropOldCards = false;
      setInViewportListCallBack(dropOldCards);
    }, [matrixX, matrixY, width, height, setInViewportListCallBack]);

    useEffect(() => {
      setSkipAnimation(false);
      const dropOldCards = true;
      setInViewportListCallBack(dropOldCards);
    }, [students, setInViewportListCallBack]);

    if (!students) return null;

    return (
      <>
        {transition(({ dead, rotateY, ...style }, item, transition) => {
          if (dead.get() === 0) return null;
          const offsets = getOffset([item.matrixX, item.matrixY], cardSize);
          // if springImmediate == true, remove transition.
          const anim = skilAnimation
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
              <StudentCard student={item.student} />
            </animated.div>
          );
        })}
      </>
    );
  }
);

export default DraggableCards;
