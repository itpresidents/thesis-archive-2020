import React, { useEffect, useState } from "react";

import { Container, Row, Col, Figure, Nav } from "react-bootstrap";

import * as api from "util/api";
import {
  IStudentDetails,
  IStudentSummary,
  IFeaturedImage,
  IImage,
} from "types";
import { Link, useParams } from "react-router-dom";
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
    <Container id="details" className="body1">
      <Row className={justify}>
        <Col md={12}>
          <FeaturedImage image={student.thumbnail_image} />
        </Col>
      </Row>

      <Row className={cx(justify, centerText)}>
        <Col md={MAIN_COLS_MD}>
          <h2>
            {student.title}
            <br />
            by {student.student_name}
          </h2>
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col md={MAIN_COLS_MD} className="tags">
          {student.tags.map((topic, i) => (
            <>
              <Link key={topic.slug} to={`/filter/category/${topic.slug}`}>
                {topic.name}
              </Link>
              {i !== student.tags.length - 1 && " | "}
            </>
          ))}
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col md={MAIN_COLS_MD}>
          <p
            className="summary"
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
          <div className="subtitle">Student</div> {student.student_name}
        </Col>
        <Col md={2}>
          <div className="subtitle">Portfolio</div>{" "}
          <a href="//www.example.com">www.example.com</a>
        </Col>
        <Col md={2}>
          <div className="subtitle">Advisor</div>
          <a href="//www.example.com">{student.advisor_name}</a>
        </Col>
        <Col md={2}>
          <div className="subtitle">Watch</div>
          <Link to={`/videos/${student.student_slug}`}>Watch</Link>
        </Col>
      </Row>
      <TextSection>
        <h3>Abstract</h3>
        <div dangerouslySetInnerHTML={createMarkup(student.abstract)} />
      </TextSection>
      <Row className={justify}>
        <Col md={MAIN_COLS_MD}>
          <ImageWithCaption image={student.slide_show[0]} />
        </Col>
      </Row>

      <TextSection>
        <h3>Research</h3>
        <div dangerouslySetInnerHTML={createMarkup(student.context_research)} />
        <h3>Technical Details</h3>
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
        <h3>Further Reading</h3>
        <div dangerouslySetInnerHTML={createMarkup(student.further_reading)} />
      </TextSection>
    </Container>
  );
};

interface IStudentProps {
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

interface IStudentByIdOrSlugProps {
  studentIdOrSlug?: string;
  students: IStudentSummary[] | undefined;
}

const StudentByIdOrSlug = ({ students }: IStudentByIdOrSlugProps) => {
  const { studentIdOrSlug } = useParams<{ studentIdOrSlug?: string }>();

  if (!studentIdOrSlug) return null;

  if (isNumber(studentIdOrSlug)) {
    return <Student studentId={studentIdOrSlug} />;
  }

  if (!students) return null;

  const studentId = getStudentIdFromSlug(students, studentIdOrSlug);

  return <Student studentId={studentId} />;
};

export default StudentByIdOrSlug;
