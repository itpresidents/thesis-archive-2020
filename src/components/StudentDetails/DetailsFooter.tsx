import React from "react";
import { IStudentSummary } from "types";
import { Container, Row, Col } from "react-bootstrap";
import { CardOuter } from "components/Shared/StudentCard";
import { cardSize } from "config";
import { Random } from "images/Svg";
import { Link } from "react-router-dom";

interface IDetailsFooterProps {
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

const DetailsFooter = ({ students }: IDetailsFooterProps) => {
  return (
    <Container fluid>
      <Row>
        <Col lg={6} sm={12}>
          <h3>Randomize Next</h3>
          <RandomCard></RandomCard>
        </Col>
        <Col lg={6} sm={12}>
          <h3>Similar Projects</h3>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailsFooter;
