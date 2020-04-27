import React, { useEffect, useState } from "react";
import { IStudentSummary, IStudentDetails } from "types";
import { Container, Row, Col } from "react-bootstrap";
import { CardOuter, CardContent } from "components/Shared/StudentCard";
import { cardSize } from "config";
import { Random } from "images/Svg";
import { Link } from "react-router-dom";

import * as queries from "util/queries";

interface IDetailsFooterProps {
  student: IStudentDetails;
  students: IStudentSummary[] | undefined;
}
const width = cardSize[0] * 0.75;
const height = cardSize[0] * 1.1;

const RandomCard = () => (
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
}: {
  student: IStudentDetails;
  students: IStudentSummary[];
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
            <CardOuter width={width} height={height}>
              <Link to={`/students/${student.student_id}`}>
                <CardContent student={similarCard} />
              </Link>
            </CardOuter>
          </Col>
        ))}
    </Row>
  );
};

const DetailsFooter = ({ student, students }: IDetailsFooterProps) => {
  return (
    <Container fluid className="details-footer">
      <Row>
        <Col lg={6} sm={12} className="section">
          <h3>Randomize Next</h3>
          <RandomCard></RandomCard>
        </Col>
        <Col lg={6} sm={12} className="section">
          {students && (
            <>
              <h3>Similar Projects</h3>
              <SimilarCards student={student} students={students} />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DetailsFooter;
