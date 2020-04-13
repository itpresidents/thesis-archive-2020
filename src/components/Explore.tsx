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
  const advisorMatch = useRouteMatch<{ advisor: string }>(
    "/filter/advisor/:advisor"
  );

  const tag = tagMatch && tagMatch.params.tag;
  const advisor = advisorMatch && advisorMatch.params.advisor;

  useEffect(() => {
    if (!students) return;

    if (tag) {
      const studentsWithTag = queries.filterByTag(students, tag);
      setFilteredStudents(studentsWithTag);
    } else if (advisor) {
      const studentsWithAdvisor = queries.filterByAdvisorName(
        students,
        advisor
      );
      setFilteredStudents(studentsWithAdvisor);
    } else {
      setFilteredStudents(students);
    }
  }, [students, tag, advisor]);

  if (!filteredStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <ContainerDimensions>
          {({ width, height }) => (
            <DraggableCards
              students={filteredStudents}
              width={width}
              height={height}
            />
          )}
        </ContainerDimensions>
      </div>
      <Footer students={students} />
    </Container>
  );
};

export default Explore;
