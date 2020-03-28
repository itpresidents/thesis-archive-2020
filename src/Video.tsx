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

const Video = ({ studentId }: { studentId?: string }) => {
  const [student, setStudent] = useState<IStudentDetails>();

  useEffect(() => {
    async function fetchStudent() {
      if (!studentId) return;
      const student = await api.getStudent(studentId);
      setStudent(student);
    }
    fetchStudent();
  }, [studentId]);

  if (!student) return <div>Loading...</div>;

  return <VideoDetail student={student} />;
};

export default Video;
