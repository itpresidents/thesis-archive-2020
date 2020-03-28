import React, { ReactNode } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Row, Col } from "react-bootstrap";

import { schedule } from "./scrapedSchedules/schedule-2018.json";
import { VideoScheduleRowContents, VideoScheduleStudent } from "./types";

interface IVideoProps {
  rows: VideoScheduleRowContents[];
  children: ReactNode;
}

const VideoCell = ({
  student,
}: {
  student: VideoScheduleStudent | undefined;
}) => (
  <Col md={2}>
    {student && <Link to={`/videos/${student.slug}`}>{student.name}</Link>}
  </Col>
);

const Schedule = ({ rows }: { rows: VideoScheduleRowContents[] }) => (
  <div>
    <Row>
      <Col md={2}>Time</Col>
      <Col md={2}>Tuesday</Col>
      <Col md={2}>Wednesday</Col>
      <Col md={2}>Thursday</Col>
      <Col md={2}>Friday</Col>
    </Row>
    {rows.map((row) => (
      <Row key={row.time}>
        <Col md={2}>{row.time}</Col>
        <VideoCell student={row.tuesday} />
        <VideoCell student={row.wednesday} />
        <VideoCell student={row.thursday} />
        <VideoCell student={row.friday} />
      </Row>
    ))}
  </div>
);

const Videos = ({ rows, children }: IVideoProps) => (
  <Row>
    <Col md={7}>{children}</Col>
    <Col md={5}>
      <Schedule rows={rows} />
    </Col>
  </Row>
);

interface IVideosContainerProps extends RouteComponentProps {
  children: ReactNode;
}

const VideosContainer = (props: IVideosContainerProps) => {
  const videoScheduleRows = schedule as VideoScheduleRowContents[];
  return <Videos rows={videoScheduleRows} children={props.children} />;
};

export default VideosContainer;
