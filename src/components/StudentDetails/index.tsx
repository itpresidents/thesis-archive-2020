import React, { useEffect, useState } from "react";

import * as api from "util/api";
import { IStudentDetails, IStudentSummary } from "types";
import { useParams, Redirect } from "react-router-dom";
import {
  getStudentIdFromSlug,
  getStudentSlugFromId,
  isNumber,
} from "util/queries";

import DetailsBody from "./DetailsBody";
import DetailsFooter from "./DetailsFooter";

interface IStudentDetailsProps {
  student: IStudentDetails;
  students: IStudentSummary[] | undefined;
}

type EmptyProps = {};

const StudentDetails = ({ student, students }: IStudentDetailsProps) => {
  useEffect(() => {
    // scroll to dop of body when student changes
    document.body.scrollTo({ top: 0 });
  }, [student]);

  return (
    <div className="contents">
      <DetailsBody student={student} />
      <DetailsFooter student={student} students={students} />
    </div>
  );
};

interface IStudentProps {
  studentId: string;
  students: IStudentSummary[] | undefined;
}

const studentToTitle = (student: IStudentDetails) =>
  `${student.project_title} by ${student.student_name} | ITP Thesis Archive 2020`;

const Student = ({ studentId, students }: IStudentProps) => {
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
        metaDescription.setAttribute("description", student.project_question);

      const metaOgImageElement = document.querySelector(
        "meta[property='og:image']"
      );

      if (metaOgImageElement && student.portfolio_thumbnail) {
        metaOgImageElement.setAttribute(
          "content",
          student.portfolio_thumbnail.src
        );
      }
    }
  }, [student]);

  if (!student) return <div>Loading...</div>;

  return <StudentDetails student={student} students={students} />;
};

interface IStudentByIdOrSlugProps {
  studentIdOrSlug?: string;
  students: IStudentSummary[] | undefined;
}

const StudentByIdOrSlug = ({ students }: IStudentByIdOrSlugProps) => {
  const { studentIdOrSlug } = useParams<{ studentIdOrSlug?: string }>();

  if (!studentIdOrSlug) return <Redirect to="/" />;

  if (isNumber(studentIdOrSlug)) {
    const studentSlug = getStudentSlugFromId(api.getSlugs(), studentIdOrSlug);
    return <Redirect to={`/students/${studentSlug}`} />;
  }

  if (!students) return null;

  const studentId = getStudentIdFromSlug(api.getSlugs(), studentIdOrSlug);

  if (!studentId) return <Redirect to="/" />;

  return <Student studentId={studentId} students={students} />;
};

export default StudentByIdOrSlug;
