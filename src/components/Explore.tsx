import React, { useState, useEffect } from "react";
// import StudentCards from "./StudentCards";
import { IStudentSummary, IFilteredStudent } from "types";
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
  filteredStudents: IFilteredStudent[] | null,
  students: IStudentSummary[],
  filter: (student: IStudentSummary) => boolean
): IFilteredStudent[] => {
  return students.map((student, i) => {
    const passesFilter = filter(student);
    return {
      student: students[i],
      status: updateChangeStatus(filteredStudents, passesFilter, i),
      show: passesFilter,
    };
  });
};

const noFilter = (student: IStudentSummary) => true;

const Explore = ({ students }: IHomeProps) => {
  const [filteredStudents, setFilteredStudents] = useState<
    IFilteredStudent[] | null
  >(null);

  const [validStudents, setValidStudents] = useState<IStudentSummary[] | null>(
    null
  );

  const tagMatch = useRouteMatch<{ tag: string }>("/filter/category/:tag");
  const advisorMatch = useRouteMatch<{ advisor: string }>(
    "/filter/advisor/:advisor"
  );

  const tag = tagMatch && tagMatch.params.tag;
  const advisor = advisorMatch && advisorMatch.params.advisor;

  useEffect(() => {
    if (!students) return;

    if (tag) {
      const tagFilter = queries.matchesTag(tag);

      setFilteredStudents(
        updateFilteredStudents(filteredStudents, students, tagFilter)
      );
    } else if (advisor) {
      const advisorFilter = queries.matchesAvisor(advisor);

      setFilteredStudents(
        updateFilteredStudents(filteredStudents, students, advisorFilter)
      );
    } else {
      setFilteredStudents(
        updateFilteredStudents(filteredStudents, students, noFilter)
      );
    }
  }, [students, tag, advisor, filteredStudents]);

  useEffect(() => {
    if (!filteredStudents) return;

    setValidStudents(
      filteredStudents.filter(({ show }) => show).map(({ student }) => student)
    );
  }, [filteredStudents]);

  if (!validStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <DraggableCards students={validStudents} />
      </div>
      <Footer students={students} />
    </Container>
  );
};

export default Explore;
