import React, { useEffect, useState } from "react";
import { IStudentSummary, CardToShow } from "../types";
import { useSpring, animated } from "react-spring";
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

interface IDraggableCardsProps {
  students?: IStudentSummary[];
  width: number;
  height: number;
}

const matrixShape: number[] = [800, 800];
const smoother = new SmoothVector();

const getCardsInMatrixToShow = (
  matrixX: number,
  matrixY: number,
  prevCards: CardToShow[],
  students: IStudentSummary[],
  width: number,
  height: number
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
  const studentsInPrevView: Record<
    number,
    Record<number, IStudentSummary>
  > = {};
  const studentsInNewView: Record<number, Record<number, IStudentSummary>> = {};
  const studentsIdsInNewView: string[] = [];
  let studentsNotInNewView: IStudentSummary[] = [];
  const result: CardToShow[] = [];

  // prepare a matrix to remember previous cards;
  for (let card of prevCards) {
    if (studentsInPrevView[card.matrixX] === undefined)
      studentsInPrevView[card.matrixX] = {};
    studentsInPrevView[card.matrixX][card.matrixY] = card.student;
  }

  //add previous existed cards to a matrix;
  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      if (
        studentsInPrevView[x] !== undefined &&
        studentsInPrevView[x][y] !== undefined
      ) {
        if (studentsInNewView[x] === undefined) studentsInNewView[x] = {};
        studentsInNewView[x][y] = studentsInPrevView[x][y];
        studentsIdsInNewView.push(studentsInPrevView[x][y].student_id);
      }
    }
  }

  for (let student of students) {
    if (!studentsIdsInNewView.includes(student.student_id))
      studentsNotInNewView.push(student);
  }
  studentsNotInNewView = shuffle(studentsNotInNewView);

  // add new card
  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      if (studentsInNewView[x] === undefined) studentsInNewView[x] = {};
      if (studentsInNewView[x][y] === undefined) {
        // if there's not enough data, just use students.
        if (studentsNotInNewView.length < 1)
          studentsNotInNewView = shuffle(students);
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

const DraggableCards = ({ students, width, height }: IDraggableCardsProps) => {
  const windowSize = multiplyElementWise(matrixShape, cardSize) as [
    number,
    number
  ];
  const [startX, startY] = scaleVector(windowSize, 0.5);
  const [position, setSpring] = useSpring<Position>(() => ({
    x: startX,
    y: startY,
  }));

  const [matrixXy, setMatrixCenterXy] = useState<[number, number]>(
    toPositionInMatrix([startX, startY])
  );

  const prevWidth = usePrevious(width);
  const prevHeight = usePrevious(height);

  useEffect(() => {
    const xy = [
      position.x.getValue() + (width - prevWidth!) / 2,
      position.y.getValue() + (height - prevHeight!) / 2,
    ];
    setSpring({
      x: xy[0],
      y: xy[1],
      onFrame: (xy) => {
        setMatrixCenterXy(toPositionInMatrix([xy.x, xy.y]));
      },
    });
  }, [width, height]);

  const bind = useDrag(
    ({ down, movement: xy, velocity, direction }) => {
      //smooth the direction
      direction = smoother.smooth(direction, 8) as typeof direction;
      // if mouse is up, use the momentum and direction of last several frame to send the destination further away.
      xy = down ? xy : addVector(xy, scaleVector(direction, velocity * 200));
      setSpring({
        x: xy[0],
        y: xy[1],
        immediate: down,
        config: {
          velocity: scaleVector(direction, velocity * 1000),
          decay: false,
        },
        onFrame: (xy) => {
          setMatrixCenterXy(toPositionInMatrix([xy.x, xy.y]));
        },
      });
    },
    {
      initial: () => [position.x.getValue(), position.y.getValue()],
    }
  );

  if (!students) return null;

  return (
    <>
      <div
        {...bind()}
        className="position-relative vw-100 vh-100 overflow-hidden"
      >
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
  width: IDraggableCardsProps["width"];
  height: IDraggableCardsProps["height"];
}

const Cards = React.memo(
  ({ students, matrixX, matrixY, width, height }: ICardsProps) => {
    const [inViewPortList, setInViewportList] = useState<CardToShow[]>([]);
    useEffect(() => {
      if (!students) return;
      setInViewportList((prevState) =>
        getCardsInMatrixToShow(
          matrixX,
          matrixY,
          prevState,
          students,
          width,
          height
        )
      );
    }, [matrixX, matrixY, students, width, height]);

    if (!students) return null;

    return (
      <>
        {inViewPortList.map(({ student, matrixX: x, matrixY: y }) => {
          /* Since Each Student Card is wrapped in React.memo - it will only be re-rendered when matrixXy values change */
          return (
            <StudentCard
              key={`${student.student_id}_${x}_${y}`}
              student={student}
              matrixX={x}
              matrixY={y}
            />
          );
        })}
      </>
    );
  }
);

export default DraggableCards;
