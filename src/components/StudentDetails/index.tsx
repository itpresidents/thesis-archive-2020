import React, { useEffect, useState } from "react";

import { Container, Row, Col, Figure } from "react-bootstrap";
import { useSpring, animated as a } from "react-spring";

import * as api from "util/api";
import {
  IStudentDetails,
  IStudentSummary,
  IFeaturedImage,
  IImage,
} from "types";
import { Link, useParams } from "react-router-dom";
import { getStudentIdFromSlug, isNumber, toLowerSnakeCase } from "util/queries";
import cx from "classnames";

import { Chevron, VideoSign } from "images/Svg";

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
      className="img-fluid"
      style={{ width: "100%" }}
    ></img>
  );
};

const justify = "justify-content-md-center";
const centerText = "text-center";

const ImageWithCaption = ({ image }: { image: IImage | undefined }) => {
  if (!image) return null;
  return (
    <Figure>
      <Figure.Image width={"100%"} alt={image.alt} src={image.src} />
      <Figure.Caption>{image.caption}</Figure.Caption>
    </Figure>
  );
};

const TextBlock = ({ text }: { text: string }) => (
  <div dangerouslySetInnerHTML={createMarkup(text)} className="textblock" />
);

type EmptyProps = {};

const MAIN_COLS_LG = 8;

const TEXT_SECTION_MD = MAIN_COLS_LG;

const IMAGE_COLS_LG = 10;

const TextSection = ({ children }: { children: React.ReactNode }) => (
  <Row className={cx(justify)}>
    <Col lg={TEXT_SECTION_MD}>{children}</Col>
  </Row>
);

const ProjectWebsiteButton: React.FC<{ to: string }> = ({ to }) => {
  const initialSpring = { marginLeft: "0px" };
  const [spring, set] = useSpring(() => initialSpring);
  return (
    <a
      href={to}
      className="project"
      onMouseEnter={() => set({ marginLeft: "30px" })}
      onMouseLeave={() => set(initialSpring)}
    >
      Project Website{" "}
      <a.span style={spring}>
        <Chevron />
      </a.span>
    </a>
  );
};

const StudentDetails = ({ student }: IStudentDetailsProps) => {
  return (
    <div id="details">
      <FeaturedImage image={student.thumbnail_image} />
      <Container className="body1">
        {/* <Row className={justify}> */}
        {/* <Col md={12}> */}
        {/* </Col> */}
        {/* </Row> */}

        <Row className={cx(justify, centerText)}>
          <Col lg={MAIN_COLS_LG}>
            <h2>{student.title}</h2>
          </Col>
        </Row>
        <Row className={cx(justify, centerText)}>
          <Col lg={MAIN_COLS_LG} className="tags">
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
          <Col lg={MAIN_COLS_LG}>
            <p
              className="summary"
              dangerouslySetInnerHTML={createMarkup(student.thesis_statement)}
            />
          </Col>
        </Row>
        <Row className={cx(justify, centerText)}>
          <Col lg={10}>
            <Row className="links">
              <Col sm={12}>
                <hr />
              </Col>
              <Col sm={12} md={3} className="linkHolder first">
                <h4>Student</h4>
                <span>{student.student_name}</span>
              </Col>
              <Col sm={12} md={3} className="linkHolder">
                <h4>Portfolio</h4>
                <a href="//www.example.com">www.example.com</a>
              </Col>
              <Col sm={12} md={3} className="linkHolder">
                <h4>Advisor</h4>
                <Link
                  to={`/filter/advisor/${toLowerSnakeCase(
                    student.advisor_name
                  )}`}
                >
                  {student.advisor_name}
                </Link>
              </Col>
              <Col sm={12} md={3} className="linkHolder">
                <h4>Watch</h4>
                <Link to={`/videos/${student.student_slug}`}>
                  <VideoSign />
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <TextSection>
          <h3>Abstract</h3>
          <TextBlock text={student.abstract} />
          <ProjectWebsiteButton to={student.project_url} />
        </TextSection>
        <Row className={justify}>
          <Col lg={IMAGE_COLS_LG}>
            <ImageWithCaption image={student.slide_show[0]} />
          </Col>
        </Row>

        <TextSection>
          <h3>Research</h3>
          <TextBlock text={student.context_research} />
          <h3>Technical Details</h3>
          <TextBlock text={student.technical_details} />
        </TextSection>

        <Row className={justify}>
          <Col lg={IMAGE_COLS_LG}>
            {student.slide_show
              .slice(1, student.slide_show.length - 2)
              .map((image) => (
                <ImageWithCaption key={image.src} image={image} />
              ))}
          </Col>
        </Row>

        <TextSection>
          <h3>Further Reading</h3>
          <TextBlock text={student.further_reading} />
        </TextSection>
      </Container>
    </div>
  );
};

interface IStudentProps {
  studentId: string;
}

const studentToTitle = (student: IStudentDetails) =>
  `${student.title} by ${student.student_name} | ITP Thesis Archive 2020`;

const Student = ({ studentId }: IStudentProps) => {
  const [student, setProject] = useState<IStudentDetails>();

  useEffect(() => {
    async function fetchStudent() {
      const student = await api.getStudent(studentId);
      setProject(student);
    }
    fetchStudent();
  }, [studentId]);

  useEffect(() => {
    if (student) {
      document.title = studentToTitle(student);
      const metaDescription = document.querySelector(
        "meta[name='description']"
      );

      if (metaDescription)
        metaDescription.setAttribute("description", student.thesis_statement);

      const metaOgImageElement = document.querySelector(
        "meta[property='og:image']"
      );

      if (metaOgImageElement) {
        metaOgImageElement.setAttribute("content", student.thumbnail_image.src);
      }
    }
  }, [student]);

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
