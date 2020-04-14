import React, { useState, useEffect } from "react";
// import StudentCards from "./StudentCards";
import { IStudentSummary, IFilteredStudent, IStudentFilter } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import Footer from "./Footer";
import { useRouteMatch } from "react-router-dom";
import * as queries from "util/queries";

interface IHomeProps {
  students: IStudentSummary[] | undefined;
}

const updateChangeStatus = (
  filteredStudents: IFilteredStudent[] | null,
  show: boolean,
  index: number
) => {
  if (!filteredStudents || !filteredStudents[index]) {
    return "nochange";
  } else {
    const lastShow = filteredStudents[index].show;

    if (lastShow === show) return "nochange";
    if (show) return "add";
    return "remove";
  }
};

const updateFilteredStudents = (
  students: IStudentSummary[],
  filter: (student: IStudentSummary) => boolean
): IFilteredStudent[] => {
  return students.map((student) => ({
    show: filter(student),
    student,
  }));
};

const noFilter = (student: IStudentSummary) => true;

const Explore = ({ students }: IHomeProps) => {
  const [filteredStudents, setFilteredStudents] = useState<
    IFilteredStudent[] | null
  >(null);

  const tagMatch = useRouteMatch<{ tag: string }>("/filter/category/:tag");
  const advisorMatch = useRouteMatch<{ advisor: string }>(
    "/filter/advisor/:advisor"
  );

  const tag = tagMatch && tagMatch.params.tag;
  const advisor = advisorMatch && advisorMatch.params.advisor;

  useEffect(() => {
    if (!students) return;

    if (tag) {
      setFilteredStudents(
        updateFilteredStudents(students, queries.matchesTag(tag))
      );
    } else if (advisor) {
      setFilteredStudents(
        updateFilteredStudents(students, queries.matchesAvisor(advisor))
      );
    } else {
      setFilteredStudents(updateFilteredStudents(students, noFilter));
    }
  }, [students, tag, advisor]);

  if (!filteredStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <DraggableCards filteredStudents={filteredStudents} />
      </div>
      <Footer students={students} />
    </Container>
  );
};

export default Explore;
