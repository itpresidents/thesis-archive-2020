import React, { useEffect, useState } from "react";
import * as api from "./util/api";
import "./App.css";
import Home from "./Home";
import Student from "./Student";
import Topic from "./Topic";
import { Router } from "@reach/router";
import * as queries from "./util/queries";
import { IStudentSummary } from "./types";

interface IAppProps {
  students: IStudentSummary[] | undefined;
}

const App = ({ students }: IAppProps) => {
  const topics = students ? queries.getTopics(students) : {};
  return (
    <div className="container">
      <h1>Thesis Archive 2020</h1>
      <Router>
        <Home path="/" students={students} topics={topics} />
        <Student path="/students/:studentId" />
        <Topic path="/topics/:topicSlug" students={students} topics={topics} />
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
