import React, { useEffect, useState } from "react";

import * as api from "util/api";
import { IStudentDetails, IStudentSummary } from "types";
import { useParams } from "react-router-dom";
import { getStudentIdFromSlug, isNumber } from "util/queries";

import DetailsBody from "./DetailsBody";

interface IStudentDetailsProps {
  student: IStudentDetails;
}

type EmptyProps = {};

const StudentDetails = ({ student }: IStudentDetailsProps) => {
  return (
    <div id="details">
      <DetailsBody student={student} />
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
