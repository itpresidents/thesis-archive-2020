import React, { useEffect, useState } from "react";
import * as api from "util/api";
import "scss/styles.scss";
import Explore from "./Explore";
import StudentDetails from "./StudentDetails";
import { Router } from "@reach/router";
import { IStudentSummary } from "types";
import Header from "./Header";
import Videos from "./Videos";
import NotFound from "./NotFound";
import Footer, { FooterMain } from "./Footer";

interface IAppProps {
  students: IStudentSummary[] | undefined;
}

const App = ({ students }: IAppProps) => {
  return (
    <>
      <Header />
      <Router>
        <StudentDetails path="students/:studentIdOrSlug" students={students} />
        <Videos path="videos" students={students} />
        <Videos path="videos/:studentSlug" students={students} />
        <Explore path="/" students={students} />
      </Router>
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
