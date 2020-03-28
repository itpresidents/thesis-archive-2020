import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import { IStudentSummary } from "./types";
import { Card, CardColumns } from "react-bootstrap";
import { shuffle } from "./util/queries";

interface IStudentsProps extends RouteComponentProps {
  students?: IStudentSummary[];
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

const StudentCards = ({ students }: IStudentsProps) => (
  <CardColumns>
    {students &&
      students.map((student) => (
        <StudentCard key={student.student_slug} student={student} />
      ))}
  </CardColumns>
);

const StudentCardsRandomizer = ({ students }: IStudentsProps) => {
  const [shuffledStudents, setShuffledStudents] = useState<IStudentSummary[]>();

  useEffect(() => {
    if (!shuffledStudents && students) {
      setShuffledStudents(shuffle(students));
    }
  }, [students, shuffledStudents]);

  return <StudentCards students={shuffledStudents} />;
};

export default StudentCardsRandomizer;
