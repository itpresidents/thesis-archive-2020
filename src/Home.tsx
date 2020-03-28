import React from "react";
import StudentCards from "./StudentCards";
import Topics from "./Topics";
import { RouteComponentProps } from "@reach/router";
import { IStudentSummary, TopicDict } from "./types";

interface IHomeProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
  topics: TopicDict;
}

const Home = ({ students, topics }: IHomeProps) => {
  if (!students) return <h2>loading...</h2>;

  return (
    <div>
      <div className="row">
        <StudentCards students={students} />
      </div>
      <div className="row">
        <Topics topics={topics} />
      </div>
    </div>
  );
};

export default Home;
