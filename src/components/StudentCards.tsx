import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IStudentSummary } from "../types";
import { Card, CardColumns } from "react-bootstrap";
import { shuffle } from "../util/queries";

interface IStudentsProps {
  students?: IStudentSummary[];
}

const StudentCard = ({ student }: { student: IStudentSummary }) => (
  <Card>
    <Link to={`/students/${student.student_id}`}>
      {student.thumbnail_image && (
        <Card.Img
          variant="top"
          src={student.thumbnail_image.src}
          alt={student.thumbnail_image.alt}
        ></Card.Img>
      )}
      <Card.ImgOverlay>
        <Card.Title>{student.student_name}</Card.Title>
        <Card.Text>{student.title}</Card.Text>
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
