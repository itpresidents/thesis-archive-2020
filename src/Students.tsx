import React from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { IStudentSummary } from "./types";
import { Card, CardColumns } from "react-bootstrap";

interface IStudentsProps extends RouteComponentProps {
  students: IStudentSummary[];
}

const StudentCard = ({ student }: { student: IStudentSummary }) => (
  <Card>
    <Link to={`/students/${student.student_id}`}>
      {student.portfolio_icon && (
        <Card.Img
          variant="top"
          src={student.portfolio_icon.src}
          alt={student.portfolio_icon.alt}
        ></Card.Img>
      )}
      <Card.ImgOverlay>
        <Card.Title>{student.student_name}</Card.Title>
        <Card.Text>{student.project_title}</Card.Text>
      </Card.ImgOverlay>
    </Link>
  </Card>
);

const Students = ({ students }: IStudentsProps) => (
  <CardColumns>
    {students.map((student) => (
      <StudentCard key={student.student_slug} student={student} />
    ))}
  </CardColumns>
);

export default Students;
