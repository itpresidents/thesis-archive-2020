import React, { useState, useEffect } from "react";
// import StudentCards from "./StudentCards";
import { IStudentSummary, IStudentFilter } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import ContainerDimensions from "react-container-dimensions";
import Footer from "./Footer";

interface IHomeProps {
  students: IStudentSummary[] | undefined;
}

const Explore = ({ students }: IHomeProps) => {
  const [filter, setFilter] = useState<IStudentFilter | undefined>();
  const [filteredStudents, setFilteredStudents] = useState<
    IStudentSummary[] | undefined
  >();

  useEffect(() => {
    if (!students) return;

    if (!filter) {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(filter(students));
    }
  }, [students, filter]);

  if (!filteredStudents) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <ContainerDimensions>
          {({ width, height }) => (
            <DraggableCards students={students} width={width} height={height} />
          )}
        </ContainerDimensions>
      </div>
      <Footer students={students} />
    </Container>
  );
};

export default Explore;
