import React from "react";
import StudentCards from "./components/StudentCards";
import Topics from "./Topics";
import { RouteComponentProps } from "@reach/router";
import { IStudentSummary, TopicDict } from "./types";
import DraggableCards from "./components/DraggableCards";

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
        <DraggableCards students={students} />
      </div>
      {/* let's find another place for topics */}
      {/* <div className="row">
        <Topics topics={topics} />
      </div> */}
    </div>
  );
};

export default Home;
