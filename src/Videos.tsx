import React, { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Row, Col } from "react-bootstrap";

import { schedule } from "./scrapedSchedules/schedule-2018.json";
import {
  VideoScheduleRowContents,
  VideoScheduleStudent,
  IStudentSummary,
} from "./types";
import { getStudentIdFromSlug, selectRandom } from "./util/queries";
import Video from "./Video";
import cx from "classnames";

const VideoCell = ({
  student,
  activeSlug,
}: {
  student: VideoScheduleStudent | undefined;
  activeSlug?: string;
}) => (
  <Col md={2}>
    {student && (
      <Link
        to={`/videos/${student.slug}`}
        className={cx("badge", {
          ["badge-primary"]: activeSlug === student.slug,
        })}
      >
        {student.name}
      </Link>
    )}
  </Col>
);

const videoScheduleRows = schedule as VideoScheduleRowContents[];

const Schedule = ({ studentSlug }: { studentSlug: string | undefined }) => (
  <div>
    <Row>
      <Col md={2}>Time</Col>
      <Col md={2}>Tuesday</Col>
      <Col md={2}>Wednesday</Col>
      <Col md={2}>Thursday</Col>
      <Col md={2}>Friday</Col>
    </Row>
    {videoScheduleRows.map((row) => (
      <Row key={row.time}>
        <Col md={2}>{row.time}</Col>
        <VideoCell student={row.tuesday} activeSlug={studentSlug} />
        <VideoCell student={row.wednesday} activeSlug={studentSlug} />
        <VideoCell student={row.thursday} activeSlug={studentSlug} />
        <VideoCell student={row.friday} activeSlug={studentSlug} />
      </Row>
    ))}
  </div>
);

interface IVideosProps {
  studentSlug?: string;
  studentId?: string;
}

const Videos = ({ studentSlug, studentId }: IVideosProps) => (
  <Row>
    <Col md={7}>
      <Video studentId={studentId} />
    </Col>
    <Col md={5}>
      <Schedule studentSlug={studentSlug} />
    </Col>
  </Row>
);

interface IVideosContainerProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
  studentSlug?: string;
}

const VideosContainer = ({ studentSlug, students }: IVideosContainerProps) => {
  const [activeSlug, setActiveSlug] = useState<string>();
  const [studentId, setStudentId] = useState<string>();

  useEffect(() => {
    if (activeSlug) {
      if (studentSlug && studentSlug !== activeSlug) {
        setActiveSlug(studentSlug);
      }
    }
    if (!activeSlug) {
      if (studentSlug) {
        setActiveSlug(studentSlug);
      } else if (students) {
        const randomStudent = selectRandom(students);
        setActiveSlug(randomStudent.student_slug);
      }
    }
  }, [studentSlug, activeSlug, students]);

  useEffect(() => {
    async function fetchStudentId() {
      if (students && activeSlug) {
        const studentId = getStudentIdFromSlug(students, activeSlug);
        setStudentId(studentId);
      }
    }
    fetchStudentId();
  }, [activeSlug, students]);

  return <Videos studentSlug={activeSlug} studentId={studentId} />;
};

export default VideosContainer;
