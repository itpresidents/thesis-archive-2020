import React, { useState, useEffect } from "react";
import {
  Vector,
  multiplyElementWise,
  scaleVector,
  IMatrixEdges,
} from "util/vector";
import { IFilteredStudent, CardToShow, IStudentSummary } from "types";
import shuffle from "lodash.shuffle";
import { DEBUG, cardSize } from "config";

import { StudentCardWithTransition } from "./StudentCard";

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

const filterStudentsAndIndeces = (
  filteredStudents: IFilteredStudent[]
): { index: number; student: IStudentSummary }[] => {
  return filteredStudents
    .map(({ show, student }, index) => ({
      student,
      show,
      index,
    }))
    .filter(({ show }) => show);
};

const repeatCards = (
  { start, end }: IMatrixEdges,
  filteredStudents: IFilteredStudent[]
) => {
  const filteredStudentsAndIndeces = filterStudentsAndIndeces(filteredStudents);
  const [width, _] = end.add(start.scale(-1));

  const numberToShow = filteredStudentsAndIndeces.length;

  if (numberToShow === 0) return [];

  const cardsToShow: CardToShow[] = [];

  const startPosition = start.x + start.y * width;

  for (let matrixY = start.y; matrixY < end.y; matrixY++) {
    for (let matrixX = start.x; matrixX < end.x; matrixX++) {
      const positionInGrid = matrixX - start.x + (matrixY - start.y) * width;

      const toShow = Math.abs((startPosition + positionInGrid) % numberToShow);

      const filteredStudentToShow = filteredStudentsAndIndeces[toShow];

      cardsToShow.push({
        matrixX,
        matrixY,
        studentIndex: filteredStudentToShow.index,
      });
    }
  }

  return cardsToShow;
};

const getCardsInMatrixToShow = (
  { start, end }: IMatrixEdges,
  prevCards: CardToShow[],
  filteredStudents: IFilteredStudent[],
  dropOldCards: boolean = false
): CardToShow[] => {
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

const getOffset = (xy: number[], cardSize: number[]): number[] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

interface PrevValues {
  matrixEdges: IMatrixEdges;
  filteredStudents: IFilteredStudent[];
  matrixEdgesChanged: boolean;
  filteredStudentsChanged: boolean;
}

interface ICardsProps {
  filteredStudents: IFilteredStudent[];
  matrixEdges: IMatrixEdges;
}

const matrixChanged = (a: IMatrixEdges, b: IMatrixEdges): boolean => {
  const isSame = a.start.isEqual(b.start) && a.end.isEqual(b.end);

  return !isSame;
};

const CardsMatrix = React.memo(
  ({ filteredStudents, matrixEdges }: ICardsProps) => {
    DEBUG && console.log("re-render CardsMatrix");

    const [prevValues, setPrevValues] = useState<PrevValues>({
      matrixEdges,
      filteredStudents,
      matrixEdgesChanged: false,
      filteredStudentsChanged: false,
    });

    useEffect(() => {
      DEBUG && console.log("computing");
      setPrevValues({
        filteredStudents,
        matrixEdges,
        matrixEdgesChanged: matrixChanged(matrixEdges, prevValues.matrixEdges),
        filteredStudentsChanged:
          prevValues.filteredStudents !== filteredStudents,
      });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredStudents, matrixEdges]);

    const [inViewPortList, setInViewportList] = useState<CardToShow[]>([]);
    const dropOldCards = prevValues.filteredStudentsChanged;

    useEffect(() => {
      DEBUG && console.log("calling getCardsInMatrixToShow");
      setInViewportList((prevState) =>
        getCardsInMatrixToShow(
          matrixEdges,
          prevState,
          filteredStudents,
          dropOldCards
        )
      );
    }, [matrixEdges, filteredStudents, dropOldCards]);

    const skipAnimation = prevValues.matrixEdgesChanged;

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

export default CardsMatrix;
