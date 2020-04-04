import React from "react";
// import StudentCards from "./StudentCards";
import { RouteComponentProps } from "@reach/router";
import { IStudentSummary, TopicDict } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";
import ContainerDimensions from "react-container-dimensions";

interface IHomeProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
  topics: TopicDict;
}

const Home = ({ students, topics }: IHomeProps) => {
  if (!students) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        <ContainerDimensions>
          {({ width, height }) => (
            <DraggableCards students={students} width={width} height={height} />
          )}
        </ContainerDimensions>
      </div>
    </Container>
  );
};

export default Home;
