import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { IStudentSummary } from "../types";
import { useSpring, animated, to, config, SpringValue } from "react-spring";
import { useDrag } from "react-use-gesture";
import { addVector, scaleVector, multiplyElementWise } from "../util/vector";
import Student from "../Student";
import VisibilitySensor from "react-visibility-sensor";

interface IStudentsProps extends RouteComponentProps {
  students?: IStudentSummary[];
}

const matrixShape: number[] = [800, 800];
const cardSize: number[] = [240, 360];
const windowSizeInCards = [14, 6];

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
  studentsMatrix: number[][],
  students: IStudentSummary[]
): CardToShow[] => {
  const startX = matrixX - halfWindowSizeInCards[0];
  const endX = matrixX + halfWindowSizeInCards[0];
  const startY = matrixY - halfWindowSizeInCards[1];
  const endY = matrixY + halfWindowSizeInCards[1];

  const result: CardToShow[] = [];

  for (let x = startX; x < endX; x++) {
    for (let y = startY; y < endY; y++) {
      result.push({
        student: students[studentsMatrix[x][y]],
        matrixX: x,
        matrixY: y,
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
      getCardsInMatrixToShow(matrixX, matrixY, studentsMatrix, students)
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
        <VisibilitySensor partialVisibility={true} delayedCall={true}>
          <div
            style={{
              width: `${cardSize[0] - 20}px`,
              height: `${cardSize[1] - 20}px`,
              left: `0px`,
              top: `0px`,
            }}
          ></div>
        </VisibilitySensor>
      </div>
    );
  }
);

export default DraggableCards;
