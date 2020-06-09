import React, { useMemo } from "react";
import { IFeaturedImage, IStudentDetails, IImage, ITag } from "types";
import { Figure, Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import cx from "classnames";
import { useSpring, animated as a } from "react-spring";
import { Chevron, VideoSign } from "images/Svg";
import VideoEmbed from "components/Videos/VimeoEmbed";
import { Link } from "react-router-dom";
import parseHtml from "html-react-parser";
import he from "he";

const justify = "justify-content-md-center";
const centerText = "text-center";

const IMAGE_COLS_LG = 10;

const MAIN_COLS_LG = 8;

const TEXT_SECTION_MD = MAIN_COLS_LG;

const createMarkup = (html: string) => ({ __html: html });

// todo: if we can have the server do this job, then let's remove this hack
// https://github.com/itpresidents/thesis-archive-2020/issues/69
const getActualSizeImage = (imgSrc: string): string =>
  imgSrc.replace(/-\d+x\d+(?=\.(png|jpg|jpeg|gif))/, "");

const FeaturedImage = ({ image }: { image: IFeaturedImage | undefined }) => {
  if (!image) return null;
  return (
    <img
      key={image.src}
      src={getActualSizeImage(image.src)}
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
  <div className="textblock">{parseHtml(he.decode(text))}</div>
);

const TextSection = ({ children }: { children: React.ReactNode }) => (
  <Row className={cx(justify)}>
    <Col lg={TEXT_SECTION_MD}>{children}</Col>
  </Row>
);

const SlideShowImageRow = ({ children }: { children: React.ReactNode }) => (
  <Row className={cx(justify, "slide-show-image")}>
    <Col lg={IMAGE_COLS_LG} className="col">
      {children}
    </Col>
  </Row>
);

const SlideShowImage = ({ image }: { image: IImage | undefined }) => (
  <SlideShowImageRow>
    <ImageWithCaption image={image} />
  </SlideShowImageRow>
);

const isEmpty = (text: string | undefined) => !text || text.trim() === "";

const HideIfEmpty = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  if (isEmpty(text)) {
    return null;
  }

  return <>{children}</>;
};

const videoEmbedIdFromurl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

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

const Topic = React.memo(
  ({ topic, notLast }: { topic: ITag; notLast: boolean }) => (
    <>
      <Link key={topic.slug} to={`/filter/category/${topic.slug}`}>
        {he.decode(topic.name)}
      </Link>
      {notLast && " | "}
    </>
  )
);

const DetailsBody = ({ student }: { student: IStudentDetails }) => {
  // const counter = incrementer();

  const videoEmbedId = useMemo(() => {
    if (!student.video_presentation_url) return null;
    return videoEmbedIdFromurl(student.video_presentation_url);
  }, [student.video_presentation_url]);

  return (
    <>
      <FeaturedImage image={student.hero_header_img[0]} />
      <Container className="body1">
        <Row className={cx(justify, centerText)}>
          <Col lg={MAIN_COLS_LG}>
            <h2>{student.project_title}</h2>
          </Col>
        </Row>
        <Row className={cx(justify, centerText)}>
          <Col lg={MAIN_COLS_LG} className="tags">
            {student.topics.map((topic, i) => (
              <Topic
                key={topic.slug}
                topic={topic}
                notLast={i !== student.topics.length - 1}
              />
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
              <Col sm={12} md={3} className="linkHolder first">
                <h4>Student</h4>
                <span>{student.student_name}</span>
              </Col>
              <Col sm={12} md={3} className="linkHolder">
                {student.portfolio_url && (
                  <>
                    <h4>Portfolio</h4>
                    <a href={student.portfolio_url}>{student.portfolio_url}</a>
                  </>
                )}
              </Col>
              <Col sm={12} md={3} className="linkHolder">
                <h4>Advisor</h4>
                <Link to={`/filter/advisor/${student.advisor_id}`}>
                  {student.advisor_name}
                </Link>
              </Col>
              {videoEmbedId && (
                <Col sm={12} md={3} className="linkHolder">
                  <h4>Watch</h4>
                  <a href="#watch">
                    <VideoSign />
                  </a>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
        <TextSection>
          <HideIfEmpty text={student.short_description}>
            <h3>Abstract</h3>
            <TextBlock text={student.short_description} />
          </HideIfEmpty>
          <HideIfEmpty text={student.project_url}>
            <ProjectWebsiteButton to={student.project_url} />
          </HideIfEmpty>
        </TextSection>

        <SlideShowImage image={student.slide_show[0]} />
        <TextSection>
          <HideIfEmpty text={student.context_research}>
            <h3>Research</h3>
            <TextBlock text={student.context_research} />
          </HideIfEmpty>
        </TextSection>
        {videoEmbedId && (
          <SlideShowImageRow>
            <span
              id="watch"
              style={{ position: "relative", top: "-600px" }}
            ></span>
            <VideoEmbed vimeoVideoId={videoEmbedId} />
          </SlideShowImageRow>
        )}
        <TextSection>
          <HideIfEmpty text={student.technical_details}>
            <h3>Technical Details</h3>
            <TextBlock text={student.technical_details} />
          </HideIfEmpty>
        </TextSection>
        {student.slide_show
          .slice(1, 3)
          .map(
            (image) => image && <SlideShowImage key={image.src} image={image} />
          )}
        <HideIfEmpty text={student.further_reading}>
          <TextSection>
            <h3>Further Reading</h3>
            <TextBlock text={student.further_reading} />
          </TextSection>
        </HideIfEmpty>
        {student.slide_show
          .slice(3, 5)
          .map(
            (image) => image && <SlideShowImage key={image.src} image={image} />
          )}
      </Container>
    </>
  );
};

export default DetailsBody;
