import React, { useEffect, useState } from "react";

import * as api from "./util/api";
import { IStudentDetails } from "./types";
import { Link, RouteComponentProps } from "@reach/router";

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
              <li>
                <Link to={`/topics/${topic.slug}`}>{topic.name}</Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
      <h3>Slide show:</h3>
      <ul>
        {student.slide_show.map((slide) => (
          <figure>
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
  studentId?: string;
}

const Student = ({ studentId }: IStudentProps) => {
  const [student, setProject] = useState<IStudentDetails>();

  useEffect(() => {
    async function fetchStudent() {
      if (!studentId) return;

      const student = await api.getStudent(studentId);
      setProject(student);
    }
    fetchStudent();
  }, [studentId]);

  if (!student) return <div>Loading...</div>;

  return <StudentDetails student={student} />;
};

export default Student;
