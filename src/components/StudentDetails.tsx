import React, { useEffect, useState } from "react";

import { Container, Row, Col, Figure, Nav } from "react-bootstrap";

import * as api from "util/api";
import {
  IStudentDetails,
  IStudentSummary,
  IFeaturedImage,
  IImage,
} from "../types";
import { Link, RouteComponentProps } from "@reach/router";
import { getStudentIdFromSlug, isNumber } from "util/queries";
import cx from "classnames";

const createMarkup = (html: string) => ({ __html: html });

interface IStudentDetailsProps {
  student: IStudentDetails;
}

const FeaturedImage = ({ image }: { image: IFeaturedImage | undefined }) => {
  if (!image) return null;
  return (
    <img
      key={image.src}
      src={image.src}
      alt={image.alt}
      title={image.title}
    ></img>
  );
};

const justify = "justify-content-md-center";
const centerText = "text-center";
const justifyText = "text-justify";

const ImageWithCaption = ({ image }: { image: IImage | undefined }) => {
  if (!image) return null;
  return (
    <Figure>
      <Figure.Image width={"100%"} alt={image.alt} src={image.src} />
      <Figure.Caption>{image.caption}</Figure.Caption>
    </Figure>
  );
};

type EmptyProps = {};

const MAIN_COLS_MD = 8;

const TEXT_SECTION_MD = 6;

const TextSection = ({ children }: { children: React.ReactNode }) => (
  <Row className={cx(justify, justifyText)}>
    <Col md={TEXT_SECTION_MD}>{children}</Col>
  </Row>
);

const StudentDetails = ({ student }: IStudentDetailsProps) => {
  return (
    <Container>
      <Row className={justify}>
        <Col md={12}>
          <FeaturedImage image={student.thumbnail_image} />
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Nav className="justify-content-center" activeKey="/home">
          {student.tags.map((topic) => (
            <Nav.Item key={topic.slug}>
              <Link to={`/topics/${topic.slug}`} className="nav-link">
                {topic.name}
              </Link>
            </Nav.Item>
          ))}
        </Nav>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col md={MAIN_COLS_MD}>
          <h1>{student.title}</h1>
          <h1>by {student.student_name}</h1>
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col md={MAIN_COLS_MD}>
          <p
            className="lead"
            dangerouslySetInnerHTML={createMarkup(student.thesis_statement)}
          />
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col md={MAIN_COLS_MD}>
          <hr />
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col md={2}>
          <h3>Student</h3> {student.student_name}
        </Col>
        <Col md={2}>
          <h3>Portfolio</h3> <a href="//www.example.com">www.example.com</a>
        </Col>
        <Col md={2}>
          <h3>Advisor</h3>
          <a href="//www.example.com">{student.advisor_name}</a>
        </Col>
        <Col md={2}>
          <h3>Watch</h3>
          <Link to={`/videos/${student.student_slug}`}>Watch</Link>
        </Col>
      </Row>
      <TextSection>
        <h2>Abstract</h2>
        <div dangerouslySetInnerHTML={createMarkup(student.abstract)} />
      </TextSection>
      <Row className={justify}>
        <Col md={MAIN_COLS_MD}>
          <ImageWithCaption image={student.slide_show[0]} />
        </Col>
      </Row>

      <TextSection>
        <h2>Research</h2>
        <div dangerouslySetInnerHTML={createMarkup(student.context_research)} />
        <h2>Technical Details</h2>
        <div
          dangerouslySetInnerHTML={createMarkup(student.technical_details)}
        />
      </TextSection>

      <Row className={justify}>
        <Col md={MAIN_COLS_MD}>
          {student.slide_show
            .slice(1, student.slide_show.length - 2)
            .map((image) => (
              <ImageWithCaption key={image.src} image={image} />
            ))}
        </Col>
      </Row>

      <TextSection>
        <h2>Further Reading</h2>
        <div dangerouslySetInnerHTML={createMarkup(student.further_reading)} />
      </TextSection>
    </Container>
  );
};

interface IStudentProps extends RouteComponentProps {
  studentId: string;
}

const Student = ({ studentId }: IStudentProps) => {
  const [student, setProject] = useState<IStudentDetails>();

  useEffect(() => {
    async function fetchStudent() {
      const student = await api.getStudent(studentId);
      setProject(student);
    }
    fetchStudent();
  }, [studentId]);

  if (!student) return <div>Loading...</div>;

  return <StudentDetails student={student} />;
};

interface IStudentByIdOrSlugProps extends RouteComponentProps {
  studentIdOrSlug?: string;
  students: IStudentSummary[] | undefined;
}

const StudentByIdOrSlug = ({
  studentIdOrSlug,
  students,
}: IStudentByIdOrSlugProps) => {
  if (!studentIdOrSlug) return null;

  if (isNumber(studentIdOrSlug)) {
    return <Student studentId={studentIdOrSlug} />;
  }

  if (!students) return null;

  const studentId = getStudentIdFromSlug(students, studentIdOrSlug);

  return <Student studentId={studentId} />;
};

export default StudentByIdOrSlug;