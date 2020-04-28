import React, { useEffect, useState, useContext } from "react";
import { IStudentSummary, IStudentDetails, ICardSize } from "types";
import { Container, Row, Col } from "react-bootstrap";
import { CardOuter, CardContent } from "components/Shared/StudentCard";
import { Random } from "images/Svg";
import { Link } from "react-router-dom";
import { Context } from "util/contexts";

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

const NUM_SIMILAR_STUDENTS = 3;

const SimilarCards = ({
  student,
  students,
  cardSize,
}: {
  student: IStudentDetails;
  students: IStudentSummary[];
  cardSize: ICardSize;
}) => {
  const [similarCards, setSimilarCards] = useState<IStudentSummary[]>();

  useEffect(() => {
    setSimilarCards(
      queries.randomSimilarStudents(student, students, NUM_SIMILAR_STUDENTS)
    );
  }, [student, students]);

  return (
    <Row className="similar">
      {similarCards &&
        similarCards.map((similarCard) => (
          <Col key={similarCard.student_slug} lg={4} sm={12}>
            <CardOuter width={cardSize.width} height={cardSize.height}>
              <Link to={`/students/${student.student_id}`}>
                <CardContent student={similarCard} cardSize={cardSize} />
              </Link>
            </CardOuter>
          </Col>
        ))}
    </Row>
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
          {students && (
            <>
              <h3>Similar Projects</h3>
              <SimilarCards
                student={student}
                students={students}
                cardSize={cardSize}
              />
            </>
          )}
        </Col>
      </Row>
      <Row>
        <FooterGraphic />
      </Row>
    </Container>
  );
};

export default DetailsFooter;
