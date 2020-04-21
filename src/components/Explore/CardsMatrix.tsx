import React, { useState, useEffect } from "react";
import {
  Vector,
  multiplyElementWise,
  scaleVector,
  IMatrixEdges,
} from "util/vector";
import { CardToShow, IStudentSummary } from "types";
import { DEBUG, cardSize } from "config";

import { StudentCardWithTransition } from "../Shared/StudentCard";

class CardMatrix {
  [key: number]: Record<number, IStudentSummary>;
  cardIndices: Record<string, Vector>;
  constructor() {
    this.cardIndices = {};
  }
  get(x: number, y: number) {
    if (this[x] !== undefined && this[x][y] !== undefined) return this[x][y];
  }
  set(x: number, y: number, student: IStudentSummary) {
    if (this[x] === undefined) this[x] = {};
    this[x][y] = student;
    this.cardIndices[student.student_id] = new Vector([x, y]);
  }
  hasStudent(id: string) {
    if (this.cardIndices[id] !== undefined) return true;
    return false;
  }
  getArrayOfCardToShow(): CardToShow[] {
    const result: CardToShow[] = [];
    // put cards to show into an array as result
    for (let x in this) {
      for (let y in this[x]) {
        result.push({
          student: this.get(parseInt(x), parseInt(y))!,
          matrixX: parseInt(x),
          matrixY: parseInt(y),
        });
      }
    }
    return result;
  }
}

const repeatCards = (
  { start, end }: IMatrixEdges,
  studentsToShow: IStudentSummary[]
) => {
  const [columns] = end.add(start.scale(-1));

  const numberToShow = studentsToShow.length;

  if (numberToShow === 0) return [];

  const cardsToShow: CardToShow[] = [];

  const startPosition = start.x + start.y * columns;

  for (let matrixY = start.y; matrixY < end.y; matrixY++) {
    for (let matrixX = start.x; matrixX < end.x; matrixX++) {
      const positionInGrid = matrixX - start.x + (matrixY - start.y) * columns;

      const toShow = Math.abs((startPosition + positionInGrid) % numberToShow);

      cardsToShow.push({
        matrixX,
        matrixY,
        student: studentsToShow[toShow],
      });
    }
  }

  return cardsToShow;
};

const getOffset = (xy: number[], cardSize: number[]): number[] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

interface PrevValues {
  matrixEdges: IMatrixEdges;
  studentsToShow: IStudentSummary[];
  matrixEdgesChanged: boolean;
  studentsToShowChanged: boolean;
}

interface ICardsProps {
  studentsToShow: IStudentSummary[];
  matrixEdges: IMatrixEdges;
}

const matrixChanged = (a: IMatrixEdges, b: IMatrixEdges): boolean => {
  const isSame = a.start.isEqual(b.start) && a.end.isEqual(b.end);

  return !isSame;
};

const CardsMatrix = React.memo(
  ({ studentsToShow, matrixEdges }: ICardsProps) => {
    DEBUG && console.log("re-render CardsMatrix");

    const [prevValues, setPrevValues] = useState<PrevValues>({
      matrixEdges,
      studentsToShow,
      matrixEdgesChanged: false,
      studentsToShowChanged: false,
    });

    useEffect(() => {
      setPrevValues({
        studentsToShow,
        matrixEdges,
        matrixEdgesChanged: matrixChanged(matrixEdges, prevValues.matrixEdges),
        studentsToShowChanged: prevValues.studentsToShow !== studentsToShow,
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentsToShow, matrixEdges]);

    const [inViewPortList, setInViewportList] = useState<CardToShow[]>([]);

    useEffect(() => {
      DEBUG && console.log("calling getCardsInMatrixToShow");
      setInViewportList(repeatCards(matrixEdges, studentsToShow));
    }, [matrixEdges, studentsToShow]);

    const skipAnimation = prevValues.matrixEdgesChanged;

    return (
      <>
        {inViewPortList.map((item) => {
          if (item.student === undefined) return null;
          const offsets = getOffset([item.matrixX, item.matrixY], cardSize);
          return (
            <StudentCardWithTransition
              x={offsets[0]}
              y={offsets[1]}
              key={`${item.matrixX}_${item.matrixY}`}
              skipAnimation={skipAnimation}
              student={item.student}
            />
          );
        })}
      </>
    );
  }
);

export default CardsMatrix;