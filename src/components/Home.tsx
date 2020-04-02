import React from "react";
// import StudentCards from "./StudentCards";
import { RouteComponentProps } from "@reach/router";
import { IStudentSummary, TopicDict } from "types";
import DraggableCards from "./DraggableCards";
import { Container } from "react-bootstrap";

interface IHomeProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
  topics: TopicDict;
}

const Home = ({ students, topics }: IHomeProps) => {
  if (!students) return <h2>loading...</h2>;

  return (
    <Container fluid>
      <div className="row">
        {/* <StudentCards students={students} /> */}
        <DraggableCards students={students} />
      </div>
      {/* let's find another place for topics */}
      {/* <div className="row">
        <Topics topics={topics} />
      </div> */}
    </Container>
  );
};

export default Home;
