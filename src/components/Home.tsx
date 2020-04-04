import React from "react";
// import Topics from "./Topics";
import { RouteComponentProps } from "@reach/router";
import { IStudentSummary, TopicDict } from "types";
import DraggableCards from "./DraggableCards";
import ContainerDimensions from "react-container-dimensions";

interface IHomeProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
  topics: TopicDict;
}

const Home = ({ students, topics }: IHomeProps) => {
  if (!students) return <h2>loading...</h2>;

  return (
    <div>
      <div className="row">
        {/* <StudentCards students={students} /> */}
        <ContainerDimensions>
          {({ width, height }) => (
            <DraggableCards students={students} width={width} height={height} />
          )}
        </ContainerDimensions>
      </div>
      {/* let's find another place for topics */}
      {/* <div className="row">
        <Topics topics={topics} />
      </div> */}
    </div>
  );
};

export default Home;
