import React, { useState, useEffect } from "react";
// import StudentCards from "./StudentCards";
import { IStudentSummary, IStudentFilter } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import ContainerDimensions from "react-container-dimensions";
import Footer from "./Footer";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import * as queries from "util/queries";

interface IHomeProps {
  students: IStudentSummary[] | undefined;
}

const Explore = ({ students }: IHomeProps) => {
  const [filteredStudents, setFilteredStudents] = useState<
    IStudentSummary[] | undefined
  >();

  const tagMatch = useRouteMatch<{ tag: string }>("/filter/category/:tag");

  const tag = tagMatch && tagMatch.params.tag;

  useEffect(() => {
    if (!students) return;

    if (!tag) {
      setFilteredStudents(students);
    } else {
      const studentsWithTag = queries.filterByTag(students, tag);
      setFilteredStudents(studentsWithTag);
    }
  }, [students, tag]);

  if (!filteredStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <DraggableCards students={filteredStudents} />
      </div>
      <Footer students={students} />
    </Container>
  );
};

export default Explore;
