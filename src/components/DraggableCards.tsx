import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { IStudentSummary } from "../types";
import { useSpring, animated, to, config, SpringValue } from "react-spring";
import { useDrag } from "react-use-gesture";
import {
  addVector,
  SmoothVector,
  scaleVector,
  multiplyElementWise,
} from "util/vector";
import { shuffle } from "lodash-es";
import Student from "./Student";

interface IStudentsProps extends RouteComponentProps {
  students?: IStudentSummary[];
}

const matrixShape: number[] = [800, 800];

// responsive card size
const isLandscape: boolean = window.innerWidth >= window.innerHeight;
const cardWidth: number = isLandscape
  ? window.innerWidth / 6
  : window.innerHeight / 4;
const cardHeight: number = cardWidth * 1.5;
const cardSize: number[] = [cardWidth, cardHeight];

// responsive matrix
const windowSizeInCards = [
  (Math.ceil(window.innerWidth / (cardSize[0] * 2)) + 4) * 2,
  (Math.ceil(window.innerHeight / (cardSize[1] * 2)) + 1) * 2,
];
console.log(windowSizeInCards);
const smoother = new SmoothVector();

const initializeMatrix = (
  students: IStudentSummary[] | undefined
): number[][] => {
  const r: number[][] = [];
  if (students) {
    for (let i = 0; i < matrixShape[0]; i++) {
      r.push(
        Array.from({ length: matrixShape[1] }, () =>
          Math.floor(Math.random() * students!.length)
        )
      );
    }
  }
  return r;
};

interface ICardsProps {
  students: IStudentSummary[];
  matrixX: number;
  matrixY: number;
}

interface CardToShow {
  student: IStudentSummary;
  matrixX: number;
  matrixY: number;
}

const halfWindowSizeInCards = scaleVector(windowSizeInCards, 0.5) as [
  number,
  number
];

const getCardsInMatrixToShow = (
  matrixX: number,
  matrixY: number,
  prevCards: CardToShow[],
  students: IStudentSummary[]
): CardToShow[] => {
  const startX = matrixX - halfWindowSizeInCards[0];
  const endX = matrixX + halfWindowSizeInCards[0];
  const startY = matrixY - halfWindowSizeInCards[1];
  const endY = matrixY + halfWindowSizeInCards[1];
  let studentsInPrevView: Record<number, Record<number, IStudentSummary>> = {};
  let studentsInNewView: Record<number, Record<number, IStudentSummary>> = {};
  let studentsIdsInNewView: string[] = [];
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

const Cards = React.memo(({ students, matrixX, matrixY }: ICardsProps) => {
  const [studentsMatrix, setStudentMatrix] = useState<number[][]>();

  const [inViewPortList, setInViewportList] = useState<CardToShow[]>([]);

  useEffect(() => {
    if (!studentsMatrix) return;
    setInViewportList(
      getCardsInMatrixToShow(matrixX, matrixY, inViewPortList, students)
    );
  }, [matrixX, matrixY, studentsMatrix, students]);

  useEffect(() => {
    setStudentMatrix(initializeMatrix(students));
  }, [students]);

  if (!studentsMatrix) return null;

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
});

const toPositionInMatrix = ([centerX, centerY]: [number, number]): [
  number,
  number
] => {
  const [cardWidth, cardHeight] = cardSize;
  return [Math.floor(centerX / cardWidth), Math.floor(centerY / cardHeight)];
};

interface Position {
  x: number;
  y: number;
}

const DraggableCards = ({ students }: IStudentsProps) => {
  const windowSize = multiplyElementWise(matrixShape, cardSize) as [
    number,
    number
  ];
  const [startX, startY] = scaleVector(windowSize, 0.5);

  const [position, set] = useSpring<Position>(() => ({ x: startX, y: startY }));

  const [matrixXy, setMatrixCenterXy] = useState<[number, number]>(
    toPositionInMatrix([startX, startY])
  );

  const bind = useDrag(
    ({ down, movement: xy, velocity, direction }) => {
      //smooth the direction
      direction = smoother.smooth(direction, 8) as typeof direction;
      // if mouse is up, use the momentum and direction of last several frame to send the destination further away.
      xy = down ? xy : addVector(xy, scaleVector(direction, velocity * 200));
      set({
        x: xy[0],
        y: xy[1],
        config: {
          velocity: scaleVector(direction, velocity * 1000),
          decay: false,
        },
      });

      setMatrixCenterXy(toPositionInMatrix(xy as [number, number]));
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
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <animated.div
          style={{
            position: "absolute",
            width: windowSize[0],
            height: windowSize[1],
            ...position,
          }}
        >
          {/* Since Cards are wrapped in React.memo - they will only be re-rendered when matrixXy values change */}
          <Cards
            matrixX={matrixXy[0]}
            matrixY={matrixXy[1]}
            students={students}
          />
        </animated.div>
      </div>
    </>
  );
};

const getOffset = (xy: number[], cardSize: number[]): number[] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

interface IStudentCardProps {
  student: IStudentSummary;
  matrixX: number;
  matrixY: number;
}

const StudentCard = React.memo(
  ({ student, matrixX: x, matrixY: y }: IStudentCardProps) => {
    const offsets = getOffset([x, y], cardSize);
    return (
      <div
        className="student-card shadow"
        style={{
          position: "absolute",
          width: `${cardSize[0] - 20}px`,
          height: `${cardSize[1] - 20}px`,
          left: `${offsets[0]}px`,
          top: `${offsets[1]}px`,
          backgroundImage: `url(${student.portfolio_icon.src})`,
        }}
      >
        <div
          style={{
            width: `${cardSize[0] - 20}px`,
            height: `${cardSize[1] - 20}px`,
            left: `0px`,
            top: `0px`,
          }}
        ></div>
      </div>
    );
  }
);

export default DraggableCards;
