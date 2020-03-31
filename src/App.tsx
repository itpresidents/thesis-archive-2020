import React, { useEffect, useState } from "react";
import * as api from "./util/api";
import "./scss/styles.scss";
import Home from "./Home";
import Student from "./Student";
import Topic from "./Topic";
import { Router } from "@reach/router";
import * as queries from "./util/queries";
import { IStudentSummary } from "./types";
import Header from "./components/Header";
import Videos from "./Videos";

interface IAppProps {
  students: IStudentSummary[] | undefined;
}

const App = ({ students }: IAppProps) => {
  const topics = students ? queries.getTopics(students) : {};

  return (
    <>
      <Header />
      <div className="container">
        <Router>
          <Home path="/" students={students} topics={topics} />
          <Student path="students/:studentIdOrSlug" students={students} />
          <Topic path="topics/:topicSlug" students={students} topics={topics} />
          <Videos path="videos" students={students} />
          <Videos path="videos/:studentSlug" students={students} />
        </Router>
      </div>
    </>
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
  }, []);

  return <App students={students} />;
};

export default AppContainer;
