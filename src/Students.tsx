import React from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { IStudentSummary } from "./types";

interface IStudentsProps extends RouteComponentProps {
  students: IStudentSummary[];
}

const Students = ({ students }: IStudentsProps) => (
  <ul>
    {students.map((student) => (
      <li key={student.student_id}>
        <Link to={`/students/${student.student_id}`}>
          {student.student_name}
        </Link>
      </li>
    ))}
  </ul>
);

export default Students;
