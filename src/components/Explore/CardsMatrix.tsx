import React, { useState, useEffect } from "react";
import { multiplyElementWise, scaleVector, IMatrixEdges } from "util/vector";
import { CardToShow, IStudentSummary, ICardSize } from "types";

import { StudentCard } from "../Shared/StudentCard";

const DEBUG = false;

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

const matrixChanged = (a: IMatrixEdges, b: IMatrixEdges): boolean => {
  const isSame = a.start.isEqual(b.start) && a.end.isEqual(b.end);

  return !isSame;
};

interface ICardsProps {
  studentsToShow: IStudentSummary[];
  matrixEdges: IMatrixEdges;
  cardSize: ICardSize;
}

const CardsMatrix = React.memo(
  ({ studentsToShow, matrixEdges, cardSize }: ICardsProps) => {
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
          const offsets = getOffset(
            [item.matrixX, item.matrixY],
            [cardSize.widthWithMargin, cardSize.heightWithMargin]
          );
          return (
            <div
              key={`${item.matrixX}_${item.matrixY}`}
              style={{
                position: "absolute",
                width: cardSize.width,
                height: cardSize.height,
                left: `${offsets[0]}px`,
                top: `${offsets[1]}px`,
              }}
            >
              <StudentCard student={item.student} cardSize={cardSize} />
            </div>
          );
        })}
      </>
    );
  }
);

export default CardsMatrix;
