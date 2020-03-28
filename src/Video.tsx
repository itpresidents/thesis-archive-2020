import React, { useEffect, useState } from "react";
import { IStudentSummary, IStudentDetails } from "./types";
import { getStudentIdFromSlug, getVideoIdFromUrl } from "./util/queries";
import { isNumber } from "./util/queries";
import { redirectTo, RouteComponentProps } from "@reach/router";
import * as api from "./util/api";
import VimeoEmbed from "./VimeoEmbed";

const VideoDetail = ({ student }: { student: IStudentDetails }) => (
  <div>
    <h3>{student.student_name}</h3>
    <VimeoEmbed
      vimeoVideoId={getVideoIdFromUrl(student.video_presentation_url)}
    />
  </div>
);

const Video = ({ studentId }: { studentId: string }) => {
  const [student, setStudent] = useState<IStudentDetails>();

  useEffect(() => {
    async function fetchStudent() {
      const student = await api.getStudent(studentId);
      setStudent(student);
    }
    fetchStudent();
  }, [studentId]);

  if (!student) return <div>Loading...</div>;

  return <VideoDetail student={student} />;
};

interface IVideoContainerProps extends RouteComponentProps {
  studentIdOrSlug?: string;
  students: IStudentSummary[] | undefined;
}

const VideoContainer = ({
  studentIdOrSlug,
  students,
}: IVideoContainerProps) => {
  console.log("student id or slug", studentIdOrSlug);
  if (!studentIdOrSlug) return <div />;

  if (isNumber(studentIdOrSlug)) {
    return <Video studentId={studentIdOrSlug} />;
  }

  if (!students) return null;

  const studentId = getStudentIdFromSlug(students, studentIdOrSlug);

  console.log("redirecting");
  redirectTo(`/videos/${studentId}`);

  return null;
};

export default VideoContainer;
