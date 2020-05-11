import React, { useState, useEffect, useMemo } from "react";
import { multiplyElementWise, scaleVector, IMatrixEdges } from "util/vector";
import { CardToShow, IStudentSummary, ICardSize } from "types";

import { StudentCard } from "../Shared/StudentCard";

const DEBUG = false;

const repeatCards = (
  { start, end }: IMatrixEdges,
  studentsToShow: IStudentSummary[],
  cardSize: ICardSize
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

      const offset = getOffset(
        [matrixX, matrixY],
        [cardSize.widthWithMargin, cardSize.heightWithMargin]
      );

      cardsToShow.push({
        matrixX,
        matrixY,
        student: studentsToShow[toShow],
        offset,
      });
    }
  }

  return cardsToShow;
};

const getOffset = (xy: number[], cardSize: number[]): [number, number] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

interface ICardsProps {
  studentsToShow: IStudentSummary[];
  matrixEdges: IMatrixEdges;
  cardSize: ICardSize;
}

const CardsMatrix = React.memo(
  ({ studentsToShow, matrixEdges, cardSize }: ICardsProps) => {
    DEBUG && console.log("re-render CardsMatrix");

    const [cardsToShow, setCardsToShow] = useState<CardToShow[] | null>(null);

    useEffect(() => {
      DEBUG && console.log("calling getCardsInMatrixToShow");
      setCardsToShow(repeatCards(matrixEdges, studentsToShow, cardSize));
    }, [matrixEdges, studentsToShow, cardSize]);

    if (!cardsToShow) return null;

    return (
      <>
        {cardsToShow.map(({ matrixX, matrixY, student, offset }) => (
          <div
            key={`${matrixX}_${matrixY}`}
            style={{
              position: "absolute",
              width: cardSize.width,
              height: cardSize.height,
              left: offset[0],
              top: offset[1],
            }}
          >
            <StudentCard student={student} cardSize={cardSize} />
          </div>
        ))}
      </>
    );
  }
);

export default CardsMatrix;
