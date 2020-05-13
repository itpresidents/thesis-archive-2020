import React, { useState, useEffect } from "react";
import { multiplyElementWise, scaleVector, IMatrixEdges } from "util/vector";
import { CardToShow, IStudentSummary, ICardSize } from "types";

import { StudentCard } from "../Shared/StudentCard";

const DEBUG = false;

const repeatCards = ({ start, end }: IMatrixEdges, cardSize: ICardSize) => {
  const cardsToShow: CardToShow[] = [];

  for (let matrixY = start.y; matrixY < end.y; matrixY++) {
    for (let matrixX = start.x; matrixX < end.x; matrixX++) {
      const offset = getOffset(
        [matrixX, matrixY],
        [cardSize.widthWithMargin, cardSize.heightWithMargin]
      );

      cardsToShow.push({
        matrixX,
        matrixY,
        offset,
      });
    }
  }

  return cardsToShow;
};

const getStudentsForCards = (
  cards: CardToShow[],
  { start, end }: IMatrixEdges,
  studentsToShow: IStudentSummary[]
): IStudentSummary[] => {
  if (!studentsToShow || studentsToShow.length === 0) return [];

  const columns = Math.floor(Math.sqrt(studentsToShow.length));

  const startPosition = start.x + start.y * columns;

  return cards.map(({ matrixX, matrixY }) => {
    const positionInGrid = matrixX - start.x + (matrixY - start.y) * columns;

    const toShow = Math.abs(
      (startPosition + positionInGrid) % studentsToShow.length
    );

    return studentsToShow[toShow];
  });
};

const getOffset = (xy: number[], cardSize: number[]): [number, number] =>
  scaleVector(multiplyElementWise(xy, cardSize), -1);

interface ICardsProps {
  studentsToShow: IStudentSummary[] | undefined;
  matrixEdges: IMatrixEdges;
  cardSize: ICardSize;
}

const CardsMatrix = React.memo(
  ({ studentsToShow, matrixEdges, cardSize }: ICardsProps) => {
    DEBUG && console.log("re-render CardsMatrix");

    const [{ cards, cardStudents }, setCardsAndStudents] = useState<{
      cards: CardToShow[];
      cardStudents: IStudentSummary[];
    }>({ cards: [], cardStudents: [] });

    useEffect(() => {
      DEBUG && console.log("calling getCardsInMatrixToShow");
      const cards = repeatCards(matrixEdges, cardSize);

      const studentsForCards = studentsToShow
        ? getStudentsForCards(cards, matrixEdges, studentsToShow)
        : [];

      setCardsAndStudents({
        cards,
        cardStudents: studentsForCards,
      });
    }, [matrixEdges, studentsToShow, cardSize]);

    return (
      <>
        {cards.map(({ matrixX, matrixY, offset }, i) => (
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
            <StudentCard student={cardStudents[i]} cardSize={cardSize} />
          </div>
        ))}
      </>
    );
  }
);

export default CardsMatrix;
