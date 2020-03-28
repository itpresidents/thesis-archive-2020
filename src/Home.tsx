import React from "react";
import Students from "./Students";
import Topics from "./Topics";
import { RouteComponentProps } from "@reach/router";
import { IStudentSummary, StringDict } from "./types";

interface IHomeProps extends RouteComponentProps {
  students: IStudentSummary[] | undefined;
  topics: StringDict;
}

const Home = ({ students, topics }: IHomeProps) => {
  if (!students) return <h2>loading...</h2>;

  return (
    <div className="row">
      <div className="col-sm">
        <h2>Students:</h2>
        <Students students={students} />
      </div>
      <div className="col-sm">
        <h2>Topics :</h2>
        <Topics topics={topics} />
      </div>
    </div>
  );
};

export default Home;
