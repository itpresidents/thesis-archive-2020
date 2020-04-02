import React, { useEffect, useState } from "react";

import * as api from "../util/api";
import { IStudentDetails, IStudentSummary } from "../types";
import { Link, RouteComponentProps, redirectTo } from "@reach/router";
import {
  getStudentIdFromSlug,
  getVideoIdFromUrl,
  isNumber,
} from "../util/queries";
import VimeoEmbed from "./VimeoEmbed";

const createMarkup = (html: string) => ({ __html: html });

interface IStudentDetailsProps {
  student: IStudentDetails;
}

const StudentDetails = ({ student }: IStudentDetailsProps) => {
  return (
    <div>
      <h2>
        {student.student_name} - {student.project_title}
      </h2>
      {student.featured_image.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          title={image.title}
        ></img>
      ))}

      <div
        dangerouslySetInnerHTML={createMarkup(student.project_question)}
      ></div>
      <ul>
        <li>Advisor: {student.advisor_name}</li>
        <li>
          Topics:
          <ul>
            {student.topics.map((topic) => (
              <li key={topic.slug}>
                <Link to={`/topics/${topic.slug}`}>{topic.name}</Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
      <VimeoEmbed
        vimeoVideoId={getVideoIdFromUrl(student.video_presentation_url)}
      />
      <h3>Slide show:</h3>
      <ul>
        {student.slide_show.map((slide) => (
          <figure key={slide.src}>
            <img src={slide.src} alt={slide.alt} title={slide.title}></img>
            <figcaption>{slide.caption}</figcaption>
          </figure>
        ))}
      </ul>
      <h3>Further Reading:</h3>
      <div
        dangerouslySetInnerHTML={createMarkup(student.further_reading)}
      ></div>
    </div>
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

  redirectTo(`/students/${studentId}`);

  return null;
};

export default StudentByIdOrSlug;
