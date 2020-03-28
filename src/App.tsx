import React, { useEffect, useState } from "react";
import * as api from "./util/api";
import "./App.css";
import Home from "./Home";
import Student from "./Student";
import Topic from "./Topic";
import { Router } from "@reach/router";
import * as queries from "./util/queries";
import { IStudentSummary } from "./types";
import Header from "./Header";
import Videos from "./Videos";
import Video from "./Video";

interface IAppProps {
  students: IStudentSummary[] | undefined;
}

const App = ({ students }: IAppProps) => {
  const topics = students ? queries.getTopics(students) : {};
  return (
    <div className="container">
      <Header />
      <Router>
        <Home path="/" students={students} topics={topics} />
        <Student path="students/:studentIdOrSlug" students={students} />
        <Topic path="topics/:topicSlug" students={students} topics={topics} />
        <Videos path="videos">
          <Video path=":studentIdOrSlug" students={students} />
        </Videos>
      </Router>
    </div>
  );
};

const AppContainer = () => {
  const [students, setStudents] = useState<IStudentSummary[]>();

  useEffect(() => {
    async function fetchAllStudents() {
      const students = await api.getAllStudents();
      setStudents(students);
    }
    fetchAllStudents();
  });

  return <App students={students} />;
};

export default AppContainer;
