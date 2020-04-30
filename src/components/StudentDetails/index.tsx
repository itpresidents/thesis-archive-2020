import React, { useEffect, useState } from "react";

import * as api from "util/api";
import { IStudentDetails, IStudentSummary } from "types";
import { useParams } from "react-router-dom";
import { getStudentIdFromSlug, isNumber } from "util/queries";

import DetailsBody from "./DetailsBody";
import DetailsFooter from "./DetailsFooter";

interface IStudentDetailsProps {
  student: IStudentDetails;
  students: IStudentSummary[] | undefined;
}

type EmptyProps = {};

const StudentDetails = ({ student, students }: IStudentDetailsProps) => {
  return (
    <div id="details">
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

      if (metaOgImageElement) {
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

  if (!studentIdOrSlug) return null;

  if (isNumber(studentIdOrSlug)) {
    return <Student studentId={studentIdOrSlug} students={students} />;
  }

  if (!students) return null;

  const studentId = getStudentIdFromSlug(students, studentIdOrSlug);

  return <Student studentId={studentId} students={students} />;
};

export default StudentByIdOrSlug;
