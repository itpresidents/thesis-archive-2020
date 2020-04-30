import React, { useEffect, useState, useContext, useMemo } from "react";
import { IStudentSummary, IStudentDetails, ICardSize } from "types";
import { Container, Row, Col } from "react-bootstrap";
import { CardOuter, CardContent } from "components/Shared/StudentCard";
import { Random } from "images/Svg";
import { Link } from "react-router-dom";
import { Context } from "util/contexts";
import ContainerDimensions from "react-container-dimensions";

import * as queries from "util/queries";
import Rolling20, { IRolling20Props } from "components/Shared/Rolling20";

const Rolling20Props: IRolling20Props = {
  heightInVh: 31.65,
  rows: 1,
  speed: 0.0,
};

const FooterGraphic = () => {
  return <Rolling20 {...Rolling20Props} />;
};

const RandomCard = ({ width, height }: { width: number; height: number }) => (
  <CardOuter width={width} height={height} className="icon-card">
    <Link to="/random" replace>
      <div className="card-bg-frame">
        <Random />
      </div>
    </Link>
  </CardOuter>
);

const MARGIN_RIGHT = 52;

const SimilarCards = ({
  student,
  students,
  cardSize,
  width,
}: {
  student: IStudentDetails;
  students: IStudentSummary[];
  cardSize: ICardSize;
  width: number;
}) => {
  const numSimilarCards = useMemo(() => {
    return Math.max(Math.floor(width / (cardSize.width + MARGIN_RIGHT)), 1);
  }, [width, cardSize]);

  const [similarCards, setSimilarCards] = useState<IStudentSummary[]>();

  useEffect(() => {
    setSimilarCards(
      queries.randomSimilarStudents(student, students, numSimilarCards)
    );
  }, [student, students, numSimilarCards]);

  const headerText =
    numSimilarCards === 1 ? "Similar Project" : "Similar Projects";

  return (
    <>
      <h3>{headerText}</h3>
      <div className="similar">
        {similarCards &&
          similarCards.map((similarCard) => (
            <CardOuter width={cardSize.width} height={cardSize.height}>
              <Link
                to={`/students/${similarCard.student_id}`}
                onClick={() => {
                  document.body.scrollTo({ top: 0 });
                }}
              >
                <CardContent student={similarCard} cardSize={cardSize} />
              </Link>
            </CardOuter>
          ))}
      </div>
    </>
  );
};

interface IDetailsFooterProps {
  student: IStudentDetails;
  students: IStudentSummary[] | undefined;
}

const DetailsFooter = ({ student, students }: IDetailsFooterProps) => {
  const { cardSize } = useContext(Context);

  return (
    <Container fluid className="details-footer">
      <Row>
        <Col lg={6} sm={12} className="section">
          <h3>Randomize Next</h3>
          <RandomCard
            width={cardSize.width}
            height={cardSize.height}
          ></RandomCard>
        </Col>
        <Col lg={6} sm={12} className="section">
          <ContainerDimensions>
            {({ width }) => (
              <>
                {students && (
                  <SimilarCards
                    student={student}
                    students={students}
                    cardSize={cardSize}
                    width={width}
                  />
                )}
              </>
            )}
          </ContainerDimensions>
        </Col>
      </Row>
      <Row>
        <FooterGraphic />
      </Row>
    </Container>
  );
};

export default DetailsFooter;
