import React from "react";
import { IFeaturedImage, IStudentDetails, IImage } from "types";
import { Figure, Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import cx from "classnames";
import { useSpring, animated as a } from "react-spring";
import { Chevron, VideoSign } from "images/Svg";
import { Link } from "react-router-dom";
import { toLowerSnakeCase } from "util/queries";

const justify = "justify-content-md-center";
const centerText = "text-center";

const IMAGE_COLS_LG = 10;

const MAIN_COLS_LG = 8;

const TEXT_SECTION_MD = MAIN_COLS_LG;

const createMarkup = (html: string) => ({ __html: html });

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

const TextSection = ({ children }: { children: React.ReactNode }) => (
  <Row className={cx(justify)}>
    <Col lg={TEXT_SECTION_MD}>{children}</Col>
  </Row>
);

const SlideShowImage = ({ image }: { image: IImage | undefined }) => (
  <Row className={cx(justify, "slide-show-image")}>
    <Col lg={IMAGE_COLS_LG} className="col">
      <ImageWithCaption image={image} />
    </Col>
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

const DetailsBody = ({ student }: { student: IStudentDetails }) => (
  <>
    <FeaturedImage image={student.hero_header_image} />
    <Container className="body1">
      {/* <Row className={justify}> */}
      {/* <Col md={12}> */}
      {/* </Col> */}
      {/* </Row> */}

      <Row className={cx(justify, centerText)}>
        <Col lg={MAIN_COLS_LG}>
          <h2>{student.project_title}</h2>
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col lg={MAIN_COLS_LG} className="tags">
          {student.topics.map((topic, i) => (
            <>
              <Link key={topic.slug} to={`/filter/category/${topic.slug}`}>
                {topic.name}
              </Link>
              {i !== student.topics.length - 1 && " | "}
            </>
          ))}
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col lg={MAIN_COLS_LG}>
          <p
            className="summary"
            dangerouslySetInnerHTML={createMarkup(student.project_question)}
          />
        </Col>
      </Row>
      <Row className={cx(justify, centerText)}>
        <Col lg={10}>
          <Row className="links">
            <Col sm={12}>
              <hr />
            </Col>
            <Col sm={12} md={4} className="linkHolder first">
              <h4>Student</h4>
              <span>{student.student_name}</span>
            </Col>
            <Col sm={12} md={4} className="linkHolder">
              {student.portfolio_url && (
                <>
                  <h4>Portfolio</h4>
                  <a href={student.portfolio_url}>{student.portfolio_url}</a>
                </>
              )}
            </Col>
            <Col sm={12} md={4} className="linkHolder">
              <h4>Advisor</h4>
              <Link
                to={`/filter/advisor/${toLowerSnakeCase(
                  student.advisor_name || ""
                )}`}
              >
                {student.advisor_name}
              </Link>
            </Col>
            {/* <Col sm={12} md={3} className="linkHolder">
              <h4>Watch</h4>
              <Link to={`/videos/${student.student_slug}`}>
                <VideoSign />
              </Link>
            </Col> */}
          </Row>
        </Col>
      </Row>
      <TextSection>
        <h3>Abstract</h3>
        <TextBlock text={student.short_description} />
        <ProjectWebsiteButton to={student.project_url} />
      </TextSection>
      <SlideShowImage image={student.slide_show[0]} />
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
      {student.further_reading !== "" && (
        <TextSection>
          <h3>Further Reading</h3>
          <TextBlock text={student.further_reading} />
        </TextSection>
      )}
    </Container>
  </>
);

export default DetailsBody;
